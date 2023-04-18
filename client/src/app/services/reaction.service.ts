import { Injectable } from '@angular/core';
import { Reaction } from '../models/reaction.model';

@Injectable({
  providedIn: 'root',
})
export class ReactionService {
  private reactions: Reaction[] = [];

  constructor() {}

  getReactions() {
    return this.reactions.slice();
  }

  addReaction(reaction: Reaction) {
    this.reactions = [...this.reactions, reaction];
  }
}
