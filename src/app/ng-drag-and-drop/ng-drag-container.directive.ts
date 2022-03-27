// import {AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
// import {DndResult, DragIndicatorPosition, DragItemConfigInContainer} from "./ng-drag-and-drop.types";
// import {NgDragAndDropService} from "./ng-drag-and-drop.service";
//
// @Directive({
//   selector: '[ngDragContainer]'
// })
// export class NgDragContainerDirective {
//
//   // @Input() set dndId(val: string) {
//   //   this.id = val;
//   //   this.dnd.idToElement.set(this.id, this.elementRef.nativeElement);
//   //   this.dnd.elementToId.set(this.elementRef.nativeElement, this.id);
//   // }
//   //
//   // @Input() set dndContainerName(val: any) {
//   //   this.dnd.idToContainerName.set(this.id, val);
//   //   this.name = val;
//   // }
//   //
//   // @Input() set dndContainerLvl(val: number) {
//   //   this.dnd.idToLvl.set(this.id, val);
//   //   this.lvl = val;
//   // }
//   //
//   // @Input() set dndContainerData(val: any) {
//   //   this.dnd.idToData.set(this.id, val);
//   //   this.data = val;
//   // }
//   //
//   // @Input() checkIsParent: (parentId: string, childId: string) => boolean;
//   // @Input() getNeighbors: (targetId: string) => {beforeId: string, afterId: string};
//   // @Input() getParent: (dndItem: any) => any;
//   //
//   // data: any = null;
//   // name: string;
//   // lvl: number = 0;
//   // id: string;
//   //
//   // config: DragItemConfigInContainer;
//   //
//   // enterTarget: EventTarget = null;
//   //
//   // indicatorHTML: HTMLElement = null;
//   // indicatorLvl = 0;
//   // currentIndicatorPosition: DragIndicatorPosition = null;
//   //
//   //
//   // @HostListener('dragenter', ['$event']) dragenter(e: DragEvent): void {
//   //   if (!this.dnd.checkCanDropInContainer(this.name)) {
//   //     return;
//   //   }
//   //   this.dnd.getNeighbors = this.getNeighbors;
//   //
//   //   this.config = this.dnd.getConfigByContainer(this.name);
//   //   this.enterTarget = e.target;
//   //   this.dnd.targetContainerId = this.id;
//   //
//   //   this.recalcIndicator(e);
//   // }
//   //
//   // @HostListener('dragleave', ['$event']) dragleave(e: DragEvent): void {
//   //   if (this.enterTarget == e.target){
//   //     e.stopPropagation();
//   //     e.preventDefault();
//   //
//   //     this.removeIndicator();
//   //   }
//   // }
//   //
//   // @HostListener('dragover', ['$event']) dragover(e: DragEvent): void {
//   //   if (!this.dnd.checkCanDropInContainer(this.name)) {
//   //     return;
//   //   }
//   //   this.recalcIndicator(e);
//   // }
//   //
//   // constructor(
//   //   private dnd: NgDragAndDropService,
//   //   private render2: Renderer2,
//   //   private elementRef: ElementRef,
//   // ) { }
//
// }
