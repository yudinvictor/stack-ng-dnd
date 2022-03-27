import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {DndResult, DragIndicatorPosition, DragItemConfig} from "../ng-drag-and-drop/ng-drag-and-drop.types";
import {BehaviorSubject, Observable} from "rxjs";

export interface Item {
  id: string;
  type: 'Channel' | 'Folder';
  index: number;
  lvl: number;
  parent_id: string;
}

@Component({
  selector: 'app-tst-container',
  templateUrl: './tst-container.component.html',
  styleUrls: ['./tst-container.component.scss']
})
export class TstContainerComponent implements OnInit {

  items: Array<Item> = [
    {
      id: 'Folder 1',
      type: 'Folder',
      index: 1,
      lvl: 0,
      parent_id: null,
    },
    {
      id: 'Folder 2',
      type: 'Folder',
      index: 2,
      lvl: 0,
      parent_id: null,
    },
    {
      id: 'Folder 3',
      type: 'Folder',
      index: 3,
      lvl: 0,
      parent_id: 'Folder 1',
    },
    {
      id: 'Channel 1',
      type: 'Channel',
      index: 4,
      lvl: 0,
      parent_id: 'Folder 2',
    },
    {
      id: 'Channel 2',
      type: 'Channel',
      index: 5,
      lvl: 0,
      parent_id: 'Folder 3',
    },
    {
      id: 'Channel 3',
      type: 'Channel',
      index: 6,
      lvl: 0,
      parent_id: 'Folder 3',
    },
    {
      id: 'Channel 4',
      type: 'Channel',
      index: 7,
      lvl: 0,
      parent_id: 'Folder 1',
    },
  ];

  getParent = (item: any): any => {
    if (!item) return null

    const idx = this.items.findIndex(e => e.id == item.parent_id);
    if (idx == -1) {
      return null;
    }
    return this.items[idx];
  }

  getNeighbors = (target: any): {before: any, after: any} => {
    const neighbors  = {
      before: null,
      after: null,
    };

    const idx = this.items.findIndex(e => e.id == target.id);
    if (idx != -1) {
      neighbors.before = idx > 0 ? this.items[idx - 1] : null;
      neighbors.after = idx < this.items.length - 1 ? this.items[idx + 1] : null;
    }

    return neighbors;
  }

  // dfs()

  buildLvl(items: Array<Item>, g: Map<string, Array<Item>>, res: Array<Item>, lvl: number) : void {
    console.log('buildLvl', items, g, res, lvl);
    items.sort((a, b) => a.index - b.index);

    for (let item of items) {
      item.lvl = lvl;
      res.push(item);

      if (g[item.id] && g[item.id].length) {
        this.buildLvl(g[item.id], g, res, lvl + 1)
      }
    }
  }

  nestedStructureStraightening(items: Array<Item>) : Array<Item> {
    const g = new Map<string, Array<Item>>()
    const roots = [];

    for (let item of items) {
      if (item.parent_id) {
        const v = item.parent_id;
        if (!g[v]) {
          g[v] = [];
        }
        g[v].push(item);
      } else {
        roots.push(item);
      }
    }

    let result: Array<Item> = [];
    this.buildLvl(roots, g, result, 0);
    return result;
  }

  dndConfig: DragItemConfig = {
    offsetOneLvlPx: 8,
    containers: {
      Folder: {
        positions: ['bottom', 'top'],
      },
      Channel: {
        positions: ['bottom', 'top'],
      }
    }
  }


  drop(item: Item, data: DndResult): void {
    console.log(data);
  }

  constructor() { }

  ngOnInit(): void {
    this.items = this.nestedStructureStraightening(this.items);
  }

}
