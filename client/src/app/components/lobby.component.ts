import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';
import { RxStompService } from '../services/rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  currentPlayer!: Player;
  hostPlayer!: Player;
  joinTopic: string = '/topic/join';
  joinDestination: string = '/lobby/join';
  startTopic: string = '/topic/start';
  startDestination: string = '/lobby/start';
  gameId!: string;
  joinTopicSub$!: Subscription;
  startTopicSub$!: Subscription;
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

    // set game id and topic
    this.routeSub$ = this.activatedRoute.params.subscribe((params) => {
      this.gameId = params['gameId'];
      this.joinTopic = `${this.joinTopic}/${this.gameId}`;
      this.startTopic = `${this.startTopic}/${this.gameId}`;
      console.log('>>> topic: ' + this.joinTopic);
      this.joinDestination = `${this.joinDestination}/${this.gameId}`;
      this.startDestination = `${this.startDestination}/${this.gameId}`;
    });

    // subscribe to lobby's player list
    this.joinTopicSub$ = this.rxStompService
      .watch(this.joinTopic)
      .subscribe((message: Message) => {
        console.log(JSON.parse(message.body));
        this.players = JSON.parse(message.body);

        // set current player
        const cPlayer = this.players.find(
          (p) => p.name === this.currentPlayer.name
        );
        if (!!cPlayer) this.currentPlayer = cPlayer;

        // set host player
        const hPlayer = this.players.find((p) => p.host);
        if (!!hPlayer) this.hostPlayer = hPlayer;
      });

    // send message to notify lobby of new join
    this.notifyLobby();

    // subscribe to lobby's start game event
    this.startTopicSub$ = this.rxStompService
      .watch(this.startTopic)
      .subscribe((message: Message) => {
        // if game has started, go to game view
        const isGameStarted: boolean = JSON.parse(message.body);
        if (isGameStarted) {
          console.log('>>> host has started game');
          const gameRoute =
            this.currentPlayer.role === 'Speaker'
              ? ['/game', this.gameId]
              : this.currentPlayer.role === 'Assistant'
              ? ['/game', this.gameId, 'assistant']
              : ['/game', this.gameId, 'judge'];

          this.router.navigate(gameRoute, {
            state: {
              gameId: this.gameId,
              currentPlayer: this.currentPlayer,
              players: this.players,
            },
          });
        }
      });
  }

  notifyLobby(): void {
    this.rxStompService.publish({
      destination: this.joinDestination,
      body: JSON.stringify(this.currentPlayer),
    });
  }

  readyToStart(): boolean {
    const totalPlayers = this.players.length;
    const playerRoleCountsMap = new Map<string, number>();

    this.players.forEach((p) => {
      playerRoleCountsMap.set(
        p.role,
        !!playerRoleCountsMap.get(p.role)
          ? playerRoleCountsMap.get(p.role)! + 1
          : 1
      );
    });

    console.log('>>> checking if game is ready to start');
    console.log(playerRoleCountsMap);

    if (totalPlayers < 3 || totalPlayers > 5) return false;

    if (playerRoleCountsMap.get('Speaker') !== 1) return false;

    if (playerRoleCountsMap.get('Assistant') !== 1) return false;

    if (playerRoleCountsMap.get('Judge') !== totalPlayers - 2) return false;

    return true;
  }

  startGame() {
    this.rxStompService.publish({
      destination: this.startDestination,
    });
  }

  ngOnDestroy(): void {
    this.routeSub$.unsubscribe();
    this.joinTopicSub$.unsubscribe();
    this.startTopicSub$.unsubscribe();
  }
}
