import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private game: Game = {} as Game;

  constructor() {}

  getGame() {
    return this.game;
  }

  setGame(game: Game) {
    this.game = game;
  }
}
