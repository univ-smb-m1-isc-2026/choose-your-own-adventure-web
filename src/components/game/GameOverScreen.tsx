import { Trophy, Skull, BookOpen, RotateCcw, Home, Footprints, Heart, Package, Swords } from 'lucide-react';
import type { GameState } from '../../services/gameService';

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onHome: () => void;
  onBacktrack?: () => void;
}

export default function GameOverScreen({ gameState, onRestart, onHome, onBacktrack }: GameOverScreenProps) {
  const { endingType, health, maxHealth, stats, inventory, history, adventureTitle, currentChapter } = gameState;

  const isWin = endingType === 'WIN';
  const isLose = endingType === 'LOSE' || health <= 0;

  const icon = isWin ? <Trophy size={48} /> : isLose ? <Skull size={48} /> : <BookOpen size={48} />;
  const title = isWin ? 'Victoire !' : isLose ? 'Défaite...' : 'Fin de l\'aventure';
  const subtitle = isWin
    ? 'Vous avez triomphé de tous les obstacles !'
    : isLose
    ? 'Votre aventure s\'arrête ici...'
    : 'Vous avez atteint la fin de cette histoire.';

  const typeClass = isWin ? 'gameover-win' : isLose ? 'gameover-lose' : 'gameover-neutral';

  const stepsCount = history.length;
  const itemsCollected = inventory.filter(i => i.quantity > 0).length;
  const statEntries = Object.entries(stats).filter(([k]) => k !== 'health');

  return (
    <div className={`gameover-screen ${typeClass}`}>
      <div className="gameover-glow" />

      <div className="gameover-icon">{icon}</div>
      <h1 className="gameover-title">{title}</h1>
      <p className="gameover-subtitle">{subtitle}</p>

      {currentChapter.content && (
        <div className="gameover-epilogue">
          {currentChapter.content.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <div className="gameover-stats-grid">
        <div className="gameover-stat-card">
          <Footprints size={20} />
          <span className="gameover-stat-value">{stepsCount}</span>
          <span className="gameover-stat-label">Étapes</span>
        </div>
        <div className="gameover-stat-card">
          <Heart size={20} />
          <span className="gameover-stat-value">{health}/{maxHealth}</span>
          <span className="gameover-stat-label">Santé</span>
        </div>
        {itemsCollected > 0 && (
          <div className="gameover-stat-card">
            <Package size={20} />
            <span className="gameover-stat-value">{itemsCollected}</span>
            <span className="gameover-stat-label">Objets</span>
          </div>
        )}
        {statEntries.map(([key, value]) => (
          <div key={key} className="gameover-stat-card">
            <Swords size={20} />
            <span className="gameover-stat-value">{value}</span>
            <span className="gameover-stat-label">{key}</span>
          </div>
        ))}
      </div>

      {inventory.length > 0 && (
        <div className="gameover-inventory">
          <h3>Objets collectés</h3>
          <div className="gameover-items">
            {inventory.filter(i => i.quantity > 0).map(item => (
              <div key={item.itemId} className="gameover-item">
                <span>{item.name}</span>
                {item.quantity > 1 && <span className="gameover-item-qty">×{item.quantity}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="gameover-journey">
        <h3>Votre parcours</h3>
        <div className="gameover-journey-list">
          {history.map((h, i) => (
            <div key={i} className="gameover-journey-step">
              <div className="gameover-journey-dot" />
              <span>{h.chapterTitle}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="gameover-adventure-name">{adventureTitle}</div>

      <div className="gameover-actions">
        <button onClick={onRestart} className="btn btn-primary btn-lg gameover-btn">
          <RotateCcw size={18} /> Recommencer
        </button>
        {onBacktrack && gameState.allowBacktrack && history.length > 1 && (
          <button onClick={onBacktrack} className="btn btn-outline btn-lg gameover-btn">
            <RotateCcw size={18} /> Revenir en arrière
          </button>
        )}
        <button onClick={onHome} className="btn btn-ghost btn-lg gameover-btn">
          <Home size={18} /> Menu principal
        </button>
      </div>
    </div>
  );
}
