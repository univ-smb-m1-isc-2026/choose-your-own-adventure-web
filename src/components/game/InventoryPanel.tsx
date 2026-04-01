import { Package } from 'lucide-react';

interface InventoryItem {
  itemId: string;
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
}

interface InventoryPanelProps {
  items: InventoryItem[];
  health: number;
  maxHealth: number;
  stats: Record<string, string>;
}

export default function InventoryPanel({ items, health, maxHealth, stats }: InventoryPanelProps) {
  const healthPercent = maxHealth > 0 ? (health / maxHealth) * 100 : 100;

  return (
    <div className="inventory-panel">
      <h3 className="panel-title">
        <Package size={16} /> État du personnage
      </h3>

      {/* Health bar */}
      <div className="health-section">
        <div className="health-label">
          <span>❤️ Santé</span>
          <span>{health} / {maxHealth}</span>
        </div>
        <div className="health-bar">
          <div
            className={`health-fill ${healthPercent > 50 ? 'health-good' : healthPercent > 20 ? 'health-warning' : 'health-danger'}`}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      {Object.keys(stats).length > 0 && (
        <div className="stats-section">
          <h4>Statistiques</h4>
          <div className="stats-grid">
            {Object.entries(stats).filter(([k]) => k !== 'health').map(([key, value]) => (
              <div key={key} className="stat-item">
                <span className="stat-key">{key}</span>
                <span className="stat-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory */}
      {items.length > 0 && (
        <div className="items-section">
          <h4>Inventaire</h4>
          <div className="items-list">
            {items.map((item) => (
              <div key={item.itemId} className="inventory-item">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="item-img" />}
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  {item.quantity > 1 && <span className="item-qty">×{item.quantity}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
