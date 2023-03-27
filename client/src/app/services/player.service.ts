import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  /**
   * Service provides access to current player's state.
   */

  private player: Player = new Player('default', '', false);
  onPlayerChange: Subject<Player> = new Subject();

  constructor() {}

  getPlayer() {
    return this.player;
  }

  setPlayer(player: Player) {
    this.player = player;
    this.onPlayerChange.next(this.player);
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
