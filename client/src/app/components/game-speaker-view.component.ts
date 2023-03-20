import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Game } from '../models/game.model';
import { GameService } from '../services/game.service';
import { RxStompService } from '../services/rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-game-speaker-view',
  templateUrl: './game-speaker-view.component.html',
  styleUrls: ['./game-speaker-view.component.css'],
})
export class GameSpeakerViewComponent implements OnInit, OnDestroy {
  totalTime: number = 3;
  timeElapsed: number = 0;
  currentGame!: Game;
  prevState!: any;
  gameId!: string;
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

  @ViewChild('topicSlide')
  topicSlide!: TemplateRef<any>;

  @ViewChild('promptSlide')
  promptSlide!: TemplateRef<any>;

  @ViewChild('imageSlide')
  imageSlide!: TemplateRef<any>;

  constructor(
    private gameService: GameService,
    private router: Router,
    private rxStompService: RxStompService
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    console.log('>>> state');
    console.table(state);
    this.prevState = state;
  }

  ngOnInit(): void {
    // get state from lobby
    if (!!this.prevState) {
      this.gameId = this.prevState['gameId'];
      this.speaker = this.prevState['currentPlayer'];
      this.players = this.prevState['players'];
      this.judges = this.players.filter((p) => p.role === 'Judge');

      // set topics
      // this.slideTopic = `${this.slideTopic}/${this.gameId}`;
      this.slideDestination = `${this.slideDestination}/${this.gameId}`;

      this.reactionsTopic = `${this.reactionsTopic}/${this.gameId}`;
      this.imageTopic = `${this.imageTopic}/${this.gameId}`;

      this.reactionsTopicSub$ = this.rxStompService
        .watch(this.reactionsTopic)
        .subscribe((message: Message) => {
          // show reaction from judge
          const msg = JSON.parse(message.body);
          console.log(
            '>>> Reaction: ' + msg.reaction + ' from judge: ' + msg.judge
          );
          this.reactions.push(`${msg.judge}: ${msg.reaction}`);
        });

      this.imageTopicSub$ = this.rxStompService
        .watch(this.imageTopic)
        .subscribe((message: Message) => {
          // select next image from judge
          // const nextImage = JSON.parse(message.body);
          // this.currentImage = nextImage.imageUrl;
          this.currentImage = message.body;

          console.log(
            '>>> received next image from asssistant: ' + this.currentImage
          );
        });

      // if player is speaker, then fetch game data from server
      if (this.speaker.role === 'Speaker') {
        this.gameService
          .startGame(this.speaker.name, this.players, this.gameId)
          .then((res) => {
            console.log('>>> Intializing game');
            console.log(res);
            this.currentGame = res;
          })
          .catch((err) => {
            console.error(err);
          });
      }

      // subscribe to timer to change slide
      this.nextSlideSub$ = this.nextSlideEvent.subscribe(() => {
        this.slideIdx++;
        this.slideIdx % 2 === 0 ? this.promptIdx++ : this.imageIdx++;
        console.log('>>> slide number: ' + this.slideIdx);
        console.log('>>> prompt number: ' + this.promptIdx);
        console.log('>>> image number: ' + this.imageIdx);
        this.currentSlide = this.changeSlide();
      });
    }

    // start timer
    let timer = setInterval(() => {
      // if not at last slide, fire next slide event and reset timer
      if (this.timeElapsed >= this.totalTime && this.slideIdx < 5) {
        this.nextSlideEvent.next();

        this.totalTime = 10;
        this.timeElapsed = 0;
        this.reactions = [];
        this.sendNextSlide(); // notify other players
      } else if (this.slideIdx >= 5) {
        clearInterval(timer);
      }
      this.timeElapsed += 0.1;
    }, 100);
  }

  changeSlide(): TemplateRef<any> {
    // project slide content into slide component
    const nextSlide =
      this.slideIdx === 0
        ? this.topicSlide
        : this.slideIdx % 2 === 0
        ? this.promptSlide
        : this.imageSlide;
    return nextSlide;
  }

  sendNextSlide(): void {
    this.rxStompService.publish({
      destination: this.slideDestination,
      body: this.slideIdx.toString(),
    });
  }

  ngOnDestroy(): void {
    this.nextSlideSub$.unsubscribe();
    this.imageTopicSub$.unsubscribe();
    this.reactionsTopicSub$.unsubscribe();
  }
}
