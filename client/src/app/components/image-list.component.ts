import { Component, OnInit } from '@angular/core';
import { Image } from '../models/image.model';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css'],
})
export class ImageListComponent implements OnInit {
  username: string = 'user1';
  images: Image[] = [];

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.imageService
      .getImagesByUser(this.username)
      .then((res) => {
        this.images = res;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  deleteImage(imageId: string) {
    this.imageService
      .deleteImage(imageId)
      .then((res) => {
        this.images = this.images.filter((img) => img.imageId !== imageId);
      })
      .catch((err) => console.error(err));
  }
}
