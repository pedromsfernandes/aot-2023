type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type YPositions = {
  top: 0;
  middle: 1;
  bottom: 2;
};

type XPositions = {
  left: 0;
  center: 1;
  right: 2;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

type NewGame = {
  board: EmptyBoard;
  state: "❌";
};

type PositionToXY<T extends TicTacToePositions> =
  T extends `${infer Y extends TicTacToeYPositions}-${infer X extends TicTacToeXPositions}`
    ? { x: XPositions[X]; y: YPositions[Y] }
    : never;

type Replace<
  T extends TicTacToeCell[],
  Index extends number,
  NewCell extends TicTacToeCell,
  Acc extends TicTacToeCell[] = []
> = Acc["length"] extends T["length"]
  ? Acc
  : Acc["length"] extends Index
  ? Replace<T, Index, NewCell, [...Acc, NewCell]>
  : Replace<T, Index, NewCell, [...Acc, T[Acc["length"]]]>;

type UpdateBoardNumPosition<
  T extends TicTactToeBoard,
  P extends { x: number; y: number },
  NewCell extends TicTacToeCell,
  Acc extends TicTactToeBoard = []
> = Acc["length"] extends T["length"]
  ? Acc
  : Acc["length"] extends P["y"]
  ? UpdateBoardNumPosition<T, P, NewCell, [...Acc, Replace<T[Acc["length"]], P["x"], NewCell>]>
  : UpdateBoardNumPosition<T, P, NewCell, [...Acc, T[Acc["length"]]]>;

type UpdateBoard<
  T extends TicTactToeBoard,
  NewCell extends TicTacToeCell,
  Position extends TicTacToePositions
> = UpdateBoardNumPosition<T, PositionToXY<Position>, NewCell>;

type TicTacToe<T extends TicTacToeGame, P extends TicTacToePositions> = IsMoveValid<T, P> extends true
  ? T["state"] extends TicTacToeCell
    ? UpdateBoard<T["board"], T["state"], P> extends infer NewBoard extends TicTactToeBoard
      ? {
          board: NewBoard;
          state: CalculateState<NewBoard, T["state"]>;
        }
      : T
    : T
  : T;

type CalculateState<
  T extends TicTactToeBoard,
  S extends TicTacToeState
> = GameOver<T> extends infer Res extends TicTacToeEndState ? Res : S extends "❌" ? "⭕" : "❌";

type GameOver<T extends TicTactToeBoard> = DiagonalHasWinner<T> extends infer Chip extends TicTacToeChip
  ? `${Chip} Won`
  : LinesHasWinner<T> extends infer Chip extends TicTacToeChip
  ? `${Chip} Won`
  : ColumnHasWinner<T> extends infer Chip extends TicTacToeChip
  ? `${Chip} Won`
  : IsBoardFull<T> extends true
  ? "Draw"
  : "next";

type LineHasWinner<T extends TicTacToeCell[], Expected extends TicTacToeCell = T[0]> = T extends [
  infer Head extends TicTacToeCell,
  ...infer Rest extends TicTacToeCell[]
]
  ? Head extends TicTacToeEmptyCell
    ? TicTacToeEmptyCell
    : Head extends Expected
    ? LineHasWinner<Rest, Expected>
    : TicTacToeEmptyCell
  : Expected;

type LinesHasWinner<T extends TicTactToeBoard, Acc extends number[] = []> = T extends [
  infer Head extends TicTacToeCell[],
  ...infer Rest extends TicTactToeBoard
]
  ? LineHasWinner<Head> extends infer Winner extends TicTacToeChip
    ? Winner
    : LinesHasWinner<Rest, [...Acc, 0]>
  : TicTacToeEmptyCell;

type ColumnHasWinner<T extends TicTactToeBoard, Acc extends number[] = []> = Acc["length"] extends T["length"]
  ? TicTacToeEmptyCell
  : LineHasWinner<
      [T[0][Acc["length"]], T[1][Acc["length"]], T[2][Acc["length"]]]
    > extends infer Expected extends TicTacToeChip
  ? Expected
  : ColumnHasWinner<T, [...Acc, 0]>;

type DiagonalHasWinner<T extends TicTactToeBoard> = LineHasWinner<
  [T[0][0], T[1][1], T[2][2]]
> extends TicTacToeEmptyCell
  ? LineHasWinner<[T[2][0], T[1][1], T[0][2]]>
  : LineHasWinner<[T[0][0], T[1][1], T[2][2]]>;

type IsLineFull<T extends TicTacToeCell[]> = T extends [
  infer Head extends TicTacToeCell,
  ...infer Rest extends TicTacToeCell[]
]
  ? Head extends TicTacToeEmptyCell
    ? false
    : IsLineFull<Rest>
  : true;

type IsBoardFull<T extends TicTactToeBoard> = T extends [
  infer Head extends TicTacToeCell[],
  ...infer Rest extends TicTactToeBoard
]
  ? IsLineFull<Head> extends true
    ? IsBoardFull<Rest>
    : false
  : true;

type IsMoveValid<
  T extends TicTacToeGame,
  Move extends TicTacToePositions
> = PositionToXY<Move> extends infer P extends { x: number; y: number }
  ? T["board"][P["y"]][P["x"]] extends TicTacToeChip
    ? false
    : true
  : false;
