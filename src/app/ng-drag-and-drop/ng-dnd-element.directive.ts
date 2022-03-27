import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2
} from '@angular/core';
import {NgDragAndDropService} from "./ng-drag-and-drop.service";
import {DndItem, DragIndicatorPosition, DragItemConfig} from "./ng-drag-and-drop.types";

@Directive({
  selector: '[dndElement]'
})
export class NgDndElementDirective implements AfterViewInit {
  @Input() set dndItem(item: DndItem) {
    this.item = item;
  }

  @Input() set dndItemType(type: string) {
    this.dnd.itemToType.set(this.item, type);
  }

  @Input() set dndItemData(data: any) {
    this.dnd.itemToData.set(this.item, data);
  }

  @Input() getNeighbors: (dndItem: DndItem) => {before: DndItem, after: DndItem};
  @Input() getParent: (dndItem: DndItem) => DndItem;

  crutchDragLeaveTarget: EventTarget;

  @HostListener('dragenter', ['$event']) dragenter(e: DragEvent): void {
    if (!this.dnd.checkCanDropIn(this.item)) {
      return;
    }
    this.crutchDragLeaveTarget = e.target;
    this.dnd.setDndContainer(this);
  }

  @HostListener('dragleave', ['$event']) dragleave(e: DragEvent): void {
    if (this.crutchDragLeaveTarget == e.target){
      e.stopPropagation();
      e.preventDefault();
    }
  }

  @HostListener('dragover', ['$event']) dragover(e: DragEvent): void {
    if (!this.dnd.checkCanDropIn(this.item)) {
      return;
    }
    // console.log('dragover', this.item);
    this.recalcIndicator(e);
  }

  /******************/

  @Input() dndConfig: DragItemConfig;

  @Output() drop: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('dragstart', ['$event']) dragstart(e: DragEvent): void {
    this.dnd.startDnd(this, e);
    console.warn('dragstart', this.item);
  }

  @HostListener('dragend', ['$event']) dragend(e: DragEvent): void {
    console.log('dragend');

    const res = this.dnd.getResult();
    if (res) {
      this.drop.emit(res);
    }

    this.dnd.endDndSession();
  }

  item: any;

  constructor(
    private render2: Renderer2,
    public elementRef: ElementRef,
    private dnd: NgDragAndDropService ) {
  }

  calcPosition(offsetX: number, offsetY: number): DragIndicatorPosition {
    const H = this.elementRef.nativeElement.offsetHeight;
    const W = this.elementRef.nativeElement.offsetWidth;
    const config = this.dnd.getItemConfig(this.item);

    const verticalSideIndent = config?.verticalSideIndent ?? 1e5;

    const distToBorderPx = {
      top: offsetY,
      left: offsetX <= verticalSideIndent ? offsetX : 1e5,
      right: (W - offsetX) <= verticalSideIndent ? (W - offsetX) : 1e5,
      bottom: H - offsetY,
      inside: Math.abs(offsetY - H / 2) * 2,
    }

    const positions = config.positions.sort((a, b) => distToBorderPx[a] - distToBorderPx[b]);
    return positions.length > 0 ? positions[0]: null;
  }

  recalcIndicator(e: DragEvent): void {
    // console.log('----------------recalcIndicator--------------');

    const position = this.calcPosition(e.offsetX, e.offsetY);

    if (!position) return;

    if (position == 'inside') {
      // TODO inside indicator
      return;
    }

    const neighbors = this.getNeighbors(this.item);


    // console.log('neighbors', neighbors);

    let minLvl, maxLvl;

    if (position == 'bottom') {
      const tmp = this.dnd.calcPermissionLevelsBetweenContainers(this.item, neighbors.after);
      minLvl = tmp.minLvl;
      maxLvl = tmp.maxLvl;
    }

    if (position == 'top') {
      const tmp = this.dnd.calcPermissionLevelsBetweenContainers(neighbors.before, this.item);
      minLvl = tmp.minLvl;
      maxLvl = tmp.maxLvl;
    }

    let lvl = this.dnd.getMouseLvl(e.clientX, e.clientY);

    if (minLvl == -1) {
      lvl = -1;
    } else {
      lvl = Math.max(lvl, minLvl);
      lvl = Math.min(lvl, maxLvl);
    }

    // console.log('setIndicator', this.item, position, lvl);
    this.dnd.setIndicator(this, position, lvl);
  }

  ngAfterViewInit(): void {
    this.render2.setStyle(this.elementRef.nativeElement, 'position', 'relative');
  }
}
