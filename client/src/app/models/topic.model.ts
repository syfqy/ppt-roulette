import { Slide } from './slide.model';

export class Topic implements Slide {
  topicId: string;
  topicText: string;
  timeForSlide: number = 10;

  constructor(topicId: string, topicText: string) {
    this.topicId = topicId;
    this.topicText = topicText;
  }

  getId(): string {
    return this.topicId;
  }

  getContent(): string {
    return this.topicText.toUpperCase();
  }

  getType(): string {
    return 'topic';
  }
}
