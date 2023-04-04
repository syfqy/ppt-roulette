import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Image } from '../models/image.model';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private httpClient: HttpClient) {}

  getImagesByUser(username: string): Promise<Image[]> {
    return lastValueFrom(
      this.httpClient.get<Image[]>(`/api/image/${username}`)
    );
  }

  searchImages(query: string): Promise<string[]> {
    const params = new HttpParams().set('query', query);

    return lastValueFrom(
      this.httpClient.get<string[]>('/api/image/search', {
        params: params,
      })
    );
  }

  deleteImage(imageId: string) {
    return lastValueFrom(this.httpClient.delete(`/api/image/{imageId}`));
  }
}
