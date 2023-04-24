import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { Image } from '../models/image.model';
import { Player } from '../models/player.model';
import { PlayerService } from '../services/player.service';
import { RxStompService } from '../services/rx-stomp.service';

@Component({
  selector: 'app-game-assistant-view',
  templateUrl: './game-assistant-view.component.html',
  styleUrls: ['./game-assistant-view.component.css'],
})
export class GameAssistantViewComponent implements OnInit, OnDestroy {
  assistant!: Player;
  gameId!: string;

  imageOptions!: Image[];
  imageSelected!: Image;
  isImageConfirmed: boolean = false;

  imageOptionsTopic: string = '/topic/imageOptions';
  imageSelectedDestination: string = '/game/imageSelected';

  routeSub$!: Subscription;
  imageOptionsSub$!: Subscription;

  constructor(
    private playerService: PlayerService,
    private activatedRoute: ActivatedRoute,
    private rxStompService: RxStompService
  ) {}

  ngOnInit(): void {
    // get assistant
    this.assistant = this.playerService.getPlayer();

    // get game id
    this.routeSub$ = this.activatedRoute.params.subscribe((params) => {
      this.gameId = params['gameId'];
      this.imageOptionsTopic = `${this.imageOptionsTopic}/${this.gameId}`;
      this.imageSelectedDestination = `${this.imageSelectedDestination}/${this.gameId}`;
    });

    // subscribe to image options from speaker
    this.imageOptionsSub$ = this.rxStompService
      .watch(this.imageOptionsTopic)
      .subscribe((message: Message) => {
        console.log('>>> received image options from speaker');
        console.log(JSON.parse(message.body));
        this.imageOptions = JSON.parse(message.body) as Image[];
        this.isImageConfirmed = false;
        this.imageSelected = {} as Image;
      });
  }

  //FIXME: prevent assistant from selecting slide too late
  selectImage(image: Image) {
    this.imageSelected = image;
  }

  notifyImageSelected() {
    this.rxStompService.publish({
      destination: this.imageSelectedDestination,
      body: JSON.stringify(this.imageSelected),
    });
    this.isImageConfirmed = true;
  }

  ngOnDestroy() {
    this.routeSub$.unsubscribe();
    this.imageOptionsSub$.unsubscribe();
  }
}
