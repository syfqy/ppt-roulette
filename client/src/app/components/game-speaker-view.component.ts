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
import { Image } from '../models/image.model';
import { Message } from '@stomp/stompjs';
import { Reaction } from '../models/reaction.model';
import { ReactionService } from '../services/reaction.service';
import { GameService } from '../services/game.service';
import { GameResult } from '../models/game-result.model';

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
  isGameOver: boolean = false;

  nextSlideEvent = new Subject<void>();
  currTemplate!: TemplateRef<any>;

  reactions: Reaction[] = [];
  totalScore: number = 0;

  reactionsTopic: string = '/topic/reactions';
  imageSelectedTopic: string = '/topic/imageSelected';

  imageOptionsDestination: string = '/game/imageOptions';
  endDestination: string = '/game/end';

  nextSlideSub$!: Subscription;
  reactionsTopicSub$!: Subscription;
  imageSelectedTopicSub$!: Subscription;

  @ViewChild('topicTemplate')
  topicTemplate!: TemplateRef<any>;

  @ViewChild('promptTemplate')
  promptTemplate!: TemplateRef<any>;

  @ViewChild('imageTemplate')
  imageTemplate!: TemplateRef<any>;

  constructor(
    private gameStateService: GameStateService,
    private gameService: GameService,
    private playerService: PlayerService,
    private reactionService: ReactionService,
    private router: Router,
    private rxStompService: RxStompService
  ) {}

  ngOnInit(): void {
    // get player
    this.speaker = this.playerService.getPlayer();

    // get game
    this.game = this.gameStateService.getGame();
    this.timeForCurrSlide = 3;

    // set up topics and destinations
    this.imageSelectedTopic = `${this.imageSelectedTopic}/${this.game.gameId}`;
    this.reactionsTopic = `${this.reactionsTopic}/${this.game.gameId}`;
    this.imageOptionsDestination = `${this.imageOptionsDestination}/${this.game.gameId}`;
    this.endDestination = `${this.endDestination}/${this.game.gameId}`;

    // create deck from deck materials
    this.deck = Deck.createFromDeckMaterials(
      this.game.deckMaterials as DeckMaterials,
      this.speaker.name
    );
    this.numSlides = this.deck.slides.length;
    console.log('>>> deck prepared');
    console.log(this.deck);

    // subscribe to next slide event when timer up, change view to next slide
    this.nextSlideSub$ = this.nextSlideEvent.subscribe(() => {
      this.currSlideIdx++;

      this.currSlide = this.deck.getSlideByIdx(this.currSlideIdx);
      this.currTemplate = this.changeTemplate(this.currSlide);
      this.timeForCurrSlide = this.currSlide.timeForSlide;

      // notify assistant of image options
      if (this.currSlideIdx + 1 < this.numSlides) {
        const nextSlide = this.deck.getSlideByIdx(this.currSlideIdx + 1);

        if (nextSlide.getType().toLowerCase() === 'image') {
          const i = Math.floor(this.currSlideIdx / 2);
          console.log('>>> image options prepared');
          console.log(this.deck.imageSelectionArrs[i]);
          this.notifyImageOptions(this.deck.imageSelectionArrs[i]);
        }
      }
    });

    // subscribe to image selected by assistant
    this.imageSelectedTopicSub$ = this.rxStompService
      .watch(this.imageSelectedTopic)
      .subscribe((message: Message) => {
        console.log('>>> received selected image from assistant');
        console.log(JSON.parse(message.body));
        const images: Image = JSON.parse(message.body) as Image;
        const imageSelected: Image = Deck.createImage(
          images.imageId,
          images.imageUrl
        );
        // WARNING: might need to prevent last minute send by assistant
        this.deck.setSlideByIdx(this.currSlideIdx + 1, imageSelected);
      });

    // subscribe to reactions from judges
    this.reactionsTopicSub$ = this.rxStompService
      .watch(this.reactionsTopic)
      .subscribe((message: Message) => {
        console.log('>>> received reaction from judge');
        console.log(JSON.parse(message.body));
        const reaction: Reaction = JSON.parse(message.body);
        this.reactionService.addReaction(reaction);
        this.reactions = this.reactionService.getReactions();
        this.totalScore = this.reactions.reduce((sum, currentReaction) => {
          return sum + currentReaction.score;
        }, 0);
      });

    // start timer
    let timer = setInterval(() => {
      if (this.timeElapsed >= this.timeForCurrSlide) {
        if (this.currSlideIdx < this.numSlides - 1) {
          // if not at last slide when time up, trigger next slide and reset
          console.log('>>> time up, next slide event triggered');
          this.nextSlideEvent.next();

          // TODO: create clean up function to call when next slide
          this.timeElapsed = 0;
        } else {
          clearInterval(timer);
          this.endGame();
        }
      }
      this.timeElapsed += 0.1;
    }, 100);
  }

  private changeTemplate(slide: Slide): TemplateRef<any> {
    // project slide template into slide component
    console.log('>>> changing template');
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

  notifyImageOptions(imageOptions: Image[]): void {
    console.log('>>> sending image options to assistant');
    this.rxStompService.publish({
      destination: this.imageOptionsDestination,
      body: JSON.stringify(imageOptions),
    });
  }

  notifyEndGame() {
    this.rxStompService.publish({
      destination: this.endDestination,
    });
  }

  endGame(): void {
    // save score
    const gameResult = this.createGameResult();
    this.gameService
      .saveGameResult(gameResult)
      .then((res) => {
        console.log(res);
        // close game
        this.notifyEndGame();

        // navigate to game over view
        this.router.navigate(['/game-over', this.game.gameId, 'speaker']);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  createGameResult(): GameResult {
    const gameResult = {
      gameId: this.game.gameId,
      speakerName: this.speaker.name,
      assistantName: this.game.assistant.name,
      score: this.totalScore,
    };
    return gameResult;
  }

  ngOnDestroy(): void {
    this.nextSlideSub$.unsubscribe();
    this.imageSelectedTopicSub$.unsubscribe();
    this.reactionsTopicSub$.unsubscribe();
  }
}
