type Connect4Chips = "🔴" | "🟡";
type Connect4Cell = Connect4Chips | "  ";
type Connect4State = "🔴" | "🟡" | "🔴 Won" | "🟡 Won" | "Draw";

type EmptyBoard = [
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "]
];

type Game = { board: Connect4Cell[][]; state: Connect4State };

type NewGame = {
  board: EmptyBoard;
  state: "🟡";
};

type Connect4<T extends Game, Col extends number> = GetNextBoard<
  T,
  Col
> extends infer NextBoard extends Connect4Cell[][]
  ? {
      board: NextBoard;
      state: GetNextState<{ board: NextBoard; state: T["state"] }>;
    }
  : never;

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
  Row extends number,
  Col extends number,
  By extends unknown,
  Res extends unknown[][] = []
> = Res["length"] extends T["length"]
  ? Res
  : Row extends Res["length"]
  ? Replace2D<T, Row, Col, By, [...Res, Replace<T[Row], Col, By>]>
  : Replace2D<T, Row, Col, By, [...Res, T[Res["length"]]]>;

type DropToken<
  T extends Game,
  Col extends number,
  RowAcc extends string[] = [],
  RowAcc2 extends string[] = [""]
> = RowAcc2["length"] extends T["board"]["length"]
  ? Replace2D<T["board"], RowAcc["length"], Col, T["state"]>
  : T["board"][RowAcc2["length"]][Col] extends Connect4Chips
  ? Replace2D<T["board"], RowAcc["length"], Col, T["state"]>
  : DropToken<T, Col, [...RowAcc, " "], [...RowAcc2, " "]>;

type GetNextBoard<T extends Game, Col extends number> = DropToken<T, Col>;
type GetNextState<T extends Game> = RowHasWinner<T["board"]> extends infer Winner extends Connect4Chips
  ? `${Winner} Won`
  : RowHasWinner<GetDiagonals<T["board"]>> extends infer DiagonalWinner extends Connect4Chips
  ? `${DiagonalWinner} Won`
  : IsFull<T["board"]> extends true
  ? "Draw"
  : T["state"] extends "🔴"
  ? "🟡"
  : "🔴";

type IsFull<T extends Connect4Cell[][], Seen extends Connect4Cell[][] = []> = Seen["length"] extends T["length"]
  ? true
  : IsRowFull<T[Seen["length"]]> extends false
  ? false
  : IsFull<T, [...Seen, T[Seen["length"]]]>;

type IsRowFull<T extends Connect4Cell[], Seen extends Connect4Cell[] = []> = Seen["length"] extends T["length"]
  ? true
  : T[Seen["length"]] extends "  "
  ? false
  : IsRowFull<T, [...Seen, T[Seen["length"]]]>;

type RowHas4Consecutive<
  Row extends Connect4Cell[],
  Target extends Connect4Chips = "🔴",
  Streak extends Connect4Cell[] = [],
  Seen extends Connect4Cell[] = []
> = Streak["length"] extends 4
  ? true
  : Seen["length"] extends Row["length"]
  ? false
  : Row[Seen["length"]] extends Target
  ? RowHas4Consecutive<Row, Target, [...Streak, Row[Seen["length"]]], [...Seen, Row[Seen["length"]]]>
  : RowHas4Consecutive<Row, Target, [], [...Seen, Row[Seen["length"]]]>;

type RowHasWinner<T extends Connect4Cell[][], Seen extends Connect4Cell[][] = []> = Seen["length"] extends T["length"]
  ? "  "
  : RowHas4Consecutive<T[Seen["length"]], "🔴"> extends true
  ? "🔴"
  : RowHas4Consecutive<T[Seen["length"]], "🟡"> extends true
  ? "🟡"
  : RowHasWinner<T, [...Seen, T[Seen["length"]]]>;

type GetDiagonalDescXInner<
  T extends Connect4Cell[][],
  XAcc extends any[],
  YAcc extends any[],
  Diagonal extends Connect4Cell[] = []
> = YAcc["length"] extends T["length"]
  ? Diagonal
  : XAcc["length"] extends 0
  ? [...Diagonal, T[YAcc["length"]][XAcc["length"]]]
  : GetDiagonalDescXInner<T, Pop<XAcc>, [...YAcc, ""], [...Diagonal, T[YAcc["length"]][XAcc["length"]]]>;

type GetDiagonalDescX<T extends Connect4Cell[][], X extends number, Y extends number> = GetDiagonalDescXInner<
  T,
  Fill<X>,
  Fill<Y>
>;

type GetDiagonalIncX<T extends Connect4Cell[][], X extends number, Y extends number> = GetDiagonalIncXInner<
  T,
  Fill<X>,
  Fill<Y>
>;

type GetDiagonalIncXInner<
  T extends Connect4Cell[][],
  XAcc extends any[],
  YAcc extends any[],
  Diagonal extends Connect4Cell[] = []
> = YAcc["length"] extends 0
  ? [...Diagonal, T[YAcc["length"]][XAcc["length"]]]
  : XAcc["length"] extends T[0]["length"]
  ? Diagonal
  : GetDiagonalIncXInner<T, [...XAcc, ""], [...YAcc, ""], [...Diagonal, T[YAcc["length"]][XAcc["length"]]]>;

type EmptyBoard2 = [
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "]
];

type GetDiagonals<T extends Connect4Cell[][]> = [
  GetDiagonalDescX<T, 6, 0>,
  GetDiagonalDescX<T, 5, 0>,
  GetDiagonalDescX<T, 4, 0>,
  GetDiagonalDescX<T, 3, 0>,
  GetDiagonalDescX<T, 6, 1>,
  GetDiagonalDescX<T, 6, 2>,
  GetDiagonalIncX<T, 0, 0>,
  GetDiagonalIncX<T, 1, 0>,
  GetDiagonalIncX<T, 2, 0>,
  GetDiagonalIncX<T, 0, 1>,
  GetDiagonalIncX<T, 0, 2>,
  GetDiagonalIncX<T, 0, 3>
];

type Fill<Count extends number, Res extends string[] = []> = Res["length"] extends Count
  ? Res
  : Fill<Count, [...Res, ""]>;

type Pop<
  T extends unknown[],
  Res extends unknown[] = [],
  Res2 extends unknown[] = [""]
> = Res2["length"] extends T["length"] ? Res : Pop<T, [...Res, T[Res["length"]]], [...Res2, ""]>;
