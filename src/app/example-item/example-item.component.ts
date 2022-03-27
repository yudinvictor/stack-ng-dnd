import {Component, Input, OnInit} from '@angular/core';
import {Item} from "../tst-container/tst-container.component";

@Component({
  selector: 'app-example-item',
  templateUrl: './example-item.component.html',
  styleUrls: ['./example-item.component.scss']
})
export class ExampleItemComponent implements OnInit {
  @Input() item: Item;

  constructor() { }

  ngOnInit(): void {
  }

}
