import { create } from 'zustand';
import type { ChatMessage, FileAttachment } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isXAIMode: boolean;
  language: 'en' | 'kn';
  isVoiceActive: boolean;
  isRecording: boolean;
  pendingAttachments: FileAttachment[];
  isTyping: boolean;
  isSidekickOpen: boolean;

  // Actions
  addMessage: (message: ChatMessage) => void;
  toggleXAIMode: () => void;
  setLanguage: (lang: 'en' | 'kn') => void;
  setVoiceActive: (active: boolean) => void;
  setRecording: (recording: boolean) => void;
  addAttachment: (attachment: FileAttachment) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;
  setTyping: (typing: boolean) => void;
  toggleSidekick: () => void;
  setSidekickOpen: (open: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isXAIMode: false,
  language: 'en',
  isVoiceActive: false,
  isRecording: false,
  pendingAttachments: [],
  isTyping: false,
  isSidekickOpen: true,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  toggleXAIMode: () =>
    set((state) => ({ isXAIMode: !state.isXAIMode })),

  setLanguage: (language) => set({ language }),

  setVoiceActive: (isVoiceActive) => set({ isVoiceActive }),

  setRecording: (isRecording) => set({ isRecording }),

  addAttachment: (attachment) =>
    set((state) => ({
      pendingAttachments: [...state.pendingAttachments, attachment],
    })),

  removeAttachment: (id) =>
    set((state) => ({
      pendingAttachments: state.pendingAttachments.filter((a) => a.id !== id),
    })),

  clearAttachments: () => set({ pendingAttachments: [] }),

  setTyping: (isTyping) => set({ isTyping }),

  toggleSidekick: () =>
    set((state) => ({ isSidekickOpen: !state.isSidekickOpen })),

  setSidekickOpen: (isSidekickOpen) => set({ isSidekickOpen }),
}));
