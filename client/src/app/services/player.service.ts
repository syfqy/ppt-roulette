import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  /**
   * Service provides access to current player's state.
   */

  private player: Player = new Player('default', '', false);

  constructor() {}

  getPlayer() {
    return this.player;
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  setPlayerName(name: string) {
    this.player.name = name;
  }

  setPlayerRole(role: string) {
    this.player.role = role;
  }

  setHost(host: boolean) {
    this.player.host = host;
  }
}
