export default function EmailPolicy() {
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">이메일무단수집거부</h1>
          <p className="text-green-100 mt-2">DDGA - 대덕구골프협회</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray max-w-none">

          {/* 안내문 */}
          <section className="mb-10">
            <div className="bg-green-50 border-l-4 border-green-700 p-6 rounded-r-lg mb-8">
              <p className="text-gray-800 text-lg font-medium leading-relaxed">
                본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여
                무단으로 수집되는 것을 거부하며, 이를 위반 시 <strong>「정보통신망 이용촉진 및 정보보호 등에 관한 법률」</strong>에 의해 형사처벌됨을 유념하시기 바랍니다.
              </p>
            </div>
          </section>

          {/* 관련 법률 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              관련 법률 안내
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">
                정보통신망 이용촉진 및 정보보호 등에 관한 법률
              </h3>

              <div className="space-y-6 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">제50조 (영리목적의 광고성 정보 전송 제한)</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>누구든지 전자우편 등을 이용하여 수신자의 명시적인 사전 동의 없이 영리목적의 광고성 정보를 전송하여서는 아니 됩니다.</li>
                    <li>전자우편 등을 이용하여 영리목적의 광고성 정보를 전송하는 자는 수신자가 수신거부의사를 표시하거나 사전 동의를 철회한 경우 영리목적의 광고성 정보를 전송하여서는 아니 됩니다.</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">제50조의2 (전자우편주소의 무단 수집행위 등 금지)</h4>
                  <p className="mb-2">누구든지 다음 각 호의 어느 하나에 해당하는 행위를 하여서는 아니 됩니다.</p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>인터넷 홈페이지 등에 게시된 전자우편주소를 자동으로 수집하는 프로그램이나 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하는 행위</li>
                    <li>제1호에 의하여 수집된 전자우편주소를 판매·유통하는 행위</li>
                    <li>제1호 및 제2호에 의하여 수집·판매 및 유통이 금지된 전자우편주소임을 알면서 이를 정보전송에 이용하는 행위</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">제76조 (벌칙)</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p>
                      제50조의2를 위반하여 전자우편주소를 수집·판매·유통하거나 정보전송에 이용한 자는
                      <strong className="text-red-600"> 1천만원 이하의 벌금</strong>에 처합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 협회 방침 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              대덕구골프협회 이메일 수집 거부 방침
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                대덕구골프협회는 회원 및 관련자의 개인정보를 보호하기 위해 아래와 같은 방침을 시행합니다.
              </p>
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  본 웹사이트에 게시된 이메일 주소를 기술적 장치 등을 이용하여 무단으로 수집하는 행위를 거부합니다.
                </li>
                <li>
                  무단 수집된 이메일 주소를 통한 영리 목적의 광고성 정보 전송을 거부합니다.
                </li>
                <li>
                  위 사항을 위반할 경우 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관계 법령에 의거하여 형사고발 등 법적 조치를 취할 수 있습니다.
                </li>
              </ol>
            </div>
          </section>

          {/* 신고 안내 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              불법 스팸 신고 안내
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">기관</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">연락처</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">홈페이지</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">한국인터넷진흥원 (KISA)</td>
                    <td className="border border-gray-300 px-4 py-2">118</td>
                    <td className="border border-gray-300 px-4 py-2">www.kisa.or.kr</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">불법스팸대응센터</td>
                    <td className="border border-gray-300 px-4 py-2">118</td>
                    <td className="border border-gray-300 px-4 py-2">spam.kisa.or.kr</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">경찰청 사이버안전국</td>
                    <td className="border border-gray-300 px-4 py-2">182</td>
                    <td className="border border-gray-300 px-4 py-2">cyberbureau.police.go.kr</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-6 text-sm text-gray-500 text-center">
            <p>공고일자: 2026년 4월 6일</p>
            <p>시행일자: 2026년 4월 6일</p>
          </div>
        </div>
      </div>
    </div>
  );
}
