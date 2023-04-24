import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';
import { PlayerService } from '../services/player.service';
import { RxStompService } from '../services/rx-stomp.service';
import { Reaction } from '../models/reaction.model';
import { REACTION_OPTIONS } from '../models/reaction-options.model';
import { Message } from 'stompjs';
import { ReactionService } from '../services/reaction.service';

@Component({
  selector: 'app-game-judge-view',
  templateUrl: './game-judge-view.component.html',
  styleUrls: ['./game-judge-view.component.css'],
})
export class GameJudgeViewComponent implements OnInit, OnDestroy {
  gameId!: string;
  judge!: Player;

  reactionOptions = [
    REACTION_OPTIONS.LAUGH,
    REACTION_OPTIONS.POOP,
    REACTION_OPTIONS.CLAP,
    REACTION_OPTIONS.MINDBLOWN,
  ];

  endTopic: string = '/topic/end';
  reactionsDestination: string = '/game/reactions';

  routeSub$!: Subscription;
  endGameSub$!: Subscription;

  constructor(
    private rxStompService: RxStompService,
    private activatedRoute: ActivatedRoute,
    private playerService: PlayerService,
    private reactionService: ReactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // get player
    this.judge = this.playerService.getPlayer();

    // set reaction options
    this.reactionOptions = this.initReactionOptions(this.judge.name);

    // get game id
    this.routeSub$ = this.activatedRoute.params.subscribe((params) => {
      this.gameId = params['gameId'];
      this.reactionsDestination = `${this.reactionsDestination}/${this.gameId}`;
      this.endTopic = `${this.endTopic}/${this.gameId}`;
    });

    this.endGameSub$ = this.rxStompService
      .watch(this.endTopic)
      .subscribe((message: Message) => {
        console.log('>>> speaker has ended game');
        this.router.navigate(['/game-over', this.gameId, 'judge']);
      });
  }

  saveReaction(reaction: Reaction) {
    this.reactionService.addReaction(reaction);
  }

  notifyReaction(reaction: Reaction) {
    this.saveReaction(reaction);
    console.log('>>> sending reaction to speaker');

    this.rxStompService.publish({
      destination: this.reactionsDestination,
      body: JSON.stringify(reaction),
    });
  }

  initReactionOptions(judgeName: string) {
    return this.reactionOptions.map((r) => {
      return {
        ...r,
        judgeName: judgeName,
      };
    });
  }
  ngOnDestroy() {
    this.routeSub$.unsubscribe();
    this.endGameSub$.unsubscribe();
  }
}
