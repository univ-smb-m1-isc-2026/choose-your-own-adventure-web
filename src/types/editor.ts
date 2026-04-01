export type EditorChapterType = 'start' | 'normal' | 'combat' | 'ending';

export interface EditorNodeData {
  label: string;
  content: string;
  type: EditorChapterType;
  isEnding: boolean;
  imageUrl?: string;
  allowBacktrack?: boolean;
}
