import { Player } from './player.model';

export interface LobbyUpdate {
  player: Player;
  joining: boolean;
}
