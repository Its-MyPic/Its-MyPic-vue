import * as OpenCC from "opencc-js/core";
import * as Locale from "opencc-js/preset";

const customDict = [
  ["你", "妳"],
  ["阿", "啊"],
  ["他", "她"],
  ["…", "..."],
  ["＂", '"'],
  ["？", "?"],
  ["！", "!"],
  ["：", ":"],
  ["、", "'"],
  ["，", ","],
];

const converter = OpenCC.ConverterFactory(
  Locale.from.cn,
  Locale.from.tw.concat([customDict]),
);

export function normalizeText(text: string): string {
  return converter(text.trim()).toLowerCase();
}
