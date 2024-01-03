/** because "dashing" implies speed */
type Dasher = "💨";

/** representing dancing or grace */
type Dancer = "💃";

/** a deer, prancing */
type Prancer = "🦌";

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟";

/** for the celestial body that shares its name */
type Comet = "☄️";

/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️";

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️";

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡";

/** for his famous red nose */
type Rudolph = "🔴";

type Reindeer = Dasher | Dancer | Prancer | Vixen | Comet | Cupid | Donner | Blitzen | Rudolph;

type HasDuplicates<T extends Reindeer[]> = T extends [infer Head extends Reindeer, ...infer Rest extends Reindeer[]]
  ? Exists<Rest, Head> extends true
    ? true
    : HasDuplicates<Rest>
  : false;

type Exists<T extends Reindeer[], K extends Reindeer> = T extends [
  infer Head extends Reindeer,
  ...infer Rest extends Reindeer[]
]
  ? Head extends K
    ? true
    : Exists<Rest, K>
  : false;

type Flatten<T extends Reindeer[][], Flat extends Reindeer[] = []> = T extends [
  infer Head extends Reindeer[],
  ...infer Rest extends Reindeer[][]
]
  ? Flatten<Rest, [...Flat, ...Head]>
  : Flat;

type ValidateRows<T extends Reindeer[][][]> = T extends [
  infer Head extends Reindeer[][],
  infer Rest extends Reindeer[][][]
]
  ? HasDuplicates<Flatten<Head>> extends true
    ? false
    : ValidateRows<Rest>
  : true;

type ValidateColumns<T extends Reindeer[][]> = T extends [
  infer Head extends Reindeer[],
  infer Rest extends Reindeer[][]
]
  ? HasDuplicates<Head> extends true
    ? false
    : ValidateColumns<Rest>
  : true;

type Validate<T extends Reindeer[][][]> = ValidateRows<T> extends false
  ? false
  : ValidateColumns<GetColumns<T>> extends false
  ? false
  : ValidateRegions<GetRegions<T>> extends false
  ? false
  : true;

type GetColumn<
  T extends Reindeer[][][],
  Index1 extends number,
  Index2 extends number,
  Column extends Reindeer[] = []
> = Column["length"] extends 9
  ? Column
  : GetColumn<T, Index1, Index2, [...Column, T[Column["length"]][Index1][Index2]]>;

type GetColumns<T extends Reindeer[][][]> = [
  GetColumn<T, 0, 0>,
  GetColumn<T, 0, 1>,
  GetColumn<T, 0, 2>,
  GetColumn<T, 1, 0>,
  GetColumn<T, 1, 1>,
  GetColumn<T, 1, 1>,
  GetColumn<T, 2, 0>,
  GetColumn<T, 2, 1>,
  GetColumn<T, 2, 2>
];

type Fill<Count extends number, With extends string = "", Res extends string[] = []> = Res["length"] extends Count
  ? Res
  : Fill<Count, With, [...Res, With]>;

type GetRegion<T extends Reindeer[][][], X extends number, Y extends number> = GetRegionAux<T, Fill<X>, Fill<Y>>;

type GetRegionAux<
  T extends Reindeer[][][],
  X extends any[],
  Y extends any[],
  Region extends Reindeer[][] = []
> = Region["length"] extends 3 ? Region : GetRegionAux<T, X, [...Y, ""], [...Region, T[Y["length"]][X["length"]]]>;

type GetRegions<T extends Reindeer[][][]> = [
  GetRegion<T, 0, 0>,
  GetRegion<T, 1, 0>,
  GetRegion<T, 2, 0>,
  GetRegion<T, 0, 3>,
  GetRegion<T, 1, 3>,
  GetRegion<T, 2, 3>,
  GetRegion<T, 0, 6>,
  GetRegion<T, 1, 6>,
  GetRegion<T, 2, 6>
];

type ValidateRegions<T extends Reindeer[][][]> = T extends [
  infer Head extends Reindeer[][],
  ...infer Rest extends Reindeer[][][]
]
  ? HasDuplicates<Flatten<Head>> extends true
    ? false
    : ValidateRegions<Rest>
  : true;
