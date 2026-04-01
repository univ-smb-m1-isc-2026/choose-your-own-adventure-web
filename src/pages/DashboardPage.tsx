import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adventureService, type AdventureSummary } from '../services/adventureService';
import {
  Plus, Edit3, Trash2, Eye, BarChart3, BookOpen,
  FileText, Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const [adventures, setAdventures] = useState<AdventureSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMine = async () => {
    setLoading(true);
    try {
      const data = await adventureService.getMyAdventures();
      setAdventures(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMine(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette aventure ?')) return;
    try {
      await adventureService.delete(id);
      fetchMine();
    } catch (e) { console.error(e); }
  };

  const statusLabels: Record<string, { label: string; class: string }> = {
    DRAFT: { label: 'Brouillon', class: 'status-draft' },
    PUBLISHED: { label: 'Publiée', class: 'status-published' },
    ARCHIVED: { label: 'Archivée', class: 'status-archived' },
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Mes aventures</h1>
          <p className="subtitle">{adventures.length} aventure{adventures.length !== 1 ? 's' : ''} créée{adventures.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => navigate('/editor')} className="btn btn-primary">
          <Plus size={18} /> Nouvelle aventure
        </button>
      </div>

      {loading ? (
        <div className="page-loading"><Loader2 size={32} className="spinner-icon" /></div>
      ) : adventures.length === 0 ? (
        <div className="empty-state">
          <FileText size={56} className="empty-icon" />
          <h3>Aucune aventure</h3>
          <p>Commencez par créer votre première aventure interactive !</p>
          <button onClick={() => navigate('/editor')} className="btn btn-primary">
            <Plus size={18} /> Créer une aventure
          </button>
        </div>
      ) : (
        <div className="dashboard-list">
          {adventures.map((a) => {
            const st = statusLabels[a.status] || { label: a.status, class: '' };
            return (
              <div key={a.id} className="dashboard-card">
                <div className="dashboard-card-main">
                  <div className="dashboard-card-info">
                    <h3>{a.title}</h3>
                    <div className="dashboard-card-meta">
                      <span className={`status-badge ${st.class}`}>{st.label}</span>
                      <span><BookOpen size={13} /> {a.chapterCount} chapitres</span>
                      <span><BarChart3 size={13} /> {a.totalReads} lectures</span>
                    </div>
                  </div>
                  <div className="dashboard-card-actions">
                    <button onClick={() => navigate(`/editor/${a.id}`)} className="btn btn-ghost btn-sm" title="Éditer">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => navigate(`/adventure/${a.id}`)} className="btn btn-ghost btn-sm" title="Voir">
                      <Eye size={15} />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="btn btn-ghost btn-sm btn-danger" title="Supprimer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
