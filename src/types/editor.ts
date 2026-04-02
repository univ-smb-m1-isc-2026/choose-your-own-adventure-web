export type EditorChapterType = 'start' | 'normal' | 'combat' | 'ending';

export interface EditorNodeData {
  label: string;
  content: string;
  type: EditorChapterType;
  isEnding: boolean;
  imageUrl?: string;
  allowBacktrack?: boolean;
  combatEnemyName?: string;
  combatEnemyHealth?: number;
}

export interface EditorEdgeData {
  label: string;
  healthDelta?: number;
  requiresConfirmation?: boolean;
}
