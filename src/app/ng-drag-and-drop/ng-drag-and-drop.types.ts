export type DragIndicatorPosition = 'top' | 'right' | 'bottom' | 'left' | 'inside';

export interface DragItemConfigInContainer {
  verticalSideIndent?: number; // если нужно перетаскивание в право/лево этот параметр отвечает за расстояние до границы чтобы стриггерить индикатор
  positions: Array<DragIndicatorPosition>;
  canNested?: boolean;
}

export interface DragItemConfig {
  offsetOneLvlPx: number;
  containers: {[key: string] : DragItemConfigInContainer}
}

export interface DndContainerResult {
  item: DndItem;
  data: any;
  lvl: number;
  type: string;
}

export interface DndResult {
  draggableItem: DndContainerResult;

  position: DragIndicatorPosition;
  level: number;
  target: DndContainerResult;

  between: {
    before: DndContainerResult;
    after: DndContainerResult;
  }

  nested: {
    parent: DndContainerResult;
    before: DndContainerResult;
    after: DndContainerResult;
  }
}

export type DndItem = any;
