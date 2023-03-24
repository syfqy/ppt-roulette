import { Slide } from './slide.model';

export class Image implements Slide {
  imageId: string;
  imageUrl: string;

  constructor(imageId: string, imageUrl: string) {
    this.imageId = imageId;
    this.imageUrl = imageUrl;
  }

  getId(): string {
    return this.imageId;
  }

  getContent(): string {
    return this.imageUrl;
  }

  getType(): string {
    return 'image';
  }
}
