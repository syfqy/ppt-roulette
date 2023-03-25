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
import { RxStompService } from '../services/rx-stomp.service';
import { Player } from '../models/player.model';
import { PlayerService } from '../services/player.service';
import { GameStateService } from '../services/game-state.service';
import { Deck } from '../models/deck.model';
import { Slide } from '../models/slide.model';
import { DeckMaterials } from '../models/deck-materials.model';

@Component({
  selector: 'app-game-speaker-view',
  templateUrl: './game-speaker-view.component.html',
  styleUrls: ['./game-speaker-view.component.css'],
})
export class GameSpeakerViewComponent implements OnInit, OnDestroy {
  speaker!: Player;
  game!: Game;
  deck!: Deck;

  timeForCurrSlide!: number;
  timeElapsed: number = 0;
  currSlideIdx: number = -1;
  currSlide!: Slide;
  numSlides!: number;

  nextSlideSub$!: Subscription;
  nextSlideEvent = new Subject<void>();
  currTemplate!: TemplateRef<any>;

  reactions: string[] = [];

  reactionsTopic: string = '/topic/reactions';
  imageTopic: string = '/topic/image';

  reactionDestination: string = '/lobby/start';

  reactionsTopicSub$!: Subscription;
  imageTopicSub$!: Subscription;
  routeSub$!: Subscription;

  @ViewChild('topicTemplate')
  topicTemplate!: TemplateRef<any>;

  @ViewChild('promptTemplate')
  promptTemplate!: TemplateRef<any>;

  @ViewChild('imageTemplate')
  imageTemplate!: TemplateRef<any>;

  constructor(
    private gameStateService: GameStateService,
    private playerService: PlayerService,
    private router: Router,
    private rxStompService: RxStompService
  ) {}

  ngOnInit(): void {
    // get player
    this.speaker = this.playerService.getPlayer();

    // get game
    this.game = this.gameStateService.getGame();
    this.timeForCurrSlide = this.game.timePerSlide;

    // create deck from deck materials
    this.deck = Deck.createFromDeckMaterials(
      this.game.deckMaterials as DeckMaterials
    );
    this.numSlides = this.deck.slides.length;
    console.log('>>> deck prepared');
    console.log(this.deck);

    // subscribe to next slide event when timer up, change view to next slide
    this.nextSlideSub$ = this.nextSlideEvent.subscribe(() => {
      this.currSlideIdx++;
      this.currSlide = this.deck.getSlideByIdx(this.currSlideIdx);
      this.currTemplate = this.changeTemplate(this.currSlide);
    });

    // start timer
    let timer = setInterval(() => {
      if (this.timeElapsed >= this.timeForCurrSlide) {
        if (this.currSlideIdx < this.numSlides - 1) {
          // if not at last slide when time up, trigger next slide and reset
          this.nextSlideEvent.next();

          // TODO: create clean up function to call when next slide
          this.timeForCurrSlide = this.game.timePerSlide;
          this.timeElapsed = 0;
          this.reactions = [];
        } else {
          // TODO: call end round/game method
          clearInterval(timer);
        }
      }
      this.timeElapsed += 0.1;
    }, 100);
  }

  private changeTemplate(slide: Slide): TemplateRef<any> {
    // project slide template into slide component
    console.log('>>> changing template');
    console.table(slide);
    switch (slide.getType().toLowerCase()) {
      case 'topic':
        return this.topicTemplate;
      case 'prompt':
        return this.promptTemplate;
      case 'image':
        return this.imageTemplate;
      default:
        return this.topicTemplate;
    }
  }

  // TODO: send assistant image options
  // TODO: set image of next slide based on assistant's selection
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
