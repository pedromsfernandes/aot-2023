type DayCounter<Start extends number, End extends number, Accum extends Array<number> = [Start]> = Start extends End
  ? Accum[number] | End
  : DayCounter<Accum["length"], End, [Start, ...Accum]>;
