import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {max, min} from "rxjs";
import {
  DndResult, DndResultDataNeighbors,
  DragIndicatorPosition,
  DragItemConfig,
  DragItemConfigInContainer
} from "./ng-drag-and-drop.types";


@Injectable({
  providedIn: 'root'
})
export class NgDragAndDropService {
  itemToType: Map<any, string> = new Map<any, string>();
  itemToData: Map<any, any> = new Map<any, any>();

  idToElement: Map<string, HTMLElement> = new Map<string, HTMLElement>();
  elementToId: WeakMap<HTMLElement, string> = new WeakMap<HTMLElement, string>();

  idToLvl: Map<string, number> = new Map<string, number>();
  idToData: Map<string, any> = new Map<string, any>();
  idToContainerName: Map<string, string> = new Map<string, string>();

  currentConfig: DragItemConfig;

  shiftLvlPx: number = 12;

  startLvl = 0;

  activeDragItemId: string;

  CURSOR_CLIENT_START_POSITION = {
    x: 0,
    y: 0,
  }

  targetContainerId: string = null;
  targetPosition: DragIndicatorPosition = null;
  targetLvl: number = 0;

  getNeighbors: (targetId: string) => {beforeId: string, afterId: string};

  private render2: Renderer2;
  constructor(rendererFactory: RendererFactory2) {
    this.render2 = rendererFactory.createRenderer(null, null);
  }

  getItemConfig(item: any): DragItemConfigInContainer {
    const type = this.itemToType.get(item);
    return this.currentConfig.containers[type] ?? null;
  }

  getConfigByContainer(nameContainer: string): DragItemConfigInContainer {
    if (this.currentConfig.containers[nameContainer]) {
      return this.currentConfig.containers[nameContainer];
    }
    return null;
  }

  checkCanDropInContainer(containerName: string): boolean {
    return !!(this.currentConfig.containers[containerName] && this.currentConfig.containers[containerName]?.positions?.length);
  }

  startDnd(itemId: string, config: DragItemConfig, event: DragEvent): void {
    // reset previously result
    this.targetContainerId = null;

    this.activeDragItemId = itemId;
    this.currentConfig = config;

    this.CURSOR_CLIENT_START_POSITION.x = event.clientX;
    this.CURSOR_CLIENT_START_POSITION.y = event.clientY;
  }

  getCurrentLvl(clientX: number, clientY: number): number {
    const step = 24;

    if (clientX < this.CURSOR_CLIENT_START_POSITION.x) {
      const len = this.CURSOR_CLIENT_START_POSITION.x - clientX;
      return this.startLvl - (len / step>>0);
    } else {
      const len = clientX - this.CURSOR_CLIENT_START_POSITION.x;
      const shift = (len / step>>0);
      // console.log('getCurrentLvl', shift, this.startLvl, this.startLvl + shift);
      return this.startLvl + shift;
    }
  }

  getPermissibleLevels(beforeId, afterId): {minLvl: number, maxLvl: number} {
    const beforeLvl = beforeId ? this.idToLvl.get(beforeId) : null;
    const afterLvl = afterId ? this.idToLvl.get(afterId) : null;

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

  /***************/




  /***************/




  getResult(): DndResult {
    if (this.targetContainerId == null) {
      return null;
    }
    const result: DndResult = {
      position: this.targetPosition,
      lvl: this.targetLvl,
      target: {
        id: this.targetContainerId,
        data: this.idToData.get(this.targetContainerId),
        HTMLElement: this.idToElement.get(this.targetContainerId),
        lvl: this.idToLvl.get(this.targetContainerId),
        containerName: this.idToContainerName.get(this.targetContainerId),
      },
      before: null,
      after: null,
    };

    const {beforeId, afterId} = this.getNeighbors(this.targetContainerId);

    if (beforeId) {
      result.before = {
        id: beforeId,
        data: this.idToData.get(beforeId),
        HTMLElement: this.idToElement.get(beforeId),
        lvl: this.idToLvl.get(beforeId),
        containerName: this.idToContainerName.get(beforeId),
      }
    }

    if (afterId) {
      result.after = {
        id: afterId,
        data: this.idToData.get(afterId),
        HTMLElement: this.idToElement.get(afterId),
        lvl: this.idToLvl.get(afterId),
        containerName: this.idToContainerName.get(afterId),
      }
    }

    return result;
  }
}
