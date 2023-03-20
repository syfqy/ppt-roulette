import { Player } from './player.model';

export class Game {
  gameId: string;
  speaker: Player;
  assistant: Player;
  judges: Player[];
  topic: string;
  prompts: string[];
  imageUrls: string[];

  constructor(
    gameId: string,
    speaker: Player,
    assistant: Player,
    judges: Player[],
    topic: string,
    prompts: string[],
    imageUrls: string[]
  ) {
    this.gameId = gameId;
    this.speaker = speaker;
    this.assistant = assistant;
    this.judges = judges;
    this.topic = topic;
    this.prompts = prompts;
    this.imageUrls = imageUrls;
  }
}
