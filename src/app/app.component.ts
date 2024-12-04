import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div style="padding: 20px;">
      <button mat-raised-button color="primary" (click)="sayHello()">
        Hello World
      </button>
    </div>
  `
})
export class AppComponent {
  sayHello() {
    alert('Hello World!');
  }
}
