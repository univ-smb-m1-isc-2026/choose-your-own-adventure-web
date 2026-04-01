import { Clock, RotateCcw } from 'lucide-react';

interface HistoryEntry {
  stepOrder: number;
  chapterId: string;
  chapterTitle: string;
  choiceId: string;
  choiceLabel: string;
  decidedAt: string;
}

interface HistoryTimelineProps {
  history: HistoryEntry[];
  currentStep: number;
  allowBacktrack: boolean;
  onBacktrack: (step: number) => void;
}

export default function HistoryTimeline({ history, currentStep, allowBacktrack, onBacktrack }: HistoryTimelineProps) {
  if (history.length === 0) return null;

  return (
    <div className="history-panel">
      <h3 className="panel-title">
        <Clock size={16} /> Historique
      </h3>
      <div className="timeline">
        {history.map((entry, i) => (
          <div
            key={i}
            className={`timeline-entry ${entry.stepOrder === currentStep ? 'timeline-current' : ''}`}
          >
            <div className="timeline-dot" />
            <div className="timeline-content">
              <span className="timeline-chapter">{entry.chapterTitle}</span>
              {entry.choiceLabel && (
                <span className="timeline-choice">→ {entry.choiceLabel}</span>
              )}
              {allowBacktrack && entry.stepOrder < currentStep && (
                <button
                  className="backtrack-btn"
                  onClick={() => onBacktrack(entry.stepOrder)}
                  title="Revenir à ce point"
                >
                  <RotateCcw size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
