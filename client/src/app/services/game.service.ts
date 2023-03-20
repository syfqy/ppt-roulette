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

  startGame(
    hostName: string,
    players: Player[],
    gameId: string
  ): Promise<Game> {
    const lobby = {
      hostName: hostName,
      players: players,
      gameId: gameId,
    };

    return lastValueFrom(
      this.httpClient.post<Game>(`/api/game/start/${gameId}`, lobby)
    );
  }

  getImages(): Promise<string[]> {
    return lastValueFrom(this.httpClient.get<string[]>('/api/game/images'));
  }
}
