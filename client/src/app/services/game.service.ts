import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Game } from '../models/game.model';
import { Player } from '../models/player.model';

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
}
