import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  /**
   * Service provides access to player's current state.
   */

  private currPlayer: Player = new Player('default', '', false);

  constructor() {}

  getPlayer() {
    return this.currPlayer;
  }

  setPlayerName(name: string) {
    this.currPlayer.name = name;
  }

  setPlayerRole(role: string) {
    this.currPlayer.role = role;
  }

  setHost(host: boolean) {
    this.currPlayer.host = host;
  }
}
