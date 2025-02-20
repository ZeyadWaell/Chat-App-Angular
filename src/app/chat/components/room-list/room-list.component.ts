import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ChatService, ChatRoom } from '../../../shared/services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class RoomListComponent implements OnInit, OnDestroy {
  rooms: ChatRoom[] = [];
  newRoomName: string = '';
  selectedRoomId: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.chatService.getRooms().subscribe(rooms => {
        this.rooms = rooms;
      })
    );

    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.selectedRoomId = params['roomId'] || null;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  selectRoom(roomId: string) {
    this.selectedRoomId = roomId;
    this.router.navigate(['/chat', roomId]);
  }

  getLastMessage(room: ChatRoom): string {
    return room.lastMessage?.content || 'No messages yet';
  }

  getLastMessageTime(room: ChatRoom): string {
    if (!room.lastMessage?.timestamp) return '';
    return new Date(room.lastMessage.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
