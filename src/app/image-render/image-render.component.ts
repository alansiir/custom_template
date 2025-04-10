import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-render',
  template: `
    <img
      [src]="value"
      (error)="onImgError($event)"
      alt="photo"
      width="40"
      height="40"
      style="border-radius: 50%; object-fit: cover"
    />
  `
})
export class ImageRenderComponent {
  @Input() value: string = '';

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/user.jpg';
  }
}
