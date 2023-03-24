import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';
import { RxStompService } from '../services/rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { PlayerService } from '../services/player.service';
import { LobbyUpdate } from '../models/lobby-update.model';
import { Lobby } from '../models/lobby.model';

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
    private playerService: PlayerService
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
        const isGameStarted: boolean = JSON.parse(message.body);

        // build and navigate to route based on player role
        if (isGameStarted) {
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

  getGameRoute(gameRoute: string[], playerRole: string): string[] {
    if (playerRole.toLowerCase() === 'speaker') return gameRoute;
    return [...gameRoute, playerRole.toLowerCase()];
  }

  appendGameId(route: string, gameId: string) {
    return `${route}/${gameId}`;
  }

  startGame() {
    this.rxStompService.publish({
      destination: this.startDestination,
    });
  }

  ngOnDestroy(): void {
    // notifty lobby of player leaving
    this.notifyLobby(false);

    this.routeSub$.unsubscribe();
    this.playerSub$.unsubscribe();
    this.lobbyTopicSub$.unsubscribe();
    this.startTopicSub$.unsubscribe();
  }
}
