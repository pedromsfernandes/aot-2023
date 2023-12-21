type Letters = {
  A: ["█▀█ ", "█▀█ ", "▀ ▀ "];
  B: ["█▀▄ ", "█▀▄ ", "▀▀  "];
  C: ["█▀▀ ", "█ ░░", "▀▀▀ "];
  E: ["█▀▀ ", "█▀▀ ", "▀▀▀ "];
  H: ["█ █ ", "█▀█ ", "▀ ▀ "];
  I: ["█ ", "█ ", "▀ "];
  M: ["█▄░▄█ ", "█ ▀ █ ", "▀ ░░▀ "];
  N: ["█▄░█ ", "█ ▀█ ", "▀ ░▀ "];
  P: ["█▀█ ", "█▀▀ ", "▀ ░░"];
  R: ["█▀█ ", "██▀ ", "▀ ▀ "];
  S: ["█▀▀ ", "▀▀█ ", "▀▀▀ "];
  T: ["▀█▀ ", "░█ ░", "░▀ ░"];
  Y: ["█ █ ", "▀█▀ ", "░▀ ░"];
  W: ["█ ░░█ ", "█▄▀▄█ ", "▀ ░ ▀ "];
  " ": ["░", "░", "░"];
  ":": ["#", "░", "#"];
  "*": ["░", "#", "░"];
};

type MatchingLetters = {
  a: "A";
  b: "B";
  c: "C";
  e: "E";
  h: "H";
  i: "I";
  m: "M";
  n: "N";
  p: "P";
  r: "R";
  s: "S";
  t: "T";
  w: "W";
  y: "Y";
};

type GetLine<
  T extends string,
  N extends number,
  Result extends string = ""
> = T extends `${infer Char extends string}${infer Rest}`
  ? GetLine<
      Rest,
      N,
      `${Result}${Char extends keyof Letters
        ? Letters[Char][N]
        : Char extends keyof MatchingLetters
        ? Letters[MatchingLetters[Char]][N]
        : ""}`
    >
  : Result;

type GetSentence<T extends string, Acc extends Array<string> = []> = Acc["length"] extends 3
  ? Acc
  : GetSentence<T, [...Acc, GetLine<T, Acc["length"]>]>;

type ToAsciiArt2<T extends Array<string>, Res extends Array<string> = []> = T extends [
  infer Head extends string,
  ...infer Rest extends Array<string>
]
  ? ToAsciiArt2<Rest, [...Res, ...GetSentence<Head>]>
  : Res;
type ToAsciiArt<T extends string> = ToAsciiArt2<Split<T>>;

type Split<
  T extends string,
  Res extends Array<string> = []
> = T extends `${infer Before extends string}\n${infer After extends string}`
  ? Split<After, [...Res, Before]>
  : [...Res, T];
