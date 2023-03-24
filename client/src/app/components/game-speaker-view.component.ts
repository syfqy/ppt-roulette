import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Game } from '../models/game.model';
import { GameService } from '../services/game.service';
import { RxStompService } from '../services/rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { Player } from '../models/player.model';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-game-speaker-view',
  templateUrl: './game-speaker-view.component.html',
  styleUrls: ['./game-speaker-view.component.css'],
})
export class GameSpeakerViewComponent implements OnInit, OnDestroy {
  gameId!: string;
  game!: Game;
  timePerSlide: number = 3;
  timeElapsed: number = 0;
  currentGame!: Game;
  prevState!: any;
  speaker!: Player;
  players!: Player[];
  judges!: Player[];

  promptIdx: number = -1;
  imageIdx: number = -1;
  slideIdx: number = -1;

  nextSlideSub$!: Subscription;
  nextSlideEvent = new Subject<void>();
  currentSlide!: TemplateRef<any>;
  currentImage!: string;
  reactions: string[] = [];

  slideDestination: string = '/game/slide';

  // slideTopic: string = '/topic/slide';
  reactionsTopic: string = '/topic/reactions';
  imageTopic: string = '/topic/image';

  // slideTopicSub$!: Subscription;
  reactionsTopicSub$!: Subscription;
  imageTopicSub$!: Subscription;
  // reactionDestination: string = '/lobby/start';
  routeSub$!: Subscription;

  @ViewChild('topicSlide')
  topicSlide!: TemplateRef<any>;

  @ViewChild('promptSlide')
  promptSlide!: TemplateRef<any>;

  @ViewChild('imageSlide')
  imageSlide!: TemplateRef<any>;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private rxStompService: RxStompService
  ) {}

  ngOnInit(): void {
    // // get current player
    // this.currentPlayer = this.playerService.getPlayer();

    // get gameId from route
    this.routeSub$ = this.activatedRoute.params.subscribe((params) => {
      this.gameId = params['gameId'];
    });

    // fetch game data from server
    this.gameService
      .startGame(this.gameId)
      .then((res) => {
        console.log(res);
        this.currentGame = res;
      })
      .catch((err) => {
        console.error(err);
      });

    //   // subscribe to timer to change slide
    //   this.nextSlideSub$ = this.nextSlideEvent.subscribe(() => {
    //     this.slideIdx++;
    //     this.slideIdx % 2 === 0 ? this.promptIdx++ : this.imageIdx++;
    //     console.log('>>> slide number: ' + this.slideIdx);
    //     console.log('>>> prompt number: ' + this.promptIdx);
    //     console.log('>>> image number: ' + this.imageIdx);
    //     this.currentSlide = this.changeSlide();
    //   });

    //   // start timer
    //   let timer = setInterval(() => {
    //     // if not at last slide, fire next slide event and reset timer
    //     if (this.timeElapsed >= this.timePerSlide && this.slideIdx < 5) {
    //       this.nextSlideEvent.next();

    //       this.timePerSlide = 10;
    //       this.timeElapsed = 0;
    //       this.reactions = [];
    //       this.sendNextSlide(); // notify other players
    //     } else if (this.slideIdx >= 5) {
    //       clearInterval(timer);
    //     }
    //     this.timeElapsed += 0.1;
    //   }, 100);
  }

  // changeSlide(): TemplateRef<any> {
  //   // project slide content into slide component
  //   const nextSlide =
  //     this.slideIdx === 0
  //       ? this.topicSlide
  //       : this.slideIdx % 2 === 0
  //       ? this.promptSlide
  //       : this.imageSlide;
  //   return nextSlide;
  // }

  // sendNextSlide(): void {
  //   this.rxStompService.publish({
  //     destination: this.slideDestination,
  //     body: this.slideIdx.toString(),
  //   });
  // }

  ngOnDestroy(): void {
    this.nextSlideSub$.unsubscribe();
    this.imageTopicSub$.unsubscribe();
    this.reactionsTopicSub$.unsubscribe();
  }
}
