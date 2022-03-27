import {Renderer2} from "@angular/core";
import {DragIndicatorPosition} from "./ng-drag-and-drop.types";

export class DndIndicator {
  indicatorElement: HTMLElement;

  position: DragIndicatorPosition;

  constructor(
    private render2: Renderer2,
    private parentElement: HTMLElement,
  ) {
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
        this.indicatorElement.innerHTML = "";
      }
    }
  }




}
