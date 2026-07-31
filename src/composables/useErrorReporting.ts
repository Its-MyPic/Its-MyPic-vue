import type { RouteLocationNormalized } from 'vue-router';
import { ref } from 'vue';
import settings from '@/assets/setting.json';

interface SystemInfo {
  timestamp: number;
  timeZone: string;
  platform: string;
  screenResolution?: string;
  language: string;
  memoryUsage?: number;
}

interface UserContext {
  path: string;
  lastAction?: string;
  componentStack?: string[];
  lastStateChange?: Record<string, unknown>;
}

interface ErrorPayload {
  name: string;
  message: string;
  stack?: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  systemInfo: SystemInfo;
  userContext: UserContext;
  additionalInfo?: Record<string, unknown>;
}

interface ErrorReportConfig {
  webhookUrl?: string;
  context?: string;
  maxRetries?: number;
  batchSize?: number;
}

const webhookUrl = `https://discord.com/api/webhooks/${atob(settings.webhook)}`;

// 模組層級單例狀態，避免每個 composable instance 各建立一份
const actionHistory = ref<string[]>([]);
const componentStack = ref<string[]>([]);
const lastStateChanges = ref<Record<string, unknown>>({});

interface PerformanceWithMemory extends Performance {
  memory?: { usedJSHeapSize?: number };
}

// 收集系統信息
const getSystemInfo = (): SystemInfo => ({
  timestamp: Date.now(),
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
  screenResolution: typeof window !== 'undefined'
    ? `${window.screen.width}x${window.screen.height}`
    : undefined,
  language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
  memoryUsage: (performance as PerformanceWithMemory)?.memory?.usedJSHeapSize,
});

// 收集用戶上下文
const getUserContext = (route?: RouteLocationNormalized): UserContext => ({
  path: route?.path || (typeof window !== 'undefined' ? window.location.pathname : ''),
  lastAction: actionHistory.value[actionHistory.value.length - 1],
  componentStack: [...componentStack.value],
  lastStateChange: { ...lastStateChanges.value },
});

// 追蹤用戶操作
export const trackAction = (action: string) => {
  actionHistory.value = [...actionHistory.value.slice(-9), action];
};

// 追蹤組件堆棧
export const trackComponent = (componentName: string, isEntering: boolean) => {
  if (isEntering) {
    componentStack.value.push(componentName);
  } else {
    const index = componentStack.value.lastIndexOf(componentName);
    if (index !== -1) {
      componentStack.value.splice(index, 1);
    }
  }
};

// 追蹤狀態變化
export const trackStateChange = (key: string, value: unknown) => {
  lastStateChanges.value[key] = value;
  // 只保留最後10個狀態變化
  if (Object.keys(lastStateChanges.value).length > 10) {
    const keys = Object.keys(lastStateChanges.value);
    const firstKey = keys.shift();
    if (firstKey) delete lastStateChanges.value[firstKey];
  }
};

const getSeverity = (error: Error): ErrorPayload['severity'] => {
  if (error instanceof TypeError || error instanceof ReferenceError) {
    return 'critical';
  }
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return 'high';
  }
  if (error.message.includes('undefined') || error.message.includes('null')) {
    return 'medium';
  }
  return 'low';
};

const formatError = (
  error: Error,
  route?: RouteLocationNormalized,
  additionalInfo?: Record<string, unknown>
): ErrorPayload => ({
  name: error.name,
  message: error.message,
  stack: error.stack,
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  severity: getSeverity(error),
  systemInfo: getSystemInfo(),
  userContext: getUserContext(route),
  additionalInfo,
});

// 統一的 Discord webhook 送出函式
export const sendDiscordMessage = async (content: string): Promise<void> => {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
};

// 嘗試重新發送失敗的報告
const retryFailedReports = async () => {
  if (typeof localStorage === 'undefined') return;
  const failedReports = JSON.parse(localStorage.getItem('failedErrorReports') || '[]');
  if (failedReports.length === 0) return;

  const newFailedReports = [];
  for (const report of failedReports) {
    try {
      await sendDiscordMessage(report.content);
    } catch {
      if (Date.now() - report.timestamp < 24 * 60 * 60 * 1000) {
        // 只保留24小時內的失敗報告
        newFailedReports.push(report);
      }
    }
  }
  localStorage.setItem('failedErrorReports', JSON.stringify(newFailedReports));
};

// 定期嘗試重新發送失敗的報告，模組層級只初始化一次
if (typeof window !== 'undefined') {
  setInterval(retryFailedReports, 30 * 60 * 1000); // 每30分鐘
}

export const reportError = async (
  error: Error | string,
  context = 'unknown',
  route?: RouteLocationNormalized,
  additionalInfo?: Record<string, unknown>
): Promise<void> => {
  const errorPayload = typeof error === 'string'
    ? formatError(new Error(error), route, additionalInfo)
    : formatError(error, route, additionalInfo);

  const content = [
    `[${errorPayload.severity.toUpperCase()}] Error in ${context}:`,
    `Time: ${new Date(errorPayload.systemInfo.timestamp).toISOString()}`,
    `Name: ${errorPayload.name}`,
    `Message: ${errorPayload.message}`,
    `Path: ${errorPayload.userContext.path}`,
    `Last Action: ${errorPayload.userContext.lastAction || 'none'}`,
    `Component Stack: ${errorPayload.userContext.componentStack?.join(' -> ')}`,
    errorPayload.userAgent ? `UserAgent: ${errorPayload.userAgent}` : null,
    `System Info: ${JSON.stringify(errorPayload.systemInfo, null, 2)}`,
    errorPayload.stack ? `Stack: ${errorPayload.stack}` : null,
    errorPayload.additionalInfo ? `Additional Info: ${JSON.stringify(errorPayload.additionalInfo, null, 2)}` : null,
    errorPayload.userContext.lastStateChange ? `Last State Changes: ${JSON.stringify(errorPayload.userContext.lastStateChange, null, 2)}` : null,
  ].filter(Boolean).join('\n\n');

  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      await sendDiscordMessage(content);
      break;
    } catch (e) {
      retryCount++;
      if (retryCount === maxRetries) {
        console.error('Failed to send error report after multiple retries:', e);
        // 保存到本地存儲以便稍後重試
        if (typeof localStorage !== 'undefined') {
          const failedReports = JSON.parse(localStorage.getItem('failedErrorReports') || '[]');
          failedReports.push({ content, timestamp: Date.now() });
          localStorage.setItem('failedErrorReports', JSON.stringify(failedReports));
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }
};

export function useErrorReporting(config: ErrorReportConfig) {
  const context = config.context || 'unknown';

  return {
    reportError: (error: Error | string, route?: RouteLocationNormalized, additionalInfo?: Record<string, unknown>) =>
      reportError(error, context, route, additionalInfo),
    reportWithContext: (c: string) =>
      (error: Error | string, route?: RouteLocationNormalized, additionalInfo?: Record<string, unknown>) =>
        reportError(error, c, route, additionalInfo),
    trackAction,
    trackComponent,
    trackStateChange,
  };
}
