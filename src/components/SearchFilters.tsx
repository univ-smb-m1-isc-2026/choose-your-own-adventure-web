import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import type { AdventureCatalogueParams } from '../services/adventureService';

interface SearchFiltersProps {
  onSearch: (params: AdventureCatalogueParams) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const apply = () => {
    onSearch({
      search: search || undefined,
      difficulty: difficulty || undefined,
      language: language || undefined,
      sort,
    });
  };

  const clear = () => {
    setSearch(''); setDifficulty(''); setLanguage(''); setSort('newest');
    onSearch({});
  };

  return (
    <div className="search-filters">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher une aventure..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
          className="search-input"
        />
        <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle">
          <Filter size={16} />
          Filtres
        </button>
        <button onClick={apply} className="btn btn-primary btn-sm">Rechercher</button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Difficulté</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="filter-select">
              <option value="">Toutes</option>
              <option value="EASY">Facile</option>
              <option value="MEDIUM">Moyen</option>
              <option value="HARD">Difficile</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Langue</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="filter-select">
              <option value="">Toutes</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Trier par</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="filter-select">
              <option value="newest">Plus récent</option>
              <option value="popular">Plus populaire</option>
            </select>
          </div>
          <button onClick={clear} className="btn btn-ghost btn-sm">
            <X size={14} /> Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
}
