type SantaListProtector<T> = T extends Function ?  T : {readonly [k in keyof T]: SantaListProtector<T[k]>}
