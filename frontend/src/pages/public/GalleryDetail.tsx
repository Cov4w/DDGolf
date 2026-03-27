import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../../services/gallery';
import Loading from '../../components/common/Loading';

export default function GalleryDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { data: album, isLoading } = useQuery({
    queryKey: ['album', id],
    queryFn: () => galleryService.getAlbum(Number(id)),
    enabled: !!id,
  });

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
          {album.photos.map((photo) => (
            <div
              key={photo.id}
              className="cursor-pointer"
              onClick={() => setSelectedPhoto(photo.image)}
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
      ) : (
        <div className="text-center py-12 text-gray-500">
          등록된 사진이 없습니다.
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setSelectedPhoto(null)}
          >
            &times;
          </button>
          <img
            src={selectedPhoto}
            alt="확대 이미지"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
