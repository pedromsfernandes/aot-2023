type FindSantaArray<T extends Array<any>, Acc extends Array<any> = []> = T extends [infer Head, ...infer Tail]
  ? Head extends "🎅🏼"
    ? Acc["length"]
    : FindSantaArray<Tail, [...Acc, Head]>
  : never;

type FindSanta<T extends Array<Array<any>>, Acc extends Array<any> = []> = T extends [
  infer Head extends any[],
  ...infer Tail extends any[][]
]
  ? FindSantaArray<Head> extends never
    ? FindSanta<Tail, [...Acc, Head]>
    : [Acc["length"], FindSantaArray<Head>]
  : never;
