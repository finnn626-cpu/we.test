export interface User {
  id: string;
  nickname: string;
  avatar?: string; // Base64 string
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string; // Base64 string
  content: string;
  imageUrl?: string;
  timestamp: number;
  type: 'text' | 'image_text' | 'system' | 'sticker';
}

export interface Space {
  id: string;
  name: string;
  password: string; // In a real app, this should be hashed
  created: number;
}

export interface SpaceData extends Space {
  messages: Message[];
}

export enum AppView {
  LANDING = 'LANDING',
  SPACE = 'SPACE',
}

export interface AIResponse {
  text: string;
  mood?: string;
}
