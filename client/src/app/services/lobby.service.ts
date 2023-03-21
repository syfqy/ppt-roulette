import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  /**
   * Responsible for creating and joining game lobby via server
   * @param httpClient
   */
  constructor(private httpClient: HttpClient) {}

  createLobby(hostName: string): Promise<any> {
    const body = {
      hostName: hostName,
    };
    return lastValueFrom(this.httpClient.post('/api/game/create', body));
  }

  joinLobby(gameId: string): Promise<any> {
    return lastValueFrom(this.httpClient.get(`/api/game/join/${gameId}`));
  }
}
