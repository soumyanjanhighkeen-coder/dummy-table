import { Component, ViewEncapsulation } from '@angular/core';
import { BuilderComponent } from './builder/builder';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BuilderComponent],
  template: '<app-builder />',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class App {}
