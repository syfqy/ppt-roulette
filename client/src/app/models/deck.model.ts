import { DeckMaterials } from './deck-materials.model';
import { Image } from './image.model';
import { Prompt } from './prompt.model';
import { Slide } from './slide.model';
import { Topic } from './topic.model';

export class Deck {
  slides: Slide[];
  imageSelectionArrs: Image[][];

  constructor(slides: Slide[], imageSelectionArrs: Image[][]) {
    this.slides = slides;
    this.imageSelectionArrs = imageSelectionArrs;
  }

  static createFromDeckMaterials(
    deckMaterials: DeckMaterials,
    speakerName: string
  ): Deck {
    const slides: Slide[] = [];
    const imageSelectionArrs: Image[][] = [];

    deckMaterials.imageLists.forEach((imageArr) => {
      const newImageArr: Image[] = [];
      imageArr.forEach((image) => {
        newImageArr.push(this.createImage(image.imageId, image.imageUrl));
      });
      imageSelectionArrs.push(newImageArr);
    });

    slides.push(
      this.createTopic(
        deckMaterials.topic.topicId,
        deckMaterials.topic.topicText
      )
    );

    for (let i = 0; i < deckMaterials.imageLists.length; i++) {
      let imageMaterial = deckMaterials.imageLists[i][0];
      slides.push(
        this.createImage(imageMaterial.imageId, imageMaterial.imageUrl)
      );
      if (i < deckMaterials.prompts.length) {
        let promptMaterial = deckMaterials.prompts[i];
        slides.push(
          this.createPrompt(promptMaterial.promptId, promptMaterial.promptText)
        );
      }
    }

    // add intro and end slides
    const introSlide = this.createPrompt(
      '0',
      `My name is ${speakerName}, and today I would like to talk to you about...`
    );

    const endSlide = this.createPrompt('1', 'Thank you');

    return new Deck(
      [introSlide, ...slides, endSlide],
      deckMaterials.imageLists
    );
  }

  static createTopic(topicId: string, topicText: string): Topic {
    return new Topic(topicId, topicText);
  }

  static createPrompt(promptId: string, promptText: string): Prompt {
    return new Prompt(promptId, promptText);
  }
  static createImage(imageId: string, imageUrl: string): Image {
    return new Image(imageId, imageUrl);
  }

  setSlideByIdx(idx: number, slide: Slide) {
    this.slides[idx] = slide;
  }

  getSlideByIdx(idx: number) {
    return this.slides[idx];
  }
}
