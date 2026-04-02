import { useState, useEffect, useRef } from 'react';
import { Swords, Shield, Zap } from 'lucide-react';

interface CombatViewProps {
  enemyName: string;
  enemyMaxHealth: number;
  playerHealth: number;
  playerMaxHealth: number;
  onCombatEnd: (playerHealth: number, won: boolean) => void;
}

function rollDamage(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function CombatView({ enemyName, enemyMaxHealth, playerHealth, playerMaxHealth, onCombatEnd }: CombatViewProps) {
  const [eHp, setEHp] = useState(enemyMaxHealth);
  const [pHp, setPHp] = useState(playerHealth);
  const [log, setLog] = useState<string[]>([`⚔️ ${enemyName} apparaît !`]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [combatOver, setCombatOver] = useState(false);
  const [lastDamage, setLastDamage] = useState<{ target: 'player' | 'enemy'; amount: number } | null>(null);
  const [defending, setDefending] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  useEffect(() => {
    if (combatOver) return;
    if (!isPlayerTurn) {
      const timer = setTimeout(() => {
        enemyAttack();
      }, 800);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn, combatOver]);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const checkEnd = (newPHp: number, newEHp: number) => {
    if (newEHp <= 0) {
      setCombatOver(true);
      addLog(`🏆 ${enemyName} est vaincu !`);
      setTimeout(() => onCombatEnd(newPHp, true), 1500);
      return true;
    }
    if (newPHp <= 0) {
      setCombatOver(true);
      addLog(`💀 Vous avez été vaincu...`);
      setTimeout(() => onCombatEnd(0, false), 1500);
      return true;
    }
    return false;
  };

  const handleAttack = () => {
    if (!isPlayerTurn || combatOver) return;
    const dmg = rollDamage(8, 18);
    const newEHp = Math.max(0, eHp - dmg);
    setEHp(newEHp);
    setLastDamage({ target: 'enemy', amount: dmg });
    setDefending(false);
    addLog(`⚔️ Vous attaquez → ${dmg} dégâts`);
    if (!checkEnd(pHp, newEHp)) {
      setIsPlayerTurn(false);
    }
  };

  const handleDefend = () => {
    if (!isPlayerTurn || combatOver) return;
    setDefending(true);
    addLog(`🛡️ Vous prenez une posture défensive`);
    setIsPlayerTurn(false);
  };

  const handleSpecial = () => {
    if (!isPlayerTurn || combatOver) return;
    
    const cost = 49;
    const newPHp = Math.max(0, pHp - cost);
    setPHp(newPHp);
    setLastDamage({ target: 'player', amount: cost });
    addLog(`✨ Sacrifice de ${cost} PV pour un coup ultime !`);
    
    if (newPHp <= 0) {
      if (checkEnd(newPHp, eHp)) return;
    }

    const isHit = Math.random() < 0.5;
    if (isHit) {
      const damageToEnemy = eHp;
      const newEHp = 0;
      setEHp(newEHp);
      // Wait a bit to show enemy damage after player cost animation
      setTimeout(() => {
        setLastDamage({ target: 'enemy', amount: damageToEnemy });
        addLog(`⚡ COUP DÉVASTATEUR ! ${enemyName} est abattu !`);
        checkEnd(newPHp, newEHp);
      }, 600);
    } else {
      setTimeout(() => {
        addLog(`❌ Le coup spécial a échoué !`);
        setIsPlayerTurn(false);
      }, 600);
    }
  };

  const enemyAttack = () => {
    if (combatOver) return;
    let dmg = rollDamage(5, 15);
    if (defending) {
      dmg = Math.max(1, Math.floor(dmg * 0.4));
      addLog(`🛡️ Vous bloquez partiellement ! ${enemyName} inflige ${dmg} dégâts`);
    } else {
      addLog(`💥 ${enemyName} attaque → ${dmg} dégâts`);
    }
    const newPHp = Math.max(0, pHp - dmg);
    setPHp(newPHp);
    setLastDamage({ target: 'player', amount: dmg });
    if (!checkEnd(newPHp, eHp)) {
      setIsPlayerTurn(true);
    }
  };

  const eHpPercent = (eHp / enemyMaxHealth) * 100;
  const pHpPercent = (pHp / playerMaxHealth) * 100;

  return (
    <div className="combat-view">
      <div className="combat-arena">
        {/* Enemy */}
        <div className={`combat-combatant combat-enemy ${lastDamage?.target === 'enemy' ? 'combat-hit' : ''}`}>
          <div className="combat-name">{enemyName}</div>
          <div className="combat-hp-bar-container">
            <div className="combat-hp-bar">
              <div className="combat-hp-fill combat-hp-enemy" style={{ width: `${eHpPercent}%` }} />
            </div>
            <span className="combat-hp-text">{eHp}/{enemyMaxHealth}</span>
          </div>
          {lastDamage?.target === 'enemy' && (
            <div className="combat-damage-popup combat-damage-enemy">-{lastDamage.amount}</div>
          )}
        </div>

        <div className="combat-vs">
          <Swords size={28} className="combat-vs-icon" />
          <span>VS</span>
        </div>

        {/* Player */}
        <div className={`combat-combatant combat-player ${lastDamage?.target === 'player' ? 'combat-hit' : ''}`}>
          <div className="combat-name">Vous</div>
          <div className="combat-hp-bar-container">
            <div className="combat-hp-bar">
              <div
                className={`combat-hp-fill ${pHpPercent > 50 ? 'combat-hp-good' : pHpPercent > 20 ? 'combat-hp-warning' : 'combat-hp-danger'}`}
                style={{ width: `${pHpPercent}%` }}
              />
            </div>
            <span className="combat-hp-text">{pHp}/{playerMaxHealth}</span>
          </div>
          {lastDamage?.target === 'player' && (
            <div className="combat-damage-popup combat-damage-player">-{lastDamage.amount}</div>
          )}
        </div>
      </div>

      {/* Combat Log */}
      <div className="combat-log" ref={logRef}>
        {log.map((msg, i) => (
          <div key={i} className="combat-log-entry">{msg}</div>
        ))}
      </div>

      {/* Actions */}
      {!combatOver && isPlayerTurn && (
        <div className="combat-actions">
          <button onClick={handleAttack} className="combat-btn combat-btn-attack">
            <Swords size={16} /> Attaquer
          </button>
          <button onClick={handleDefend} className="combat-btn combat-btn-defend">
            <Shield size={16} /> Défendre
          </button>
          <button onClick={handleSpecial} className="combat-btn combat-btn-special">
            <Zap size={16} /> Coup spécial (49 PV)
          </button>
        </div>
      )}

      {!combatOver && !isPlayerTurn && (
        <div className="combat-waiting">
          <span className="combat-waiting-text">{enemyName} prépare son attaque...</span>
        </div>
      )}

      {combatOver && (
        <div className="combat-result">
          {eHp <= 0 ? (
            <span className="combat-win">🏆 Victoire ! Choisissez votre prochain mouvement.</span>
          ) : (
            <span className="combat-defeat">💀 Vous avez été vaincu...</span>
          )}
        </div>
      )}
    </div>
  );
}
