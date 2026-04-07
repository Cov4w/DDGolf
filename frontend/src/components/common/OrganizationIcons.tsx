import { useQuery } from '@tanstack/react-query';
import { noticesService } from '../../services/notices';

export default function OrganizationIcons() {
  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => noticesService.getOrganizations(),
    staleTime: 0, // 항상 새로 가져오기
  });

  const activeOrganizations = organizations?.filter((o) => o.is_active) || [];

  if (activeOrganizations.length === 0) return null;

  // 아이템당 약 4초, 최소 12초
  const duration = Math.max(activeOrganizations.length * 4, 12);

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
          {[...activeOrganizations, ...activeOrganizations].map((org, idx) => (
            <a
              key={`${org.id}-${idx}`}
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
