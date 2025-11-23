import { Space, Message, SpaceData } from '../types';

const SPACE_PREFIX = 'loveroom_data_';

export const StorageService = {
  createSpace: (name: string, password: string): Space => {
    const id = Math.random().toString(36).substr(2, 9);
    const newSpace: SpaceData = {
      id,
      name,
      password,
      created: Date.now(),
      messages: [
        {
          id: 'init',
          senderId: 'system',
          senderName: '系统',
          content: `欢迎来到属于你们的"${name}"空间！开始分享你们的日常吧。`,
          timestamp: Date.now(),
          type: 'system'
        }
      ]
    };
    localStorage.setItem(`${SPACE_PREFIX}${id}`, JSON.stringify(newSpace));
    return { id, name, password, created: newSpace.created };
  },

  getSpace: (id: string): SpaceData | null => {
    const data = localStorage.getItem(`${SPACE_PREFIX}${id}`);
    return data ? JSON.parse(data) : null;
  },

  validateSpace: (id: string, password: string): boolean => {
    const space = StorageService.getSpace(id);
    return space !== null && space.password === password;
  },

  addMessage: (spaceId: string, message: Message): Message[] => {
    const space = StorageService.getSpace(spaceId);
    if (space) {
      space.messages.push(message);
      localStorage.setItem(`${SPACE_PREFIX}${spaceId}`, JSON.stringify(space));
      return space.messages;
    }
    return [];
  },

  getMessages: (spaceId: string): Message[] => {
    const space = StorageService.getSpace(spaceId);
    return space ? space.messages : [];
  }
};