import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../../services/gallery';
import Loading from '../../components/common/Loading';

export default function Gallery() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['publicGallery', page],
    queryFn: () => galleryService.getAlbums(page, true),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">갤러리</h1>
          <p className="text-green-100 mt-2">DDGolf Gallery</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-gray-500">홈 &gt; 갤러리</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {data && data.results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.results.map((album) => (
                <Link
                  key={album.id}
                  to={`/gallery/${album.id}`}
                  className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {album.cover_image ? (
                    <img
                      src={album.cover_image}
                      alt={album.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <span className="text-6xl">🏌️</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="font-bold text-gray-800 group-hover:text-green-700">
                      {album.title}
                    </h2>
                    {album.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {album.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>사진 {album.photo_count}장</span>
                      <span>{new Date(album.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12 gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.previous}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              <span className="px-4 py-2 bg-green-700 text-white rounded">
                {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.next}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl">📷</span>
            <p className="mt-4 text-gray-500">등록된 앨범이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
