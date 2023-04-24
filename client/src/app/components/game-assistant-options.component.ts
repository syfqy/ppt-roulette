import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-game-assistant-options',
  templateUrl: './game-assistant-options.component.html',
  styleUrls: ['./game-assistant-options.component.css'],
})
export class GameAssistantOptionsComponent {
  email!: string;
  form!: FormGroup;
  useOwnImages!: boolean;
  nImages!: number;

  constructor(private fb: FormBuilder, private imageService: ImageService) {}

  ngOnInit(): void {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: this.fb.control('', Validators.email),
    });
  }

  submitForm(): void {
    this.email = this.form.get('email')?.value;

    // get number of images saved under user's email
    this.imageService
      .getImageCountByUser(this.email)
      .then((res) => {
        this.nImages = res;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
