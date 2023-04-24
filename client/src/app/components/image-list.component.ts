import { Component, OnInit } from '@angular/core';
import { Image } from '../models/image.model';
import { ImageService } from '../services/image.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css'],
})
export class ImageListComponent implements OnInit {
  email!: string;
  images: Image[] = [];
  form!: FormGroup;

  constructor(private imageService: ImageService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createForm();
    this.email = this.imageService.getEmail();
    this.getImages(this.email);
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: this.fb.control('', Validators.email),
    });
  }

  submitForm(): void {
    this.email = this.form.get('email')?.value;
    this.imageService.setEmail(this.email);

    // get user images
    this.getImages(this.email);
  }

  getImages(email: string) {
    console.log('>>> getting images for user: ' + email);

    this.imageService
      .getImagesByUser(email)
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
