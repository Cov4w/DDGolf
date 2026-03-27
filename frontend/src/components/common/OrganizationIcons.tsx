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

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
          유관기관
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {activeOrganizations.map((org) => (
            <a
              key={org.id}
              href={org.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center"
              title={org.name}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-green-300 group-hover:shadow-md transition-all">
                <img
                  src={org.logo}
                  alt={org.name}
                  className="max-w-full max-h-full object-contain p-2"
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
