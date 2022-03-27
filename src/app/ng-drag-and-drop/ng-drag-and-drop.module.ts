import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgDndElementDirective } from './ng-dnd-element.directive';

@NgModule({
  declarations: [
    NgDndElementDirective
  ],
  exports: [
    NgDndElementDirective
  ],
  imports: [
    CommonModule
  ]
})
export class NgDragAndDropModule { }
