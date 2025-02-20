import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ChatService, ChatMessage } from '../../../shared/services/chat.service';
import { RoomListComponent } from '../room-list/room-list.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RoomListComponent
  ]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentRoomId: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        if (params['roomId']) {
          this.currentRoomId = params['roomId'];
        }
      })
    );

    this.subscriptions.push(
      this.chatService.getMessages().subscribe(messages => {
        this.messages = messages;
        this.scrollToBottom();
      })
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.currentRoomId) {
      this.chatService.leaveRoom(this.currentRoomId);
    }
  }

  private async joinRoom(roomId: string) {
    try {
      await this.chatService.joinRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
      this.router.navigate(['/chat']);
    }
  }

  async sendMessage() {
    if (this.newMessage.trim() && this.currentRoomId) {
      try {
        await this.chatService.sendMessage(this.currentRoomId, this.newMessage);
        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  onRoomSelect(roomId: string) {
    this.router.navigate(['/chat', roomId]);
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  isCurrentUser(senderId: string): boolean {
    return this.chatService.isCurrentUser(senderId);
  }

  getMessageTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getMessageDate(timestamp: Date): string {
    return new Date(timestamp).toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
