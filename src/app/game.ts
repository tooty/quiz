export interface PlayerGame {
      name: string,
      sign: number 
}

export interface Frage2 {
    key: number,
    player?: PlayerGame[] 
    value: number,
    frage: string,
    antwort: string,
    activ: boolean,
}
export interface Kat2 {
  name: string,
  fragen: Frage2[]
}

export interface Frage {
  value: number,
  question: string,
  antwort: string,
}

export interface Kathegorie {
  name: string,
  fragen: Frage[]
}

export interface Player {
  name: string,
  money: number,
  buzzerState: string
}
