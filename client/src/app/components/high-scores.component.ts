import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import { GameResult } from '../models/game-result.model';

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.css'],
})
export class HighScoresComponent implements OnInit {
  gameResults: GameResult[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService
      .getHighScores()
      .then((res) => {
        this.gameResults = res;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
