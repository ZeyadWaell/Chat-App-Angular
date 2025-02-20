import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  roomId: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  unreadCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: HubConnection;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private roomsSubject = new BehaviorSubject<ChatRoom[]>([]);
  private currentUserId: string = 'temp-user-id';

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/chatHub')
      .withAutomaticReconnect()
      .build();

    this.startConnection();
    this.registerHandlers();
  }

  private async startConnection() {
    try {
      await this.hubConnection.start();
      console.log('Connected to SignalR Hub');
    } catch (error) {
      console.error('Error connecting to SignalR Hub:', error);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  private registerHandlers() {
    this.hubConnection.on('ReceiveMessage', (message: ChatMessage) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
    });

    this.hubConnection.on('RoomUpdated', (room: ChatRoom) => {
      const currentRooms = this.roomsSubject.value;
      const index = currentRooms.findIndex(r => r.id === room.id);
      if (index !== -1) {
        currentRooms[index] = room;
        this.roomsSubject.next([...currentRooms]);
      }
    });
  }

  getRooms(): Observable<ChatRoom[]> {
    return this.roomsSubject.asObservable();
  }

  async createRoom(name: string): Promise<string> {
    try {
      const roomId = await this.hubConnection.invoke<string>('CreateRoom', name);
      return roomId;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async joinRoom(roomId: string): Promise<void> {
    try {
      await this.hubConnection.invoke('JoinRoom', roomId);
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  async leaveRoom(roomId: string): Promise<void> {
    try {
      await this.hubConnection.invoke('LeaveRoom', roomId);
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  async sendMessage(roomId: string, content: string): Promise<void> {
    try {
      await this.hubConnection.invoke('SendMessage', {
        roomId,
        content,
        senderId: this.currentUserId,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  isCurrentUser(senderId: string): boolean {
    return senderId === this.currentUserId;
  }

  markRoomAsRead(roomId: string): void {
    const currentRooms = this.roomsSubject.value;
    const roomIndex = currentRooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      currentRooms[roomIndex] = {
        ...currentRooms[roomIndex],
        unreadCount: 0
      };
      this.roomsSubject.next([...currentRooms]);
    }
  }
}
