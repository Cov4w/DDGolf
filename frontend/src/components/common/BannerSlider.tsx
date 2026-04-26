import { useQuery } from '@tanstack/react-query';
import { noticesService } from '../../services/notices';

export default function BannerSlider() {
  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: () => noticesService.getBanners(),
    staleTime: 0,
  });

  const activeBanners = banners?.filter((b) => b.is_active) || [];

  if (activeBanners.length === 0) return null;

  // 한 세트가 화면을 넘길 수 있도록 충분히 복제
  // 아이템 너비(200px) + 양쪽 마진(~32px) = ~232px
  const copiesPerSet = Math.max(Math.ceil(2000 / (activeBanners.length * 232)), 1);
  const oneSet = Array.from({ length: copiesPerSet }, () => activeBanners).flat();
  // 동일한 세트 2개 → translateX(-50%)로 완벽 루프
  const items = [...oneSet, ...oneSet];
  const duration = Math.max(oneSet.length * 3, 12);

  return (
    <section className="max-w-7xl mx-auto px-4 py-4 overflow-hidden">
      <style>{`
        @keyframes bannerMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .banner-marquee-track {
          display: flex;
          animation: bannerMarquee ${duration}s linear infinite;
        }
        .banner-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="banner-marquee-track" style={{ width: 'max-content' }}>
        {items.map((banner, idx) => (
          <a
            key={`b-${banner.id}-${idx}`}
            href={banner.link || undefined}
            target={banner.link ? '_blank' : undefined}
            rel={banner.link ? 'noopener noreferrer' : undefined}
            className="group flex flex-col items-center flex-shrink-0 mx-4 md:mx-6"
            title={banner.description}
            onClick={(e) => { if (!banner.link) e.preventDefault(); }}
          >
            <div
              className="rounded-lg bg-white border border-gray-200 overflow-hidden group-hover:border-green-300 group-hover:shadow-md transition-all"
              style={{ width: '200px', height: '70px' }}
            >
              <img
                src={banner.image}
                alt={banner.description}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-1.5 text-xs text-gray-500 group-hover:text-green-700 transition-colors text-center truncate max-w-[200px]">
              {banner.description}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
