import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  game: Game = {} as Game;

  constructor() {}

  setGame(game: Game) {
    this.game = game;
  }
}
