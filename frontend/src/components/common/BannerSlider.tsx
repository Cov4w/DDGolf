import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { noticesService } from '../../services/notices';

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: () => noticesService.getBanners(),
    staleTime: 0, // 항상 새로 가져오기
  });

  const activeBanners = banners?.filter((b) => b.is_active) || [];

  // 5초마다 자동 전환
  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    if (activeBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const goToNext = () => {
    if (activeBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
        {/* 배너 콘텐츠 - 크로스페이드 */}
        <div className="relative h-48 md:h-64">
          {activeBanners.map((banner, index) => (
            <div
              key={banner.id}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: index === currentIndex ? 1 : 0 }}
            >
              <img
                src={banner.image}
                alt={banner.description}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* 배너 정보 */}
              <div className="absolute bottom-12 left-4 right-4 text-white">
                <p className="text-lg md:text-xl font-semibold mb-1">
                  {banner.description}
                </p>
                <p className="text-sm md:text-base opacity-90">
                  문의: {banner.phone_number}
                </p>
              </div>
            </div>
          ))}

          {/* 좌우 화살표 - 항상 표시 */}
          <button
            onClick={goToPrevious}
            disabled={activeBanners.length <= 1}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 disabled:bg-black/20 disabled:cursor-not-allowed text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="이전 배너"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={activeBanners.length <= 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 disabled:bg-black/20 disabled:cursor-not-allowed text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="다음 배너"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 하단 인디케이터 바 */}
        <div className="bg-gray-900/80 px-4 py-2 flex items-center justify-center">
          {/* 점 인디케이터 */}
          <div className="flex gap-2">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white scale-110'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`배너 ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
