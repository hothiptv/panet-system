export enum Role {
  USER = 'ban la panet phuc vu khach hang',
  MODEL = 'gemini flash 3'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
}
