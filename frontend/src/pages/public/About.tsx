import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { noticesService } from '../../services/notices';

type Section = 'greeting' | 'clubs' | 'executives';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function About() {
  const [activeSection, setActiveSection] = useState<Section>('greeting');

  const { data: aboutContent } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: () => noticesService.getAboutContent(),
  });

  const { data: clubs } = useQuery({
    queryKey: ['publicClubs'],
    queryFn: () => noticesService.getPublicClubs(),
    enabled: activeSection === 'clubs',
  });

  const { data: executives } = useQuery({
    queryKey: ['executives'],
    queryFn: () => noticesService.getExecutives(),
    enabled: activeSection === 'executives',
  });

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('/media/')) return path;
    return `${API_BASE}${path}`;
  };

  const sections: { key: Section; label: string }[] = [
    { key: 'greeting', label: '인사말' },
    { key: 'clubs', label: '클럽현황' },
    { key: 'executives', label: '협회임원' },
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">협회소개</h1>
          <p className="text-green-100 mt-2">DDGA - 대덕구골프협회</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-gray-500">홈 &gt; 협회소개 &gt; {sections.find(s => s.key === activeSection)?.label}</p>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex gap-x-6">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === section.key
                    ? 'border-green-700 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* 인사말 */}
        {activeSection === 'greeting' && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-700">
              인사말
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {aboutContent?.greeting_text ? (
                  aboutContent.greeting_text.split('\n').map((line, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed mb-4">
                      {line}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      안녕하십니까. 대덕구골프협회 홈페이지를 방문해 주신 여러분을 진심으로 환영합니다.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      본 협회는 골프 스포츠의 진흥과 보급을 통하여 골프 저변확대를 위한 목적으로
                      설립되었으며, 골프 발전에 전력하고 있습니다.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      우리 협회는 회원 여러분의 골프 실력 향상과 친목 도모를 위해 다양한 프로그램을
                      운영하고 있으며, 정기적인 대회와 모임을 통해 회원 간의 유대를 강화하고 있습니다.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      앞으로도 회원 여러분의 많은 관심과 참여를 부탁드리며, 대덕구골프협회가 여러분과
                      함께 성장할 수 있도록 최선을 다하겠습니다. 감사합니다.
                    </p>
                  </>
                )}
                <p className="mt-6 text-right text-gray-700 font-medium">
                  {aboutContent?.greeting_author || '대덕구골프협회장'}
                </p>
              </div>
              <div className="flex items-start justify-center">
                <img
                  src={getImageUrl(aboutContent?.greeting_image) || '/images/chairman.jpg'}
                  alt="협회장"
                  className="w-48 rounded-lg shadow-md object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* 클럽현황 */}
        {activeSection === 'clubs' && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-700">
              클럽현황
            </h2>
            {clubs && clubs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {club.icon ? (
                      <img
                        src={club.icon}
                        alt={club.name}
                        className="w-14 h-14 rounded-full object-cover mx-auto mb-3"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                    <h3 className="font-bold text-gray-800">{club.name}</h3>
                    <p className="text-sm text-green-700 font-medium mt-1">{club.member_count}명</p>
                    {club.description && (
                      <p className="text-sm text-gray-500 mt-1">{club.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">등록된 클럽이 없습니다.</p>
            )}
          </section>
        )}

        {/* 협회임원 */}
        {activeSection === 'executives' && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-700">
              협회임원
            </h2>
            {executives && executives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {executives.map((exec) => (
                  <div
                    key={exec.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6 text-center">
                      {exec.photo ? (
                        <img
                          src={getImageUrl(exec.photo) || ''}
                          alt={exec.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-gray-800">{exec.name}</h3>
                      {exec.phone && (
                        <p className="text-sm text-gray-500 mt-1">{exec.phone}</p>
                      )}
                      {exec.greeting && (
                        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{exec.greeting}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">등록된 임원 정보가 없습니다.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
