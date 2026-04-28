import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentsService } from '../../services/documents';
import Loading from '../../components/common/Loading';
import type { DocumentCategory, DocumentFile } from '../../types';

const EXT_COLORS: Record<string, string> = {
  pdf: 'bg-red-100 text-red-700',
  hwp: 'bg-sky-100 text-sky-700',
  hwpx: 'bg-sky-100 text-sky-700',
  doc: 'bg-blue-100 text-blue-700',
  docx: 'bg-blue-100 text-blue-700',
  xls: 'bg-green-100 text-green-700',
  xlsx: 'bg-green-100 text-green-700',
  ppt: 'bg-orange-100 text-orange-700',
  pptx: 'bg-orange-100 text-orange-700',
  zip: 'bg-yellow-100 text-yellow-700',
  rar: 'bg-yellow-100 text-yellow-700',
  jpg: 'bg-purple-100 text-purple-700',
  jpeg: 'bg-purple-100 text-purple-700',
  png: 'bg-purple-100 text-purple-700',
};

function getExtColor(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return EXT_COLORS[ext] || 'bg-gray-100 text-gray-600';
}

function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() || 'FILE';
}

function FileExtBadge({ filename, size = 'lg' }: { filename: string; size?: 'sm' | 'lg' }) {
  const ext = getFileExtension(filename);
  const color = getExtColor(filename);
  return (
    <span className={`inline-flex items-center justify-center rounded font-bold ${color} ${
      size === 'lg' ? 'px-3 py-1.5 text-base' : 'px-1.5 py-0.5 text-xs'
    }`}>
      {ext}
    </span>
  );
}

function isImageFile(filename: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(filename);
}

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<number | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['documentCategories'],
    queryFn: () => documentsService.getCategories(),
  });

  if (isLoading) return <Loading />;

  const filteredCategories = selectedCategory
    ? categories?.filter((c: DocumentCategory) => c.id === selectedCategory)
    : categories;

  const allDocuments = filteredCategories?.flatMap((c: DocumentCategory) =>
    c.documents.map(doc => ({ ...doc, categoryName: c.name }))
  ) || [];

  const getThumbnailFile = (doc: typeof allDocuments[0]): DocumentFile | undefined => {
    if (doc.thumbnail_id) {
      return doc.files.find(f => f.id === doc.thumbnail_id);
    }
    return doc.files.find(f => isImageFile(f.original_name));
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">서식다운로드</h1>
          <p className="text-green-100 mt-2">규정/규장/서식 다운로드</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-gray-500">홈 &gt; 서식다운로드</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {categories.map((cat: DocumentCategory) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name} ({cat.documents.length})
              </button>
            ))}
          </div>
        )}

        {/* Documents Grid */}
        {allDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allDocuments.map((doc) => {
              const thumbFile = getThumbnailFile(doc);
              const firstFile = doc.files[0];
              const hasMultipleFiles = doc.files.length > 1;
              const isExpanded = expandedDoc === doc.id;

              return (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Thumbnail or File Icon */}
                  <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                    {thumbFile && isImageFile(thumbFile.original_name) ? (
                      <img
                        src={thumbFile.file}
                        alt={doc.title}
                        className="w-full h-full object-contain"
                      />
                    ) : firstFile ? (
                      <div className="text-center">
                        <FileExtBadge filename={firstFile.original_name} size="lg" />
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-4xl text-gray-300">-</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                      {doc.categoryName}
                    </span>
                    {hasMultipleFiles && (
                      <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        {doc.files.length}개 파일
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 group-hover:text-green-700 truncate">{doc.title}</h3>
                    {doc.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{doc.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-400">
                        다운로드 {doc.download_count}회
                      </span>
                      {hasMultipleFiles ? (
                        <button
                          onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                          className="inline-flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {isExpanded ? '접기' : '파일 목록'}
                        </button>
                      ) : firstFile ? (
                        <a
                          href={documentsService.getDownloadUrl(doc.id, firstFile.id)}
                          className="inline-flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          다운로드
                        </a>
                      ) : null}
                    </div>

                    {/* Expanded file list */}
                    {isExpanded && (
                      <div className="mt-3 border-t pt-3 space-y-2">
                        {doc.files.map((f) => (
                          <a
                            key={f.id}
                            href={documentsService.getDownloadUrl(doc.id, f.id)}
                            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 text-sm text-gray-700"
                          >
                            <FileExtBadge filename={f.original_name} size="sm" />
                            <span className="flex-1 truncate">{f.original_name}</span>
                            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl">📄</span>
            <p className="mt-4 text-gray-500">등록된 서식이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
