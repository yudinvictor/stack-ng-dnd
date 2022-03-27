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

export interface DndResultDataNeighbors {
  id: any;
  data: any;
  HTMLElement: HTMLElement;
  lvl: number;
  containerName: string;
}

export interface DndResult {
  position: DragIndicatorPosition;
  lvl?: number;
  before: DndResultDataNeighbors;
  target: DndResultDataNeighbors;
  after: DndResultDataNeighbors;
}

export type DndItem = any;
