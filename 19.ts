type Gifts = ["🛹", "🚲", "🛴", "🏄"];

type Rebuild<T extends Array<number>, Acc extends Array<string> = [], Explored extends Array<string> = []> = T extends [
  infer Head extends number,
  ...infer Tail extends Array<number>
]
  ? Explored["length"] extends Gifts["length"]
    ? Rebuild<Tail, Push<Acc, Head, Gifts[0]>, [Gifts[0]]>
    : Rebuild<Tail, Push<Acc, Head, Gifts[Explored["length"]]>, [...Explored, Gifts[Explored["length"]]]>
  : Acc;

type Push<
  Arr extends Array<string>,
  Count extends number,
  Str extends string,
  Acc extends Array<string> = [Str]
> = Acc["length"] extends Count ? [...Arr, ...Acc] : Push<Arr, Count, Str, [...Acc, Str]>;
