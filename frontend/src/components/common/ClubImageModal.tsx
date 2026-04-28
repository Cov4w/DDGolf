import { useState, useEffect, useCallback } from 'react';

interface ClubImageItem {
  id: number;
  image: string;
  caption: string;
}

interface ClubImageModalProps {
  images: ClubImageItem[];
  clubName: string;
  onClose: () => void;
}

export default function ClubImageModal({ images, clubName, onClose }: ClubImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goNext, goPrev]);

  if (images.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{clubName}</h3>
          <p className="text-gray-500">등록된 이미지가 없습니다.</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="relative max-w-4xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl font-bold z-10 w-11 h-11 flex items-center justify-center"
        >
          X
        </button>

        {/* Club name */}
        <h3 className="text-white text-lg font-bold mb-3">{clubName}</h3>

        {/* Image */}
        <div className="relative w-full flex items-center justify-center">
          {/* Left arrow */}
          {images.length > 1 && (
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-11 h-11 flex items-center justify-center z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <img
            src={currentImage.image}
            alt={currentImage.caption || clubName}
            className="max-h-[70vh] max-w-full object-contain rounded-lg"
          />

          {/* Right arrow */}
          {images.length > 1 && (
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-11 h-11 flex items-center justify-center z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Caption */}
        {currentImage.caption && (
          <p className="text-white text-sm mt-3">{currentImage.caption}</p>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        <p className="text-white/60 text-xs mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
