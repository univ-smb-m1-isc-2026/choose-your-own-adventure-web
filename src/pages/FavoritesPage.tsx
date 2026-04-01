import { useState, useEffect } from 'react';
import type { AdventureSummary } from '../services/adventureService';
import { favoriteService } from '../services/favoriteService';
import AdventureCard from '../components/AdventureCard';
import { Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<AdventureSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    favoriteService.getMyFavorites()
      .then((data: AdventureSummary[]) => setFavorites(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><Loader2 size={32} className="spinner-icon" /></div>;

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1><Heart size={28} /> Mes favoris</h1>
        <p className="subtitle">{favorites.length} aventure{favorites.length !== 1 ? 's' : ''}</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <Heart size={56} className="empty-icon" />
          <h3>Aucun favori</h3>
          <p>Ajoutez des aventures à vos favoris pour les retrouver facilement !</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Explorer les aventures</button>
        </div>
      ) : (
        <div className="adventures-grid">
          {favorites.map((a) => (
            <AdventureCard key={a.id} adventure={a} />
          ))}
        </div>
      )}
    </div>
  );
}
