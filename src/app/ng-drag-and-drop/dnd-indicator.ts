import {Renderer2} from "@angular/core";
import {DragIndicatorPosition} from "./ng-drag-and-drop.types";
import {NgDragAndDropService} from "./ng-drag-and-drop.service";

export class DndIndicator {
  indicatorElement: HTMLElement;
  parent: HTMLElement;

  position: DragIndicatorPosition;
  level: number;

  constructor(
    private dnd: NgDragAndDropService,
    private render2: Renderer2,
  ) {
    console.log(this.render2);
  }

  setPosition(position: DragIndicatorPosition): void {
    if (this.indicatorElement && this.position != position) {
      ['top', 'left', 'right', 'bottom', 'inside'].forEach(e => {
        if (e != position) {
          this.render2.removeClass(this.indicatorElement, 'DndIndicator--' + String(e))
        }
      })
      this.render2.addClass(this.indicatorElement, 'DndIndicator--' + String(position));

      if (position == 'top' || position == 'bottom') {
        this.indicatorElement.innerHTML = "<svg class=\"TasksDragIndicatorIconTriangle\" width=\"7\" height=\"8\" viewBox=\"0 0 7 8\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6.5 3.13397C7.16667 3.51887 7.16667 4.48113 6.5 4.86603L2 7.4641C1.33333 7.849 0.5 7.36788 0.5 6.59808L0.5 1.40192C0.5 0.632124 1.33333 0.150998 2 0.535898L6.5 3.13397Z\" fill=\"#7957FF\"></path></svg>"
      } else {
        this.indicatorElement.innerHTML = "";
      }

      this.position = position;
    }
  }

  setLvl(lvl: number): void {
    if (!this.indicatorElement) return;

    const totalShift = lvl * this.dnd.config.offsetOneLvlPx;
    this.render2.setStyle(this.indicatorElement, 'margin-left', String(totalShift) + 'px');

    this.level = lvl;
  }

  updateIndicator(parent: HTMLElement, position: DragIndicatorPosition, level: number): void {
    if (!parent || !position || level < 0) {
      this.removeIndicator();
      return;
    }

    if (this.parent != parent || !this.indicatorElement) {
      this.removeIndicator();
      this.createIndicator(parent, position, level);
    }

    this.setPosition(position);
    this.setLvl(level);
  }


  createIndicator(parent: HTMLElement, position: DragIndicatorPosition, level: number): void {
    if (this.indicatorElement) return;

    console.error('createIndicator')

    this.parent = parent;
    this.position = position;
    this.level = level;

    this.render2.setStyle(parent.parentElement, 'z-index', '149999');

    this.indicatorElement = this.render2.createElement("div");
    this.render2.addClass(this.indicatorElement, "DndIndicator");

    this.render2.appendChild(parent, this.indicatorElement);
  }

  removeIndicator(): void {
    if (!this.indicatorElement) return;

    this.render2.removeStyle(this.parent.parentElement, 'z-index');
    this.render2.removeChild(this.parent, this.indicatorElement);

    this.indicatorElement = null;
    this.parent = null;
    this.position = null;
    this.level = null;
  }

}
