
import { Feature, View } from './types';

export const FEATURES: Feature[] = [
  { id: View.ImageGen, title: 'Generate Image', icon: 'image', description: 'Create stunning images from text descriptions using Sri Nova AI' },
  { id: View.VideoGen, title: 'Generate Video', icon: 'movie', description: 'Generate dynamic videos from prompts and descriptions' },
  { id: View.ImageAnimate, title: 'Animate Image', icon: 'video_spark', description: 'Bring static images to life with smooth animations' },
  { id: View.ImageEdit, title: 'Edit Image', icon: 'image_edit_auto', description: 'Edit and enhance your images with AI-powered tools' },
  { id: View.VideoAnalyze, title: 'Analyze Video', icon: 'video_library', description: 'Get detailed insights and analysis of your videos' },
];
