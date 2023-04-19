import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.css'],
})
export class GameOverComponent implements OnInit, OnDestroy {
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
