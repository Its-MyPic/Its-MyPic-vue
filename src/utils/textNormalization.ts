export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace("你", "妳")
    .replace("啊", "阿")
    .trim();
}
