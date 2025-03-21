interface ErrorPayload {
  name: string;
  message: string;
  stack?: string;
  userAgent?: string;
  additionalInfo?: Record<string, unknown>;
}

interface ErrorReportConfig {
  webhookUrl: string;
  context?: string;
}

export function useErrorReporting(config: ErrorReportConfig) {
  const formatError = (error: Error, additionalInfo?: Record<string, unknown>): ErrorPayload => ({
    name: error.name,
    message: error.message,
    stack: error.stack,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    additionalInfo,
  });

  const reportError = async (
    error: Error | string,
    additionalInfo?: Record<string, unknown>
  ): Promise<void> => {
    const errorPayload = typeof error === 'string'
      ? formatError(new Error(error), additionalInfo)
      : formatError(error, additionalInfo);

    const content = [
      `Error in ${config.context || 'unknown context'}:`,
      `Name: ${errorPayload.name}`,
      `Message: ${errorPayload.message}`,
      errorPayload.userAgent ? `UserAgent: ${errorPayload.userAgent}` : null,
      errorPayload.stack ? `Stack: ${errorPayload.stack}` : null,
      errorPayload.additionalInfo ? `Additional Info: ${JSON.stringify(errorPayload.additionalInfo, null, 2)}` : null,
    ].filter(Boolean).join('\n\n');

    try {
      await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    } catch (e) {
      console.error('Failed to send error report:', e);
    }
  };

  const reportWithContext = (context: string) => {
    return (error: Error | string, additionalInfo?: Record<string, unknown>) => {
      return reportError(error, { ...additionalInfo, context });
    };
  };

  return {
    reportError,
    reportWithContext,
  };
}
