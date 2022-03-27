// import {
//   AfterViewInit,
//   Directive,
//   ElementRef,
//   EventEmitter,
//   HostListener,
//   Input,
//   OnChanges, Output,
//   Renderer2
// } from '@angular/core';
// import {DragItemConfig} from "./ng-drag-and-drop.types";
// import {NgDragAndDropService} from "./ng-drag-and-drop.service";
//
// @Directive({
//   selector: '[ngDragItem]'
// })
// export class NgDragItemDirective implements AfterViewInit, OnChanges {
//   id: string;
//   lvl: number = 0;
//
//   @Output() drop: EventEmitter<any> = new EventEmitter<any>();
//
//   @HostListener('dragstart', ['$event']) dragenter(e: DragEvent): void {
//     this.dndService.startLvl = this.lvl;
//     this.dndService.startDnd(this.id, this.dragItemConfig, e);
//
//     console.warn('dragstart', this.id);
//   }
//
//   @HostListener('dragend', ['$event']) dragend(e: DragEvent): void {
//     const res = this.dndService.getResult();
//     this.drop.emit(res);
//   }
//
//   constructor(
//     private dndService: NgDragAndDropService,
//     private render2: Renderer2,
//     private elementRef: ElementRef,
//   ) { }
//
//   ngAfterViewInit(): void {
//     this.render2.setAttribute(this.elementRef.nativeElement, 'draggable', 'true');
//   }
//
//   ngOnChanges(): void {
//     // this.dndService.setCurrentConfig(this.dragItemConfig);
//   }
//
// }
