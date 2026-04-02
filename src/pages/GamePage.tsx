import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import ChapterView from '../components/game/ChapterView';
import ChoiceList from '../components/game/ChoiceList';
import InventoryPanel from '../components/game/InventoryPanel';
import HistoryTimeline from '../components/game/HistoryTimeline';
import GameOverScreen from '../components/game/GameOverScreen';
import CombatView from '../components/game/CombatView';
import { ArrowLeft, Loader2, Heart } from 'lucide-react';

export default function GamePage() {
  const { adventureId } = useParams<{ adventureId: string }>();
  const navigate = useNavigate();
  const { 
    gameState, loading, error, 
    startOrResume, restart, makeChoice, 
    submitCombatResult, backtrack, clear,
    previousHealth
  } = useGameStore();

  useEffect(() => {
    if (adventureId) startOrResume(adventureId);
    return () => clear();
  }, [adventureId, clear, startOrResume]);

  const [healthImpact, setHealthImpact] = useState<'heal' | 'damage' | null>(null);

  useEffect(() => {
    if (gameState && previousHealth !== null && gameState.health !== previousHealth) {
      setHealthImpact(gameState.health > previousHealth ? 'heal' : 'damage');
      const timer = setTimeout(() => setHealthImpact(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState?.health, previousHealth]);

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


  return (
    <div className={`game-page ${healthImpact ? `impact-${healthImpact}` : ''}`}>
      <div className="game-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={18} /> Quitter
        </button>
        <h2 className="game-title">{gameState.adventureTitle}</h2>
        <div className={`game-health-mini ${healthImpact === 'damage' ? 'health-shake' : ''}`}>
          <Heart size={14} fill="currentColor" /> {health}/{maxHealth}
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
          {completed ? (
            <GameOverScreen
              gameState={gameState}
              onRestart={() => adventureId && restart(adventureId)}
              onHome={() => navigate('/dashboard')}
              onBacktrack={allowBacktrack ? () => backtrack(history.length - 2) : undefined}
            />
          ) : currentChapter.isCombat ? (
            <CombatView
              enemyName={currentChapter.combatEnemyName}
              enemyMaxHealth={currentChapter.combatEnemyHealth}
              playerHealth={health}
              playerMaxHealth={maxHealth}
              onCombatEnd={(newHealth, won) => {
                if (won) submitCombatResult(newHealth);
                else submitCombatResult(0);
              }}
            />
          ) : (
            <>
              <ChapterView
                title={currentChapter.title}
                content={currentChapter.content}
                imageUrl={currentChapter.imageUrl}
                isEnding={currentChapter.isEnding}
                endingType={currentChapter.endingType}
              />
              <ChoiceList
                choices={availableChoices}
                onChoose={makeChoice}
                loading={loading}
              />
            </>
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
      
      {healthImpact && (
        <div className={`health-flash ${healthImpact}`}>
          {healthImpact === 'heal' ? '+ HP' : '- HP'}
        </div>
      )}
    </div>
  );
}
