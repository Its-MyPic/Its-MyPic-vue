declare module 'opencc-js/core' {
  export type Dictionary = {
    dict: {
      [key: string]: string[];
    };
    concat(dict: [string[][]]): Dictionary;
  };

  export function ConverterFactory(
    fromDict: Dictionary,
    toDict: Dictionary
  ): (text: string) => string;
}

declare module 'opencc-js/preset' {
  import type { Dictionary } from 'opencc-js/core';
  
  export const from: {
    cn: Dictionary;
    tw: Dictionary;
  };

  export const to: {
    cn: Dictionary;
    tw: Dictionary;
  };
}
