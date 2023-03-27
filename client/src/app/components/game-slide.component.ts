import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-game-slide',
  templateUrl: './game-slide.component.html',
  styleUrls: ['./game-slide.component.css'],
})
export class GameSlideComponent implements OnInit {
  @Input()
  slideTemplate!: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {}
}
