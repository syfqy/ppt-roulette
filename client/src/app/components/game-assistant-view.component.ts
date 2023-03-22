import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';
import { GameService } from '../services/game.service';
import { RxStompService } from '../services/rx-stomp.service';

@Component({
  selector: 'app-game-assistant-view',
  templateUrl: './game-assistant-view.component.html',
  styleUrls: ['./game-assistant-view.component.css'],
})
export class GameAssistantViewComponent implements OnInit {
  prevState!: any;
  gameId!: string;
  currentPlayer!: Player;
  players!: Player[];
  canSelectImage: boolean = false;
  images: string[][] = [];
  imageIdx: number = 0;
  showSelection = false;

  nextImageDestination: string = '/game/nextImage';

  nextSlideTopic: string = '/topic/slide';
  nextSlideTopicSub$!: Subscription;

  constructor(
    private rxStompService: RxStompService,
    private router: Router,
    private gameService: GameService
  ) {
    // get state from lobby
    const state = this.router.getCurrentNavigation()?.extras.state;
    console.log('>>> state');
    console.table(state);
    this.prevState = state;
  }

  ngOnInit() {
    if (!!this.prevState) {
      this.gameId = this.prevState['gameId'];
      this.currentPlayer = this.prevState['currentPlayer'];
      this.players = this.prevState['players'];

      // set topics and destinations
      this.nextImageDestination = `${this.nextImageDestination}/${this.gameId}`;
      this.nextSlideTopic = `${this.nextSlideTopic}/${this.gameId}`;
    }

    // get images
    this.gameService
      .getImages()
      .then((res) => {
        console.log('>>> Intializing game');
        console.log(res);
        const imageFlatArr = res;
        const imageNestedArr = [];
        while (imageFlatArr.length)
          imageNestedArr.push(imageFlatArr.splice(0, 3));
        console.log('>>> images :' + imageNestedArr);
        this.images = imageNestedArr;
      })
      .catch((err) => {
        console.error(err);
      });

    // subscribe to next slide event by host
    this.nextSlideTopicSub$ = this.rxStompService
      .watch(this.nextSlideTopic)
      .subscribe((slideIdx: any) => {
        // change to next selection
        console.log('>>> assistant slideIdx: ' + slideIdx);
        this.showSelection = slideIdx % 2 === 0;
        if (this.imageIdx < 2) this.imageIdx++;
      });
  }

  selectNextImage(imageUrl: string): void {
    // FIXME: Disable selection on image slide
    console.log('>>> assistant selected image: ' + imageUrl);

    this.rxStompService.publish({
      destination: this.nextImageDestination,
      body: imageUrl,
    });
  }
}
