import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgDragContainerDirective } from './ng-drag-container.directive';
import { NgDragItemDirective } from './ng-drag-item.directive';
import { NgDndElementDirective } from './ng-dnd-element.directive';



@NgModule({
  declarations: [
    NgDragContainerDirective,
    NgDragItemDirective,
    NgDndElementDirective
  ],
  exports: [
    NgDragItemDirective,
    NgDragContainerDirective,
  ],
  imports: [
    CommonModule
  ]
})
export class NgDragAndDropModule { }
