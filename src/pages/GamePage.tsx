import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import ChapterView from '../components/game/ChapterView';
import ChoiceList from '../components/game/ChoiceList';
import InventoryPanel from '../components/game/InventoryPanel';
import HistoryTimeline from '../components/game/HistoryTimeline';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function GamePage() {
  const { adventureId } = useParams<{ adventureId: string }>();
  const navigate = useNavigate();
  const { gameState, loading, error, startOrResume, makeChoice, backtrack, clear } = useGameStore();

  useEffect(() => {
    if (adventureId) startOrResume(adventureId);
    return () => clear();
  }, [adventureId, clear, startOrResume]);

  if (loading && !gameState) {
    return (
      <div className="page-loading">
        <Loader2 size={32} className="spinner-icon" />
        <p>Chargement de l'aventure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-loading">
        <p className="error-text">{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">Retour</button>
      </div>
    );
  }

  if (!gameState) return null;

  const { currentChapter, availableChoices, health, maxHealth, stats, inventory, history, completed, allowBacktrack } = gameState;
  const currentStep = history.length > 0 ? history[history.length - 1].stepOrder : 0;

  const handleEndReturn = () => {
    clear();
    navigate('/');
  };

  return (
    <div className="game-page">
      <div className="game-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={18} /> Quitter
        </button>
        <h2 className="game-title">{gameState.adventureTitle}</h2>
        <div className="game-health-mini">
          ❤️ {health}/{maxHealth}
        </div>
      </div>

      <div className="game-layout">
        <div className="game-sidebar-left">
          <HistoryTimeline
            history={history}
            currentStep={currentStep}
            allowBacktrack={allowBacktrack}
            onBacktrack={backtrack}
          />
        </div>

        <div className="game-main">
          <ChapterView
            title={currentChapter.title}
            content={currentChapter.content}
            imageUrl={currentChapter.imageUrl}
            isEnding={currentChapter.isEnding}
            endingType={currentChapter.endingType}
          />

          {completed ? (
            <div className="ending-actions">
              <button onClick={handleEndReturn} className="btn btn-primary btn-lg">
                Retour au menu
              </button>
              {allowBacktrack && history.length > 1 && (
                <button onClick={() => backtrack(history.length - 2)} className="btn btn-outline btn-lg">
                  Revenir en arrière
                </button>
              )}
            </div>
          ) : (
            <ChoiceList
              choices={availableChoices}
              onChoose={makeChoice}
              loading={loading}
            />
          )}
        </div>

        <div className="game-sidebar-right">
          <InventoryPanel
            items={inventory}
            health={health}
            maxHealth={maxHealth}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
}
