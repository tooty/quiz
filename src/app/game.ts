export interface PlayerGame {
  name: string;
  sign: number;
}

export interface Frage {
  key: number;
  player?: PlayerGame[];
  value: number;
  frage: string;
  antwort: string;
  activ: boolean;
  type?: string;
}
export interface Category {
  name: string;
  fragen: Frage[];
}

export interface Player {
  name: string;
  money: number;
  buzzerState: string;
  input?: string;
  inputState: boolean;
  connected: boolean;
}
