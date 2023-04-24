import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-game-over-speaker-view',
  templateUrl: './game-over-speaker-view.component.html',
  styleUrls: ['./game-over-speaker-view.component.css'],
})
export class GameOverSpeakerViewComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  routeSub$!: Subscription;
  gameId!: string;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.createForm();

    this.routeSub$ = this.activatedRoute.params.subscribe((params) => {
      this.gameId = params['gameId'];
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: this.fb.control('', [Validators.email]),
    });
  }

  submitForm(): void {
    const email = this.form.get('email')?.value;

    this.gameService
      .emailGameResult(this.gameId, email)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  ngOnDestroy(): void {
    this.routeSub$.unsubscribe();
  }
}
