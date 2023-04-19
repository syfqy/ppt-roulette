import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';
import { RxStompService } from '../services/rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { PlayerService } from '../services/player.service';
import { LobbyUpdate } from '../models/lobby-update.model';
import { Lobby } from '../models/lobby.model';
import { GameService } from '../services/game.service';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  currentPlayer!: Player;
  hostPlayer!: Player;
  lobby!: Lobby;
  gameId!: string;
  gameStarted = false;

  lobbyTopic: string = '/topic/lobby';
  lobbyDestination: string = '/lobby';
  startTopic: string = '/topic/start';
  startDestination: string = '/lobby/start';

  playerSub$!: Subscription;
  lobbyTopicSub$!: Subscription;
  startTopicSub$!: Subscription;
  routeSub$!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private rxStompService: RxStompService,
    private router: Router,
    private playerService: PlayerService,
    private gameService: GameService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    // get current player and subscribe to changes in current player
    this.currentPlayer = this.playerService.getPlayer();
    this.playerSub$ = this.playerService.onPlayerChange.subscribe((player) => {
      console.table(this.currentPlayer);
      this.currentPlayer = player;
    });

    // set game id, topics and destinations
    this.routeSub$ = this.activatedRoute.params.subscribe((params) => {
      this.gameId = params['gameId'];

      this.lobbyTopic = this.appendGameId(this.lobbyTopic, this.gameId);
      this.lobbyDestination = this.appendGameId(
        this.lobbyDestination,
        this.gameId
      );

      this.startTopic = this.appendGameId(this.startTopic, this.gameId);
      this.startDestination = this.appendGameId(
        this.startDestination,
        this.gameId
      );
    });

    // subscribe to lobby updates
    this.lobbyTopicSub$ = this.rxStompService
      .watch(this.lobbyTopic)
      .subscribe((message: Message) => {
        console.log(JSON.parse(message.body));
        this.lobby = JSON.parse(message.body);

        // update current player
        const cPlayer = this.lobby.players.find(
          (p) => p.name === this.currentPlayer.name
        );
        if (!!cPlayer) this.playerService.setPlayer(cPlayer);

        // update host
        const host = this.lobby.players.find((p) => p.host);
        if (!!host) this.hostPlayer = host;
      });

    // notify lobby of new player joining
    this.notifyLobby(true);

    // subscribe to lobby's start game event
    this.startTopicSub$ = this.rxStompService
      .watch(this.startTopic)
      .subscribe((message: Message) => {
        // check if game started by host
        this.gameStarted = JSON.parse(message.body);

        // build and navigate to route based on player role
        if (this.gameStarted) {
          const baseRoute = ['/game', this.gameId];
          const gameRoute = this.getGameRoute(
            baseRoute,
            this.currentPlayer.role
          );

          this.router.navigate(gameRoute);
        }
      });
  }

  notifyLobby(isJoining: boolean): void {
    const lobbyUpdate: LobbyUpdate = {
      player: this.currentPlayer,
      joining: isJoining,
    };

    this.rxStompService.publish({
      destination: this.lobbyDestination,
      body: JSON.stringify(lobbyUpdate),
    });
  }

  notifyStartGame() {
    this.rxStompService.publish({
      destination: this.startDestination,
    });
  }

  createGame() {
    this.gameService
      .createGame(this.gameId)
      .then((res) => {
        this.gameStateService.setGame(res);
        console.table(res);

        // notify lobby of game start
        this.notifyStartGame();
      })
      .catch((err) => console.error(err));
  }

  private getGameRoute(gameRoute: string[], playerRole: string): string[] {
    if (playerRole.toLowerCase() === 'speaker') return gameRoute;
    return [...gameRoute, playerRole.toLowerCase()];
  }

  private appendGameId(route: string, gameId: string) {
    return `${route}/${gameId}`;
  }

  ngOnDestroy(): void {
    // notify lobby of player leaving
    if (!this.gameStarted) this.notifyLobby(false);

    this.routeSub$.unsubscribe();
    this.playerSub$.unsubscribe();
    this.lobbyTopicSub$.unsubscribe();
    this.startTopicSub$.unsubscribe();
  }
}
