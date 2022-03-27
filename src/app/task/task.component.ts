import {Component, Input, OnInit} from '@angular/core';
import {Item} from "../tst-container/tst-container.component";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() task: Item;

  constructor() { }

  ngOnInit(): void {
  }

}
