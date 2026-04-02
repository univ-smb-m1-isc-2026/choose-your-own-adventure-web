import { useState } from 'react';
import { AlertTriangle, Lock, Heart } from 'lucide-react';

interface Choice {
  id: string;
  label: string;
  requiresConfirmation: boolean;
  isAvailable: boolean;
  healthDelta: number | null;
}

interface ChoiceListProps {
  choices: Choice[];
  onChoose: (choiceId: string) => void;
  loading: boolean;
}

export default function ChoiceList({ choices, onChoose, loading }: ChoiceListProps) {
  const [confirming, setConfirming] = useState<string | null>(null);

  const handleClick = (choice: Choice) => {
    if (!choice.isAvailable || loading) return;
    if (choice.requiresConfirmation && confirming !== choice.id) {
      setConfirming(choice.id);
      return;
    }
    setConfirming(null);
    onChoose(choice.id);
  };

  if (choices.length === 0) return null;

  return (
    <div className="choice-list">
      <h3 className="choice-heading">Que faites-vous ?</h3>
      <div className="choices-container">
        {choices.map((choice) => (
          <button
            key={choice.id}
            className={`choice-btn ${!choice.isAvailable ? 'choice-locked' : ''} ${confirming === choice.id ? 'choice-confirming' : ''}`}
            onClick={() => handleClick(choice)}
            disabled={!choice.isAvailable || loading}
          >
            {!choice.isAvailable && <Lock size={14} className="choice-icon" />}
            {confirming === choice.id && <AlertTriangle size={14} className="choice-icon warning" />}
            <span>{confirming === choice.id ? `Confirmer : ${choice.label}` : choice.label}</span>
            {choice.healthDelta != null && choice.healthDelta !== 0 && (
              <span className={`choice-health-delta ${choice.healthDelta > 0 ? 'choice-heal' : 'choice-damage'}`}>
                <Heart size={12} />
                {choice.healthDelta > 0 ? '+' : ''}{choice.healthDelta}
              </span>
            )}
            {choice.isAvailable && <span className="choice-arrow">→</span>}
          </button>
        ))}
      </div>
      {confirming && (
        <button className="cancel-confirm" onClick={() => setConfirming(null)}>
          Annuler
        </button>
      )}
    </div>
  );
}
