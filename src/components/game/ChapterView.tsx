import { useEffect, useState } from 'react';

interface ChapterViewProps {
  title: string;
  content: string;
  imageUrl?: string;
  isEnding: boolean;
  endingType?: string;
}

export default function ChapterView({ title, content, imageUrl, isEnding, endingType }: ChapterViewProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, [title, content]);

  return (
    <div className={`chapter-view ${isEnding ? 'chapter-ending' : ''} ${visible ? 'chapter-visible' : 'chapter-hidden'}`}>
      {imageUrl && (
        <div className="chapter-image-container">
          <img src={imageUrl} alt={title} className="chapter-image" />
          <div className="chapter-image-overlay" />
        </div>
      )}
      <div className="chapter-content">
        <h2 className="chapter-title">{title}</h2>
        {isEnding && (
          <div className={`ending-badge ${endingType === 'WIN' ? 'ending-win' : endingType === 'LOSE' ? 'ending-lose' : 'ending-neutral'}`}>
            {endingType === 'WIN' ? '🏆 Victoire !' : endingType === 'LOSE' ? '💀 Défaite' : '📖 Fin'}
          </div>
        )}
        <div className="chapter-text">
          {content?.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
