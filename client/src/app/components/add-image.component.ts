import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.css'],
})
export class AddImageComponent implements OnInit {
  form!: FormGroup;
  searchResults!: string[];

  constructor(private fb: FormBuilder, private imageService: ImageService) {}

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      query: this.fb.control('', Validators.required),
    });
  }

  submitForm() {
    const query = this.form.get('query')?.value;

    this.imageService
      .searchImages(query)
      .then((res) => {
        this.searchResults = res;
      })
      .catch((err) => console.error(err));
  }
}
