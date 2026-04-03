import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adventureService, type AdventureDetail } from '../services/adventureService';
import { useAuthStore } from '../store/authStore';
import { favoriteService } from '../services/favoriteService';
import {
  BookOpen, Clock, BarChart3, Users, Heart, Play,
  Tag, Globe, Shield, ArrowLeft, Star, Edit3
} from 'lucide-react';

const diffLabels: Record<string, string> = { EASY: 'Facile', MEDIUM: 'Moyen', HARD: 'Difficile' };

export default function AdventureDetailPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div className="page-loading">Aventure non trouvée</div>;
  }

  return <AdventureDetailContent key={id} id={id} />;
}

function AdventureDetailContent({ id }: { id: string }) {
  const [adventure, setAdventure] = useState<AdventureDetail | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading');
  const [fav, setFav] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    void adventureService.getById(id)
      .then((data) => {
        if (!active) {
          return;
        }
        setAdventure(data);
        setFav(data.isFavorited);
        setStatus('ready');
      })
      .catch(() => {
        if (active) {
          setStatus('missing');
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handlePlay = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate(`/play/${id}`);
  };

  const toggleFav = async () => {
    if (!id || !isAuthenticated) return;
    const result = await favoriteService.toggle(id);
    setFav(result);
  };

  if (status === 'loading') return <div className="page-loading"><div className="spinner" /></div>;
  if (status === 'missing' || !adventure) return <div className="page-loading">Aventure non trouvée</div>;

  return (
    <div className="detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={18} /> Retour
      </button>

      {adventure.imageUrl && (
        <img src={adventure.imageUrl} alt="" className="detail-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
      )}

      <div className="detail-header">
        <div className="detail-info">
          <div className="detail-tags">
            {adventure.tags?.map((t, i) => (
              <span key={i} className="tag"><Tag size={11} /> {t}</span>
            ))}
          </div>
          <h1 className="detail-title">{adventure.title}</h1>
          <p className="detail-author">
            <Users size={15} /> par <strong>{adventure.authorUsername}</strong>
          </p>
          <p className="detail-summary">{adventure.summary}</p>

          <div className="detail-meta-grid">
            <div className="meta-card">
              <Shield size={18} />
              <span>{diffLabels[adventure.difficulty] || adventure.difficulty}</span>
            </div>
            <div className="meta-card">
              <BookOpen size={18} />
              <span>{adventure.chapterCount} chapitres</span>
            </div>
            {adventure.estimatedDurationMinutes && (
              <div className="meta-card">
                <Clock size={18} />
                <span>~{adventure.estimatedDurationMinutes} min</span>
              </div>
            )}
            <div className="meta-card">
              <Globe size={18} />
              <span>{adventure.language === 'fr' ? 'Français' : adventure.language === 'en' ? 'English' : adventure.language}</span>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <button onClick={handlePlay} className="btn btn-primary btn-lg play-btn">
            <Play size={20} />
            Jouer maintenant
          </button>
          {isAuthenticated && (
            <button onClick={toggleFav} className={`btn btn-outline btn-lg ${fav ? 'btn-fav-active' : ''}`}>
              <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
              {fav ? 'Favori' : 'Ajouter aux favoris'}
            </button>
          )}
          {isAuthenticated && adventure.authorUsername === user?.username && (
            <button onClick={() => navigate(`/editor/${id}`)} className="btn btn-outline btn-lg">
              <Edit3 size={18} />
              Éditer l'aventure
            </button>
          )}
        </div>
      </div>

      {adventure.stats && (
        <div className="stats-cards">
          <div className="stat-card">
            <BarChart3 size={20} />
            <div className="stat-number">{adventure.stats.totalReads}</div>
            <div className="stat-label">Lectures</div>
          </div>
          <div className="stat-card">
            <Star size={20} />
            <div className="stat-number">{adventure.stats.totalCompletions}</div>
            <div className="stat-label">Complétées</div>
          </div>
          <div className="stat-card">
            <Heart size={20} />
            <div className="stat-number">{adventure.stats.favoriteCount}</div>
            <div className="stat-label">Favoris</div>
          </div>
        </div>
      )}
    </div>
  );
}
