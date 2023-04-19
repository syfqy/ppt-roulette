import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Game } from '../models/game.model';
import { Player } from '../models/player.model';
import { GameResult } from '../models/game-result.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private httpClient: HttpClient) {}

  createGame(gameId: string): Promise<Game> {
    return lastValueFrom(
      this.httpClient.get<Game>(`/api/game/create/${gameId}`)
    );
  }

  saveGameResult(gameResult: GameResult) {
    return lastValueFrom(
      this.httpClient.post(`/api/game/save/${gameResult.gameId}`, gameResult)
    );
  }

  emailGameResult(gameId: string, email: string) {
    const body = {
      email: email,
    };

    return lastValueFrom(
      this.httpClient.post(`/api/game/email/${gameId}`, body)
    );
  }
}
