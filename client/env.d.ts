/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Global window extensions
declare global {
  interface Window {
    analytics: any;
    showDialog: (options: DialogOptions) => void;
  }
}

// Dialog types
interface DialogOptions {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export {};
