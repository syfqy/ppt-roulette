import { Image } from './image.model';
import { Prompt } from './prompt.model';
import { Topic } from './topic.model';

export interface DeckMaterials {
  topic: Topic;
  prompts: Prompt[];
  images: Image[][];
}
