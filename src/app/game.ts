export interface Player2 {
      name: string,
      sign: number 
}

export interface Frage2 {
    key: number,
    player: Player2[] 
    value: number,
    frage: string,
    antwort: string,
    activ: boolean,
}
export interface Kat2 {
  name: string,
  fragen: Frage2[]
}

