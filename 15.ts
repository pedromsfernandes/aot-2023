type BoxToys<T extends string, N extends number, Acc extends Array<T> = [T]> = N extends Acc["length"]
  ? Acc
  : BoxToys<T, N, [T, ...Acc]>;
