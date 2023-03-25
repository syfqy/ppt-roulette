import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  /**
   * Responsible for creating and joining game lobby via server
   * @param httpClient
   */
  constructor(private httpClient: HttpClient) {}

  createLobby(host: Player): Promise<any> {
    return lastValueFrom(this.httpClient.post('/api/lobby/create', host));
  }

  joinLobby(gameId: string): Promise<any> {
    return lastValueFrom(this.httpClient.get(`/api/lobby/join/${gameId}`));
  }
}
