import { DeckMaterials } from './deck-materials.model';
import { Image } from './image.model';
import { Slide } from './slide.model';

export class Deck {
  slides: Slide[];
  imageSelectionArrs: Image[][];

  constructor(slides: Slide[], imageSelectionArrs: Image[][]) {
    this.slides = slides;
    this.imageSelectionArrs = imageSelectionArrs;
  }

  public createFromDeckMaterials(deckMaterials: DeckMaterials) {
    this.imageSelectionArrs = deckMaterials.images;
    this.slides.push(deckMaterials.topic);
    for (let i = 0; i < deckMaterials.images.length; i++) {
      this.slides.push(deckMaterials.images[i][0]);
      if (i < deckMaterials.prompts.length)
        this.slides.push(deckMaterials.prompts[i]);
    }
  }

  public setSlideByIdx(idx: number, slide: Slide) {
    this.slides[idx] = slide;
  }
}
