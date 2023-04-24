import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';
import { PlayerService } from '../services/player.service';
import { RxStompService } from '../services/rx-stomp.service';
import { Reaction } from '../models/reaction.model';

@Component({
  selector: 'app-game-judge-view',
  templateUrl: './game-judge-view.component.html',
  styleUrls: ['./game-judge-view.component.css'],
})
export class GameJudgeViewComponent implements OnInit, OnDestroy {
  gameId!: string;
  judge!: Player;

  // TODO: move to separate model
  REACTION_OPTIONS = {
    LAUGH: {
      judgeName: '',
      text: '😂',
      score: 10,
    },
    POOP: {
      judgeName: '',
      text: '💩',
      score: -10,
    },
    CLAP: {
      judgeName: '',
      text: '👏',
      score: 3,
    },
    MINDBLOWN: {
      judgeName: '',
      text: '🤯',
      score: 7,
    },
  };

  reactionOptions = [
    this.REACTION_OPTIONS.LAUGH,
    this.REACTION_OPTIONS.POOP,
    this.REACTION_OPTIONS.CLAP,
    this.REACTION_OPTIONS.MINDBLOWN,
  ];

  reactionsDestination: string = '/game/reactions';

  routeSub$!: Subscription;

  constructor(
    private rxStompService: RxStompService,
    private activatedRoute: ActivatedRoute,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    // get player
    this.judge = this.playerService.getPlayer();

    // set reaction options
    this.initReactionOptions(this.judge.name);

    // get game id
    this.routeSub$ = this.activatedRoute.params.subscribe((params) => {
      this.gameId = params['gameId'];
      this.reactionsDestination = `${this.reactionsDestination}/${this.gameId}`;
    });
  }

  notifyReaction(reaction: Reaction) {
    console.log('>>> sending reaction to speaker');

    this.rxStompService.publish({
      destination: this.reactionsDestination,
      body: JSON.stringify(reaction),
    });
  }

  initReactionOptions(judgeName: string): void {
    Object.entries(this.REACTION_OPTIONS).forEach(([key, val]) => {
      val.judgeName = judgeName;
    });
  }

  ngOnDestroy() {
    this.routeSub$.unsubscribe();
  }
}
