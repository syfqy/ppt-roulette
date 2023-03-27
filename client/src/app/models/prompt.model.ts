import { Slide } from './slide.model';

export class Prompt implements Slide {
  promptId: string;
  promptText: string;

  constructor(promptId: string, promptText: string) {
    this.promptId = promptId;
    this.promptText = promptText;
  }

  getId(): string {
    return this.promptId;
  }

  getContent(): string {
    return this.promptText;
  }

  getType(): string {
    return 'prompt';
  }
}
