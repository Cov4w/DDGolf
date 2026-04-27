import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../../services/gallery';
import Loading from '../../components/common/Loading';

export default function GalleryDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const { data: album, isLoading } = useQuery({
    queryKey: ['album', id],
    queryFn: () => galleryService.getAlbum(Number(id)),
    enabled: !!id,
  });

  // Build the list of all viewable images
  const allImages: { src: string; caption?: string }[] = [];
  if (album?.photos && album.photos.length > 0) {
    album.photos.forEach((photo) => {
      allImages.push({ src: photo.image, caption: photo.caption });
    });
  } else if (album?.cover_image) {
    allImages.push({ src: album.cover_image, caption: '대표 이미지' });
  }

  const goPrev = useCallback(() => {
    if (selectedIndex === null || allImages.length === 0) return;
    setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : allImages.length - 1);
  }, [selectedIndex, allImages.length]);

  const goNext = useCallback(() => {
    if (selectedIndex === null || allImages.length === 0) return;
    setSelectedIndex(selectedIndex < allImages.length - 1 ? selectedIndex + 1 : 0);
  }, [selectedIndex, allImages.length]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, goPrev, goNext, closeLightbox]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  };

  if (isLoading) return <Loading />;
  if (!album) return <div className="text-center py-12">앨범을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/gallery" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
        &larr; 갤러리로 돌아가기
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{album.title}</h1>
        {album.description && (
          <p className="text-gray-600 mt-2">{album.description}</p>
        )}
        <div className="flex gap-4 mt-4 text-sm text-gray-500">
          <span>작성자: {album.author.username}</span>
          <span>{new Date(album.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {album.photos && album.photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.photos.map((photo, index) => (
            <div
              key={photo.id}
              className="cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={photo.image}
                alt={photo.caption || '사진'}
                className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
              {photo.caption && (
                <p className="text-sm text-gray-600 mt-1">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      ) : album.cover_image ? (
        <div>
          <div
            className="cursor-pointer inline-block"
            onClick={() => setSelectedIndex(0)}
          >
            <img
              src={album.cover_image}
              alt={album.title}
              className="w-full max-w-2xl h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">대표 이미지</p>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          등록된 사진이 없습니다.
        </div>
      )}

      {/* Lightbox */}
      {selectedIndex !== null && allImages[selectedIndex] && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
            onClick={closeLightbox}
          >
            &times;
          </button>

          {/* Previous button */}
          {allImages.length > 1 && (
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white text-4xl sm:text-5xl hover:text-gray-300 z-10 p-2"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              &#8249;
            </button>
          )}

          {/* Image */}
          <img
            src={allImages[selectedIndex].src}
            alt={allImages[selectedIndex].caption || '확대 이미지'}
            className="max-w-[85vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          {allImages.length > 1 && (
            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white text-4xl sm:text-5xl hover:text-gray-300 z-10 p-2"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              &#8250;
            </button>
          )}

          {/* Position indicator */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
              {selectedIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
