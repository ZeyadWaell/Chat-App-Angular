import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { RoomListComponent } from './components/room-list/room-list.component';

const routes: Routes = [
  { 
    path: '', 
    component: ChatComponent,
    children: [
      { path: '', component: RoomListComponent },
      { path: ':roomId', component: ChatComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }