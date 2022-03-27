import {Directive, ElementRef, Input} from '@angular/core';
import {NgDragAndDropService} from "./ng-drag-and-drop.service";
import {DragIndicatorPosition} from "./ng-drag-and-drop.types";

@Directive({
  selector: '[dndElement]'
})
export class NgDndElementDirective {
  @Input() set dndItem(item: any) {
    this.item = item;
  }

  @Input() set dndItemType(type: string) {
    this.dnd.itemToType.set(this.item, type);
  }

  @Input() set dndItemData(data: any) {
    this.dnd.itemToData.set(this.item, data);
  }

  @Input() getNeighbors: (dndItem: any) => {before: any, after: any};
  @Input() getParent: (dndItem: any) => any;

  item: any;

  constructor(
    private elementRef: ElementRef,
    private dnd: NgDragAndDropService ) { }

  calcLvl(item: any): number {
    const parent = this.getParent(item);
    if (parent == null) {
      return 0;
    }
    return this.calcLvl(parent) + 1;
  }

  get lvl(): number {
    return this.calcLvl(this.item);
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

  recalcIndicator(): void {

  }

}
