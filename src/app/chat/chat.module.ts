import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ChatComponent } from './components/chat/chat.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ChatComponent,
    RoomListComponent
  ]
})
export class ChatModule { }