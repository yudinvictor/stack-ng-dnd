import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TstContainerComponent } from './tst-container/tst-container.component';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NgDragAndDropModule} from "./ng-drag-and-drop/ng-drag-and-drop.module";
import { TaskComponent } from './task/task.component';
import { ExampleItemComponent } from './example-item/example-item.component';

@NgModule({
  declarations: [
    AppComponent,
    TstContainerComponent,
    TaskComponent,
    ExampleItemComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ScrollingModule,
        DragDropModule,
        NgDragAndDropModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
