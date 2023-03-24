import { DeckMaterials } from './deck-materials.model';
import { Player } from './player.model';

export interface Game {
  gameId: string;
  speaker: Player;
  assistant: Player;
  judges: Player[];
  deckMaterials: DeckMaterials;
  timePerSlide: number;
}
