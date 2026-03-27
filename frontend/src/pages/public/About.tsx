export default function About() {
  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">협회소개</h1>
          <p className="text-green-100 mt-2">DDGolf Association</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-gray-500">홈 &gt; 협회소개</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 인사말 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-700">
            인사말
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-gray-600 leading-relaxed mb-4">
                안녕하십니까. DDGolf 협회 홈페이지를 방문해 주신 여러분을 진심으로 환영합니다.
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
                앞으로도 회원 여러분의 많은 관심과 참여를 부탁드리며, DDGolf 협회가 여러분과
                함께 성장할 수 있도록 최선을 다하겠습니다. 감사합니다.
              </p>
              <p className="mt-6 text-right text-gray-700 font-medium">
                DDGolf 협회장 홍길동
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <span className="text-8xl">🏌️</span>
              </div>
            </div>
          </div>
        </section>

        {/* 협회 비전 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-700">
            협회 비전
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">골프 저변 확대</h3>
              <p className="text-sm text-gray-600">
                누구나 쉽게 골프를 접하고 즐길 수 있는 환경을 만들어 갑니다.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">회원 친목 도모</h3>
              <p className="text-sm text-gray-600">
                정기적인 모임과 대회를 통해 회원 간의 우정을 쌓아갑니다.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">실력 향상</h3>
              <p className="text-sm text-gray-600">
                체계적인 프로그램으로 회원들의 골프 실력 향상을 지원합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 주요 활동 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-700">
            주요 활동
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-700 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">🏆</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">정기 경기</h3>
                <p className="text-sm text-gray-600">
                  매월 정기 경기를 개최하여 회원들의 실력 향상과 친목을 도모합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-700 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">🎓</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">레슨 프로그램</h3>
                <p className="text-sm text-gray-600">
                  초보자부터 고급자까지 맞춤형 레슨 프로그램을 운영합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-700 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">🎉</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">친목 행사</h3>
                <p className="text-sm text-gray-600">
                  송년회, 시상식 등 다양한 친목 행사를 진행합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-700 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">🌐</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">교류 활동</h3>
                <p className="text-sm text-gray-600">
                  타 협회와의 교류전 및 공동 행사를 개최합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 오시는 길 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-700">
            오시는 길
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl">📍</span>
                <p className="mt-2 text-gray-500">지도 영역</p>
              </div>
            </div>
            <div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700 w-24">주소</td>
                    <td className="py-3 text-gray-600">서울특별시 강남구 테헤란로 123 골프타워 5층</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">전화</td>
                    <td className="py-3 text-gray-600">02-1234-5678</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">팩스</td>
                    <td className="py-3 text-gray-600">02-1234-5679</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">이메일</td>
                    <td className="py-3 text-gray-600">info@ddgolf.com</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-gray-700">교통편</td>
                    <td className="py-3 text-gray-600">
                      지하철 2호선 강남역 3번 출구에서 도보 5분
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
