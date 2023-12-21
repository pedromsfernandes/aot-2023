type RockPaperScissors = "👊🏻" | "🖐🏾" | "✌🏽";

type Beats = {
  "👊🏻": "🖐🏾";
  "🖐🏾": "✌🏽";
  "✌🏽": "👊🏻";
};

type WhoWins<Opponent extends RockPaperScissors, Me extends RockPaperScissors> = Me extends Opponent
  ? "draw"
  : Opponent extends Beats[Me]
  ? "lose"
  : "win";
