import { Player } from './player.model';

export interface LobbyMessage {
  player: Player;
  isJoining: boolean;
}
