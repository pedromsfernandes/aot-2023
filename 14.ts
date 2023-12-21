type DecipherNaughtyList<T extends string, List extends Array<string> = []> = T extends `${infer L}/${infer R}`
  ? DecipherNaughtyList<R, [L, ...List]>
  : List[number] | T;
