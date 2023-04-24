export interface Slide {
  timeForSlide: number;
  getId(): any;
  getType(): string;
  getContent(): string;
}
