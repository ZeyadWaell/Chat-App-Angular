import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  { path: '', component: MessagesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MessagesComponent
  ]
})
export class MessagesModule { }
