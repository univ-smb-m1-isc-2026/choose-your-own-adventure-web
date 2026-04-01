import { useState, useEffect } from 'react';
import { adventureService, type AdventureSummary, type AdventureCatalogueParams } from '../services/adventureService';
import AdventureCard from '../components/AdventureCard';
import SearchFilters from '../components/SearchFilters';
import { Compass, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [adventures, setAdventures] = useState<AdventureSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdventures = async (params?: AdventureCatalogueParams) => {
    setLoading(true);
    try {
      const data = await adventureService.getCatalogue(params);
      setAdventures(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdventures(); }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">
            <Compass size={48} />
          </div>
          <h1 className="hero-title">
            Explorez des aventures <span className="text-gradient">interactives</span>
          </h1>
          <p className="hero-subtitle">
            Plongez dans des histoires à embranchements. Chaque choix compte, chaque chemin est unique.
          </p>
        </div>
        <div className="hero-sparkle">
          <Sparkles size={20} />
        </div>
      </section>

      <section className="catalogue-section">
        <SearchFilters onSearch={fetchAdventures} />

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : adventures.length === 0 ? (
          <div className="empty-state">
            <Compass size={48} className="empty-icon" />
            <h3>Aucune aventure trouvée</h3>
            <p>Essayez d'autres filtres ou revenez plus tard !</p>
          </div>
        ) : (
          <div className="adventures-grid">
            {adventures.map((a) => (
              <AdventureCard key={a.id} adventure={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
