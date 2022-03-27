import {AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {DndResult, DragIndicatorPosition, DragItemConfigInContainer} from "./ng-drag-and-drop.types";
import {NgDragAndDropService} from "./ng-drag-and-drop.service";

@Directive({
  selector: '[ngDragContainer]'
})
export class NgDragContainerDirective implements AfterViewInit {

  @Input() set dndId(val: string) {
    this.id = val;
    this.dnd.idToElement.set(this.id, this.elementRef.nativeElement);
    this.dnd.elementToId.set(this.elementRef.nativeElement, this.id);
  }

  @Input() set dndContainerName(val: any) {
    this.dnd.idToContainerName.set(this.id, val);
    this.name = val;
  }

  @Input() set dndContainerLvl(val: number) {
    this.dnd.idToLvl.set(this.id, val);
    this.lvl = val;
  }

  @Input() set dndContainerData(val: any) {
    this.dnd.idToData.set(this.id, val);
    this.data = val;
  }

  @Input() checkIsParent: (parentId: string, childId: string) => boolean;
  @Input() getNeighbors: (targetId: string) => {beforeId: string, afterId: string};
  @Input() getParent: (dndItem: any) => any;

  data: any = null;
  name: string;
  lvl: number = 0;
  id: string;

  config: DragItemConfigInContainer;

  enterTarget: EventTarget = null;

  indicatorHTML: HTMLElement = null;
  indicatorLvl = 0;
  currentIndicatorPosition: DragIndicatorPosition = null;


  @HostListener('dragenter', ['$event']) dragenter(e: DragEvent): void {
    if (!this.dnd.checkCanDropInContainer(this.name)) {
      return;
    }
    this.dnd.getNeighbors = this.getNeighbors;

    this.config = this.dnd.getConfigByContainer(this.name);
    this.enterTarget = e.target;
    this.dnd.targetContainerId = this.id;

    this.recalcIndicator(e);
  }

  @HostListener('dragleave', ['$event']) dragleave(e: DragEvent): void {
    if (this.enterTarget == e.target){
      e.stopPropagation();
      e.preventDefault();

      this.removeIndicator();
    }
  }

  @HostListener('dragover', ['$event']) dragover(e: DragEvent): void {
    if (!this.dnd.checkCanDropInContainer(this.name)) {
      return;
    }
    this.recalcIndicator(e);
  }

  constructor(
    private dnd: NgDragAndDropService,
    private render2: Renderer2,
    private elementRef: ElementRef,
  ) { }

  setPositionIndicator(position: DragIndicatorPosition): void {
    if (this.indicatorHTML && this.currentIndicatorPosition != position) {
      this.dnd.targetPosition = position;

      ['top', 'left', 'right', 'bottom', 'inside'].forEach(e => {
        if (e != position) {
          this.render2.removeClass(this.indicatorHTML, 'DndIndicator--' + String(e))
        }
      })
      this.render2.addClass(this.indicatorHTML, 'DndIndicator--' + String(position));
    }
  }

  setLvlIndicator(lvl: number): void {
    this.dnd.targetLvl = lvl;
    const totalShift = lvl * this.dnd.shiftLvlPx;
    this.render2.setStyle(this.indicatorHTML, 'margin-left', String(totalShift) + 'px');
    this.indicatorLvl = lvl;
  }

  getActualPositionIndicator(offsetX: number, offsetY: number): DragIndicatorPosition {
    const H = this.elementRef.nativeElement.offsetHeight;
    const W = this.elementRef.nativeElement.offsetWidth;

    const distToBorderPx = {
      top: offsetY,
      left: offsetX,
      right: W - offsetX,
      bottom: H - offsetY,
      inside: Math.abs(offsetY - H / 2) * 2,
    }

    const config = this.dnd.getConfigByContainer(this.name);
    const positions = config.positions.sort((a, b) => {
      return (distToBorderPx[a] - distToBorderPx[b]);
    });

    for (let position of positions) {
      if (position == 'left' || position == 'right') {
        if (distToBorderPx[position] <= config.verticalSideIndent) {
          return position;
        }
        continue;
      }
      return position;
    }
    return null;
  }

  setPositionAndLvlIndicator(position: DragIndicatorPosition, lvl: number): void {
    if (lvl == -1) {
      this.removeIndicator();
      return;
    }

    if (!this.indicatorHTML) {
      this.addIndicator();
    }

    this.setPositionIndicator(position);
    this.setLvlIndicator(lvl);
  }

  recalcIndicator(e: DragEvent): void {
    const position = this.getActualPositionIndicator(e.offsetX, e.offsetY);

    if (!position) return;

    if (position == 'inside') {
      // TODO inside indicator
      return;
    }

    const neighbors = this.getNeighbors(this.id);

    let minLvl, maxLvl;

    if (position == 'bottom') {
      const tmp = this.calcPermissionLevelsBetweenContainers(this.id, neighbors.afterId);
      minLvl = tmp.minLvl;
      maxLvl = tmp.maxLvl;

      console.log(position, this.id, neighbors.afterId, minLvl, maxLvl)

    }

    if (position == 'top') {
      const tmp = this.calcPermissionLevelsBetweenContainers(neighbors.beforeId, this.id);
      minLvl = tmp.minLvl;
      maxLvl = tmp.maxLvl;

      console.log(position, neighbors.beforeId, this.id, minLvl, maxLvl)
    }

    let lvl = this.dnd.getCurrentLvl(e.clientX, e.clientY);


    if (minLvl == -1) {
      lvl = -1;
    } else {
      lvl = Math.max(lvl, minLvl);
      lvl = Math.min(lvl, maxLvl);
    }

    this.setPositionAndLvlIndicator(position, lvl);
  }


  calcPermissionLevelsBetweenContainers(beforeId: string, afterId: string): {minLvl: number, maxLvl: number} {
    const beforeLvl = beforeId ? this.dnd.idToLvl.get(beforeId) : -1;
    const afterLvl = afterId ? this.dnd.idToLvl.get(afterId) : -1;

    let {minLvl, maxLvl} = this.dnd.getPermissibleLevels(beforeId, afterId);


    if (beforeId == this.dnd.activeDragItemId) {
      maxLvl = Math.min(maxLvl, beforeLvl);
    }

    if (this.checkIsParent(this.dnd.activeDragItemId, beforeId)) {
      const dratItemLvl = this.dnd.idToLvl.get(this.dnd.activeDragItemId) ?? -1;
      maxLvl = Math.min(maxLvl, dratItemLvl);
    }

    if (minLvl == -1 || maxLvl == -1 || maxLvl < minLvl) {
      return {minLvl: -1, maxLvl: -1};
    }

    return {maxLvl, minLvl};
  }

  ngAfterViewInit(): void {
    this.render2.setStyle(this.elementRef.nativeElement, 'position', 'relative');
  }

  addIndicator(): void {
    if (this.indicatorHTML) return;

    this.render2.setStyle(this.elementRef.nativeElement.parentElement, 'z-index', '149999');

    this.indicatorHTML = this.render2.createElement("div");

    this.render2.addClass(this.indicatorHTML, "DndIndicator");
    this.indicatorHTML.innerHTML = "<svg class=\"TasksDragIndicatorIconTriangle\" width=\"7\" height=\"8\" viewBox=\"0 0 7 8\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6.5 3.13397C7.16667 3.51887 7.16667 4.48113 6.5 4.86603L2 7.4641C1.33333 7.849 0.5 7.36788 0.5 6.59808L0.5 1.40192C0.5 0.632124 1.33333 0.150998 2 0.535898L6.5 3.13397Z\" fill=\"#7957FF\"></path></svg>"

    this.render2.appendChild(this.elementRef.nativeElement, this.indicatorHTML);
  }

  removeIndicator(): void {
    if (this.dnd.targetContainerId == this.id) {
      // this.dnd.targetContainerId = null;
    }

    if (!this.indicatorHTML) return;

    this.render2.removeStyle(this.elementRef.nativeElement.parentElement, 'z-index');

    this.render2.removeChild(this.elementRef.nativeElement, this.indicatorHTML);
    this.indicatorHTML = null;
  }


}
