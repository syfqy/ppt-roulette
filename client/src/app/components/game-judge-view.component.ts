import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';
import { PlayerService } from '../services/player.service';
import { RxStompService } from '../services/rx-stomp.service';

@Component({
  selector: 'app-game-judge-view',
  templateUrl: './game-judge-view.component.html',
  styleUrls: ['./game-judge-view.component.css'],
})
export class GameJudgeViewComponent implements OnInit, OnDestroy {
  gameId!: string;
  judge!: Player;

  reactionsDestination: string = '/game/reactions';

  routeSub$!: Subscription;

  constructor(
    private rxStompService: RxStompService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    // get player
    this.judge = this.playerService.getPlayer();

    // get game id
    this.routeSub$ = this.activatedRoute.params.subscribe((params) => {
      this.gameId = params['gameId'];
      this.reactionsDestination = `${this.reactionsDestination}/${this.gameId}`;
    });
  }

  notifyReaction() {
    const reaction = {
      judgeName: this.judge.name,
      text: '😂',
    };

    console.log('>>> sending reaction to speaker');

    this.rxStompService.publish({
      destination: this.reactionsDestination,
      body: JSON.stringify(reaction),
    });
  }

  ngOnDestroy() {
    this.routeSub$.unsubscribe();
  }
}
