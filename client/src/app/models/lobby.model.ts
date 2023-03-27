import { Player } from './player.model';

export interface Lobby {
  gameId: string;
  players: Player[];
  hostName: string;
  canStartGame: boolean;
}
