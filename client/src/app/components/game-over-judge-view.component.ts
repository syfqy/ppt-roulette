import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactionService } from '../services/reaction.service';
import { Reaction } from '../models/reaction.model';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-game-over-judge-view',
  templateUrl: './game-over-judge-view.component.html',
  styleUrls: ['./game-over-judge-view.component.css'],
})
export class GameOverJudgeViewComponent implements OnInit, OnDestroy {
  reactions!: Reaction[];
  pointsAwarded!: number;
  judgeName!: string;
  topReaction!: string;
  topReactionCount!: number;

  constructor(
    private reactionService: ReactionService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.judgeName = this.playerService.getPlayer.name;
    console.log('>>> judgeName: ' + this.judgeName);

    this.reactions = this.reactionService.getReactions();

    console.log(this.reactions);

    this.pointsAwarded = this.reactions.reduce(
      (acc: number, r: Reaction) => acc + r.score,
      0
    );

    const topReactionMap = this.getTopReaction();
    this.topReaction = topReactionMap.reaction;
    this.topReactionCount = topReactionMap.count;
  }

  getTopReaction() {
    const counts: Record<string, number> = {};

    this.reactions.forEach((r: Reaction) => {
      if (counts[r.text]) {
        counts[r.text]++;
      } else {
        counts[r.text] = 1;
      }
    });

    const topReaction = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    const result = {
      reaction: topReaction,
      count: counts[topReaction],
    };

    return result;
  }

  ngOnDestroy(): void {
    this.reactionService.clearReactions();
  }
}
