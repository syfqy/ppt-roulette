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

  lobbyTopic: string = '/topic/lobby';
  lobbyDestination: string = '/lobby';

  gameId!: string;
  lobbyTopicSub$!: Subscription;
  routeSub$!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private rxStompService: RxStompService,
    private router: Router,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    // get player
    this.currentPlayer = this.playerService.getPlayer();
    console.table(this.currentPlayer);

    // set game id, topics and destinations
    this.routeSub$ = this.activatedRoute.params.subscribe((params) => {
      this.gameId = params['gameId'];

      this.lobbyTopic = this.appendGameId(this.lobbyTopic, this.gameId);
      this.lobbyDestination = this.appendGameId(
        this.lobbyDestination,
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
        if (!!cPlayer) this.currentPlayer = cPlayer;

        // update host
        const host = this.lobby.players.find((p) => p.host);
        if (!!host) this.hostPlayer = host;
      });

    // send message to notify lobby of new join
    this.notifyLobby(true);

    // // subscribe to lobby's start game event
    // this.lobbyStatusTopicSub$ = this.rxStompService
    //   .watch(this.lobbyStatusTopic)
    //   .subscribe((message: Message) => {
    //     // if game has started, go to game view
    //     const isGameStarted: boolean = JSON.parse(message.body);
    //     if (isGameStarted) {
    //       console.log('>>> host has started the game');

    //       const baseRoute = ['/game', this.gameId];
    //       const gameRoute = this.getGameRoute(
    //         baseRoute,
    //         this.currentPlayer.role
    //       );

    //       this.router.navigate(gameRoute, {
    //         state: {
    //           gameId: this.gameId,
    //           currentPlayer: this.currentPlayer,
    //           players: this.players,
    //         },
    //       });
    //     }
    //   });
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

  // TODO: move check to server side
  isGameReadyToStart(): boolean {
    // const totalPlayers = this.players.length;
    // const playerRoleCountsMap = new Map<string, number>();

    // this.players.forEach((p) => {
    //   playerRoleCountsMap.set(
    //     p.role.toLowerCase(),
    //     !!playerRoleCountsMap.get(p.role.toLowerCase())
    //       ? playerRoleCountsMap.get(p.role.toLowerCase())! + 1
    //       : 1
    //   );
    // });

    // console.log('>>> checking if game is ready to start');
    // console.log(playerRoleCountsMap);

    // // number of players check
    // if (totalPlayers < 3 || totalPlayers > 5) return false;

    // // role checks
    // // TODO: ignore case
    // if (playerRoleCountsMap.get('speaker') !== 1) return false;

    // if (playerRoleCountsMap.get('assistant') !== 1) return false;

    // if (playerRoleCountsMap.get('judge') !== totalPlayers - 2) return false;

    return true;
  }

  appendGameId(route: string, gameId: string) {
    return `${route}/${gameId}`;
  }

  startGame() {
    // this.rxStompService.publish({
    //   destination: this.startDestination,
    // });
  }

  ngOnDestroy(): void {
    // leave lobby
    this.notifyLobby(false);

    this.routeSub$.unsubscribe();
    this.lobbyTopicSub$.unsubscribe();
  }
}
