import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';
import { RxStompService } from '../services/rx-stomp.service';

@Component({
  selector: 'app-game-judge-view',
  templateUrl: './game-judge-view.component.html',
  styleUrls: ['./game-judge-view.component.css'],
})
export class GameJudgeViewComponent implements OnInit, OnDestroy {
  prevState!: any;
  gameId!: string;
  currentPlayer!: Player;
  canReact: boolean = false;

  reactionsDestination: string = '/game/reactions';

  nextSlideTopic: string = '/topic/slide';
  nextSlideTopicSub$!: Subscription;

  constructor(private rxStompService: RxStompService, private router: Router) {
    // get state from lobby
    const state = this.router.getCurrentNavigation()?.extras.state;
    console.log('>>> state');
    console.table(state);
    this.prevState = state;
  }

  ngOnInit(): void {
    if (!!this.prevState) {
      this.gameId = this.prevState['gameId'];
      this.currentPlayer = this.prevState['currentPlayer'];

      // set topics and destinations
      this.nextSlideTopic = `${this.nextSlideTopic}/${this.gameId}`;
      this.reactionsDestination = `${this.reactionsDestination}/${this.gameId}`;

      this.nextSlideTopicSub$ = this.rxStompService
        .watch(this.nextSlideTopic)
        .subscribe(() => {
          // enable reactions
          this.canReact = true;
        });
    }
  }

  sendReaction() {
    const message = {
      judge: this.currentPlayer.name,
      reaction: '😂',
    };

    this.rxStompService.publish({
      destination: this.reactionsDestination,
      body: JSON.stringify(message),
    });
  }

  ngOnDestroy() {
    this.nextSlideTopicSub$.unsubscribe();
  }
}
