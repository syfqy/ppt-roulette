import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Image } from '../models/image.model';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private email!: string;

  constructor(private httpClient: HttpClient) {}

  getEmail() {
    return this.email;
  }

  setEmail(email: string) {
    this.email = email;
  }

  getImageCountByUser(email: string): Promise<number> {
    return lastValueFrom(
      this.httpClient.get<number>(`/api/image/count/${email}`)
    );
  }

  getImagesByUser(email: string): Promise<Image[]> {
    return lastValueFrom(this.httpClient.get<Image[]>(`/api/image/${email}`));
  }

  searchImages(query: string): Promise<string[]> {
    const params = new HttpParams().set('query', query).set('limit', 10);

    return lastValueFrom(
      this.httpClient.get<string[]>('/api/image/search', {
        params: params,
      })
    );
  }

  saveImage(pexelsImageUrl: string, email: string) {
    const body = {
      imageUrl: pexelsImageUrl,
      username: email,
    };

    return lastValueFrom(this.httpClient.post('/api/image/save', body));
  }

  deleteImage(imageId: string) {
    return lastValueFrom(this.httpClient.delete(`/api/image/${imageId}`));
  }
}
