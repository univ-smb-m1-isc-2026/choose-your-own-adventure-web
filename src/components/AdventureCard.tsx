import { Heart, BookOpen, Star, Users, Edit3 } from 'lucide-react';
import type { AdventureSummary } from '../services/adventureService';
import { favoriteService } from '../services/favoriteService';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const difficultyConfig: Record<string, { label: string; class: string }> = {
  EASY: { label: 'Facile', class: 'badge-easy' },
  MEDIUM: { label: 'Moyen', class: 'badge-medium' },
  HARD: { label: 'Difficile', class: 'badge-hard' },
};

export default function AdventureCard({ adventure }: { adventure: AdventureSummary }) {
  const { user, isAuthenticated } = useAuthStore();
  const [fav, setFav] = useState(adventure.isFavorited);
  const navigate = useNavigate();

  const diff = difficultyConfig[adventure.difficulty] || { label: adventure.difficulty, class: '' };

  const toggleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    const result = await favoriteService.toggle(adventure.id);
    setFav(result);
  };

  return (
    <div className="adventure-card" onClick={() => navigate(`/adventure/${adventure.id}`)}>
      {adventure.imageUrl && (
        <img src={adventure.imageUrl} alt="" className="adventure-card-image" onError={(e) => (e.currentTarget.style.display = 'none')} />
      )}
      <div className="adventure-card-header">
        <div className="adventure-card-tags">
          {adventure.tags?.slice(0, 3).map((t, i) => (
            <span key={i} className="tag">{t}</span>
          ))}
        </div>
        {isAuthenticated && (
          <div className="adventure-card-actions">
            {adventure.authorUsername === user?.username && (
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/editor/${adventure.id}`);
                }}
                title="Éditer"
              >
                <Edit3 size={16} />
              </button>
            )}
            <button
              className={`fav-btn ${fav ? 'fav-active' : ''}`}
              onClick={toggleFav}
              title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>
        )}
      </div>

      <h3 className="adventure-card-title">{adventure.title}</h3>

      <p className="adventure-card-summary">
        {adventure.summary?.substring(0, 120)}{adventure.summary && adventure.summary.length > 120 ? '…' : ''}
      </p>

      <div className="adventure-card-meta">
        <span className={`badge ${diff.class}`}>{diff.label}</span>
        <div className="meta-info">
          <span><Users size={13} /> {adventure.authorUsername}</span>
          <span><BookOpen size={13} /> {adventure.chapterCount} ch.</span>
          <span><Star size={13} /> {adventure.totalReads}</span>
        </div>
      </div>
    </div>
  );
}
