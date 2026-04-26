import { useQuery } from '@tanstack/react-query';
import { noticesService } from '../../services/notices';

export default function OrganizationIcons() {
  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => noticesService.getOrganizations(),
    staleTime: 0,
  });

  const activeOrganizations = organizations?.filter((o) => o.is_active) || [];

  if (activeOrganizations.length === 0) return null;

  // 한 세트가 화면을 넘길 수 있도록 충분히 복제
  // 아이템 너비(160px) + 양쪽 마진(~40px) = ~200px
  const copiesPerSet = Math.max(Math.ceil(2000 / (activeOrganizations.length * 200)), 1);
  const oneSet = Array.from({ length: copiesPerSet }, () => activeOrganizations).flat();
  // 동일한 세트 2개 → translateX(-50%)로 완벽 루프
  const items = [...oneSet, ...oneSet];
  const duration = Math.max(oneSet.length * 3, 12);

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            animation: marquee ${duration}s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="marquee-track" style={{ width: 'max-content' }}>
          {items.map((org, idx) => (
            <a
              key={`o-${org.id}-${idx}`}
              href={org.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center flex-shrink-0 mx-5 md:mx-8"
              title={org.name}
            >
              <div className="rounded-lg bg-gray-50 border border-gray-200 overflow-hidden group-hover:border-green-300 group-hover:shadow-md transition-all" style={{ width: '160px', height: '56px' }}>
                <img
                  src={org.logo}
                  alt={org.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="mt-2 text-xs text-gray-500 group-hover:text-green-700 transition-colors text-center">
                {org.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
