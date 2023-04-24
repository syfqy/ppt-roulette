import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-images',
  templateUrl: './manage-images.component.html',
  styleUrls: ['./manage-images.component.css'],
})
export class ManageImagesComponent {
  // FIXME: when refreshing page, activeLink should read from activatedRoute
  navLabels: string[] = ['My Images', 'Add Image'];
  navLinks: string[] = ['all', 'new'];
  activeLink: string = this.navLinks[0];
}
