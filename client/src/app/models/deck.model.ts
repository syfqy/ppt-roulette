import { Image } from './image.model';
import { Prompt } from './prompt.model';
import { Topic } from './topic.model';

export interface Deck {
  topic: Topic;
  prompts: Prompt[];
  images: Image[][];
}
