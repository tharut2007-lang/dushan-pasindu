export enum View {
  ImageGen = 'ImageGen',
  VideoGen = 'VideoGen',
  ImageAnimate = 'ImageAnimate',
  ImageEdit = 'ImageEdit',
  VideoAnalyze = 'VideoAnalyze',
}

export interface Feature {
    id: View;
    title: string;
    icon: string;
    description?: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Fix for line 23: Made `aistudio` optional to resolve a declaration merging conflict.
    aistudio?: AIStudio;
  }
}
