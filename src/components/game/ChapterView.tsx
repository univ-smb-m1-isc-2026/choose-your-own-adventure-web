interface ChapterViewProps {
  title: string;
  content: string;
  imageUrl?: string;
  isEnding: boolean;
  endingType?: string;
}

export default function ChapterView({ title, content, imageUrl, isEnding, endingType }: ChapterViewProps) {
  return (
    <div className={`chapter-view ${isEnding ? 'chapter-ending' : ''}`}>
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
