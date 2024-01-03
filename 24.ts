type Alley = "  ";
type MazeItem = "🎄" | "🎅" | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

type Find<
  T extends MazeItem[],
  ToFind extends MazeItem,
  Accum extends MazeItem[] = []
> = Accum["length"] extends T["length"]
  ? -1
  : T[Accum["length"]] extends ToFind
  ? Accum["length"]
  : Find<T, ToFind, [...Accum, T[Accum["length"]]]>;

type FindSanta<T extends MazeMatrix, Accum extends any[] = []> = Find<T[Accum["length"]], "🎅"> extends infer Index
  ? Index extends -1
    ? FindSanta<T, [...Accum, ""]>
    : [Index, Accum["length"]]
  : FindSanta<T, [...Accum, ""]>;

type IsMoveValid<T extends MazeMatrix, Direction extends Directions> = FindSanta<T> extends [
  infer X extends number,
  infer Y extends number
]
  ? GetMoveIndex<Direction, X, Y> extends [infer NewX extends number, infer NewY extends number]
    ? T[NewY][NewX] extends Alley
      ? true
      : false
    : false
  : false;

type Fill<Count extends number, With extends string = "", Res extends string[] = []> = Res["length"] extends Count
  ? Res
  : Fill<Count, With, [...Res, With]>;

type Pop<T extends any[], Res extends any[] = [], Res2 extends any[] = [""]> = Res2["length"] extends T["length"]
  ? Res
  : Pop<T, [...Res, T[Res["length"]]], [...Res2, ""]>;

type Decrement<T extends number> = T extends 0 ? -1 : Pop<Fill<T>> extends infer C extends any[] ? C["length"] : T;
type Increment<T extends number> = [...Fill<T>, ""]["length"];

type GetMoveIndex<Direction extends Directions, SantaX extends number, SantaY extends number> = Direction extends "left"
  ? [Decrement<SantaX>, SantaY]
  : Direction extends "right"
  ? [Increment<SantaX>, SantaY]
  : Direction extends "up"
  ? [SantaX, Decrement<SantaY>]
  : [SantaX, Increment<SantaY>];

type Replace<
  T extends unknown[],
  At extends number,
  By extends unknown,
  Res extends unknown[] = []
> = Res["length"] extends T["length"]
  ? Res
  : At extends Res["length"]
  ? Replace<T, At, By, [...Res, By]>
  : Replace<T, At, By, [...Res, T[Res["length"]]]>;

type Replace2D<
  T extends unknown[][],
  X extends number,
  Y extends number,
  By extends unknown,
  Res extends unknown[][] = []
> = Res["length"] extends T["length"]
  ? Res
  : Y extends Res["length"]
  ? Replace2D<T, X, Y, By, [...Res, Replace<T[Y], X, By>]>
  : Replace2D<T, X, Y, By, [...Res, T[Res["length"]]]>;

type Move<T extends MazeMatrix, Direction extends Directions> = FindSanta<T> extends [
  infer X extends number,
  infer Y extends number
]
  ? GetMoveIndex<Direction, X, Y> extends [infer NewX extends number, infer NewY extends number]
    ? IsMoveValid<T, Direction> extends true
      ? MoveSanta<T, X, Y, NewX, NewY>
      : CanEscape<T, NewX, NewY> extends true
      ? FillCookies<T>
      : T
    : T
  : T;

type CanEscape<T extends MazeMatrix, NewX extends number, NewY extends number> = NewX extends -1
  ? true
  : NewY extends -1
  ? true
  : NewX extends T[0]["length"]
  ? true
  : NewY extends T["length"]
  ? true
  : false;

type MoveSanta<
  T extends MazeMatrix,
  FromX extends number,
  FromY extends number,
  ToX extends number,
  ToY extends number
> = Replace2D<Replace2D<T, ToX, ToY, "🎅">, FromX, FromY, Alley>;

type FillCookies<T extends MazeMatrix, Res extends DELICIOUS_COOKIES[][] = []> = T extends [
  infer Head extends MazeItem[],
  ...infer Rest extends MazeMatrix
]
  ? FillCookies<Rest, [...Res, Fill<Head["length"], DELICIOUS_COOKIES>]>
  : Res;
