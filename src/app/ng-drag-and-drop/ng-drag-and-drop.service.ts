import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {
  DndContainerResult,
  DndItem,
  DndResult,
  DragIndicatorPosition,
  DragItemConfig,
  DragItemConfigInContainer
} from "./ng-drag-and-drop.types";
import {NgDndElementDirective} from "./ng-dnd-element.directive";
import {DndIndicator} from "./dnd-indicator";

interface DndTargetContainer {
  item: any;
  position: DragIndicatorPosition;
  level: number;
  ref: NgDndElementDirective;
}

@Injectable({
  providedIn: 'root'
})
export class NgDragAndDropService {
  itemToType: Map<any, string> = new Map<any, string>();
  itemToData: Map<any, any> = new Map<any, any>();

  config: DragItemConfig;

  CURSOR_CLIENT_START_POSITION = {x: 0, y: 0}

  target: DndTargetContainer;

  activeItem: DndItem;
  activeItemRef: NgDndElementDirective;

  indicator: DndIndicator;

  getNeighbors: (dndItem: DndItem) => {before: DndItem, after: DndItem};
  getParent: (dndItem: DndItem) => DndItem;

  private render2: Renderer2;
  constructor(rendererFactory: RendererFactory2) {
    // console.error('constructor NgDragAndDropService');
    this.render2 = rendererFactory.createRenderer(null, null);
    // console.error('constructor end NgDragAndDropService');
    this.indicator = new DndIndicator(this, this.render2);
  }

  getItemConfig(item: DndItem): DragItemConfigInContainer {
    const type = this.itemToType.get(item);
    return this.config.containers[type] ?? null;
  }

  checkCanDropIn(zone: DndItem): boolean {
    const type = this.itemToType.get(zone);
    return !!(this.config.containers[type] && this.config.containers[type]?.positions?.length);
  }

  startDnd(activeItemRef: NgDndElementDirective, event: DragEvent): void {
    this.activeItem = activeItemRef.item;
    this.activeItemRef = activeItemRef;
    this.config = activeItemRef.dndConfig;

    this.CURSOR_CLIENT_START_POSITION.x = event.clientX;
    this.CURSOR_CLIENT_START_POSITION.y = event.clientY;
  }

  endDndSession(): void {
    this.setIndicator(null, null, -1);
  }

  setDndContainer(refDirective: NgDndElementDirective): void {
    this.target = {
      item: refDirective.item,
      position: null,
      level: -1,
      ref: refDirective,
    }

    this.getParent = refDirective.getParent;
    this.getNeighbors = refDirective.getNeighbors;
  }

  setIndicator(containerRef: NgDndElementDirective, position: DragIndicatorPosition, level: number): void {
    if (!containerRef || !position || level < 0) {
      this.target = null;
    } else {
      this.target = {
        item: containerRef.item,
        position,
        level,
        ref: containerRef,
      }
    }

    this.indicator.updateIndicator(containerRef?.elementRef?.nativeElement, position, level);
  }

  getLevel(item: DndItem): number {
    if (item == null) return null;

    const parent = this.getParent(item);
    if (parent == null) return 0;

    return this.getLevel(parent) + 1;
  }

  getMouseLvl(clientX: number, clientY: number): number {
    const offsetOneLvl = this.config.offsetOneLvlPx;
    const level = this.getLevel(this.activeItem);

    if (clientX < this.CURSOR_CLIENT_START_POSITION.x) {
      const len = this.CURSOR_CLIENT_START_POSITION.x - clientX;
      return level - (len / offsetOneLvl>>0);
    } else {
      const len = clientX - this.CURSOR_CLIENT_START_POSITION.x;
      const shift = (len / offsetOneLvl>>0);
      return level + shift;
    }
  }

  getPermissibleLevels(before, after): {minLvl: number, maxLvl: number} {
    const beforeLvl = this.getLevel(before);
    const afterLvl = this.getLevel(after);
    // console.log('getPermissibleLevels', beforeLvl, afterLvl);

    if (beforeLvl == null) {
      return {minLvl: 0, maxLvl: 0};
    }

    if (afterLvl == null) {
      return {minLvl: 0, maxLvl: beforeLvl + 1};
    }

    if (beforeLvl == afterLvl) {
      return {minLvl: beforeLvl, maxLvl: beforeLvl + 1};
    }

    if (beforeLvl < afterLvl) {
      return {minLvl: afterLvl, maxLvl: beforeLvl + 1};
    }

    if (beforeLvl > afterLvl) {
      return {minLvl: afterLvl, maxLvl: beforeLvl + 1};
    }
    throw new Error('getPermissibleLevels not return value')
  }

  checkIsParent(parent: DndItem, child: DndItem): boolean {
    let tmp = child;
    while (tmp) {
      if (tmp == parent) {
        return true;
      }
      tmp = this.getParent(tmp);
    }
    return false;
  }

  calcPermissionLevelsBetweenContainers(before: DndItem, after: DndItem): {minLvl: number, maxLvl: number} {
    const beforeLvl = this.getLevel(before);

    let {minLvl, maxLvl} = this.getPermissibleLevels(before, after);

    if (before == this.activeItem) {
      maxLvl = Math.min(maxLvl, beforeLvl);
    }

    if (this.checkIsParent(this.activeItem, before)) {
      const activeDragItemLvl = this.getLevel(this.activeItem);
      maxLvl = Math.min(maxLvl, activeDragItemLvl);
    }

    if (minLvl == -1 || maxLvl == -1 || maxLvl < minLvl) {
      return {minLvl: -1, maxLvl: -1};
    }

    return {maxLvl, minLvl};
  }

  getContainerResult(item: DndItem): DndContainerResult {
    if (item == null) return null;

    return {
      item,
      data: this.itemToData.get(item),
      lvl: this.getLevel(item),
      type: this.itemToType.get(item),
    };
  }

  getResult(): DndResult {
    if (!this.target || this.target.item == null) return null;

    return {
      draggableItem: this.getContainerResult(this.activeItem),
      position: this.target.position,
      level: this.target.level,
      target: this.getContainerResult(this.target.item),
      between: this.getBetweenResult(),
      nested: this.getNestedResult(),
    };
  }

  getBetweenResultItems(): {
    before: DndItem;
    after: DndItem;
  } {
    const position = this.target.position;
    const neighbors = this.getNeighbors(this.target.item);

    if (position == 'bottom') {
      return {
        before: this.target.item,
        after: neighbors.after,
      }
    }

    if (position == 'top') {
      return {
        before: neighbors.before,
        after: this.target.item,
      }
    }
    return {
      before: null,
      after: null,
    };
  }


  getBetweenResult(): {
    before: DndContainerResult;
    after: DndContainerResult;
  } {
    const position = this.target.position;
    const neighbors = this.getNeighbors(this.target.item);

    const {before, after} = this.getBetweenResultItems();

    if (before == null && after == null) return null;

    return {
      before: this.getContainerResult(before),
      after: this.getContainerResult(after),
    }
  }

  getNestedResult(): {
    parent: DndContainerResult;
    before: DndContainerResult;
    after: DndContainerResult;
  } {
    const result = {
      parent: null,
      before: null,
      after: null,
    };

    const {before, after} = this.getBetweenResultItems();

    if (before == null && after == null) return null;

    const lvl = this.target.level;
    const position = this.target.position;

    if (this.getLevel(after) == lvl) {
      result.after = this.getContainerResult(after);
    }

    if (this.getLevel(before) == lvl - 1) {
      result.parent = this.getContainerResult(before);
    } else {

      let linkItem = before;

      while (linkItem) {
        const lvlLinkItem = this.getLevel(linkItem);
        if (lvlLinkItem == lvl) {
          result.before = this.getContainerResult(linkItem);
        }
        if (lvlLinkItem == lvl - 1) {
          result.parent = this.getContainerResult(linkItem);
        }

        if (lvlLinkItem <= lvl - 2) break;

        linkItem = this.getParent(linkItem);
      }
    }

    return result;
  }
}
