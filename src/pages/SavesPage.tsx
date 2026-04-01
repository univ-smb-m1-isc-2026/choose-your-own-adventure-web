import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService, type SaveGameSummary } from '../services/gameService';
import { Play, Clock, Heart, Loader2, Save, CheckCircle } from 'lucide-react';

export default function SavesPage() {
  const [saves, setSaves] = useState<SaveGameSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    gameService.getMySaves().then(setSaves).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><Loader2 size={32} className="spinner-icon" /></div>;

  return (
    <div className="saves-page">
      <div className="page-header">
        <h1><Save size={28} /> Mes sauvegardes</h1>
        <p className="subtitle">{saves.length} partie{saves.length !== 1 ? 's' : ''}</p>
      </div>

      {saves.length === 0 ? (
        <div className="empty-state">
          <Save size={56} className="empty-icon" />
          <h3>Aucune sauvegarde</h3>
          <p>Commencez une aventure pour sauvegarder votre progression !</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Explorer les aventures</button>
        </div>
      ) : (
        <div className="saves-list">
          {saves.map((save) => (
            <div
              key={save.id}
              className={`save-card ${save.completed ? 'save-completed' : ''}`}
              onClick={() => navigate(`/play/${save.adventureId}`)}
            >
              <div className="save-info">
                <h3>{save.adventureTitle}</h3>
                <div className="save-meta">
                  {save.completed ? (
                    <span className="save-badge-done"><CheckCircle size={14} /> Terminée</span>
                  ) : (
                    <span className="save-badge-progress">📖 {save.currentChapterTitle}</span>
                  )}
                  <span><Heart size={13} /> {save.health}/{save.maxHealth}</span>
                  <span><Clock size={13} /> {new Date(save.lastPlayed).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <button className="btn btn-primary btn-sm">
                <Play size={14} /> {save.completed ? 'Rejouer' : 'Reprendre'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
