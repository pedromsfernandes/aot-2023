type Count<T extends Array<any>, Toy extends string, Matching extends Array<string> = []> = T extends [
  infer Head,
  ...infer Tail
]
  ? Head extends Toy
    ? Count<Tail, Toy, [...Matching, Head]>
    : Count<Tail, Toy, Matching>
  : Matching["length"];
