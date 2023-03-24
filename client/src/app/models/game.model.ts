import { Deck } from './deck.model';
import { Player } from './player.model';

export interface Game {
  gameId: string;
  speaker: Player;
  assistant: Player;
  judges: Player[];
  deck: Deck;
  timePerSlide: number;
}
