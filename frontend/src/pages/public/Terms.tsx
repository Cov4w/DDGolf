export default function Terms() {
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">이용약관</h1>
          <p className="text-green-100 mt-2">Dae Deok gu Golf Association - 대덕구골프협회</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray max-w-none">

          {/* 제1조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제1조 (목적)
            </h2>
            <p className="text-gray-700">
              이 약관은 대덕구골프협회(이하 "협회")가 운영하는 홈페이지(https://ddgolf.kr, 이하 "홈페이지")에서
              제공하는 인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 협회와 이용자의 권리·의무 및
              책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제2조 (정의)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li><strong>"홈페이지"</strong>란 협회가 서비스를 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 설정한 가상의 공간을 말합니다.</li>
              <li><strong>"이용자"</strong>란 홈페이지에 접속하여 이 약관에 따라 협회가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li><strong>"회원"</strong>이란 협회에 개인정보를 제공하여 회원등록을 한 자로서, 협회의 정보를 지속적으로 제공받으며, 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
              <li><strong>"비회원"</strong>이란 회원에 가입하지 않고 협회가 제공하는 서비스를 이용하는 자를 말합니다.</li>
            </ol>
          </section>

          {/* 제3조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제3조 (약관의 명시와 개정)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>협회는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 홈페이지의 초기 화면에 게시합니다.</li>
              <li>협회는 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
              <li>협회가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 홈페이지에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</li>
              <li>회원이 개정약관의 적용에 동의하지 않는 경우 회원은 회원탈퇴(해지)를 할 수 있습니다.</li>
            </ol>
          </section>

          {/* 제4조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제4조 (서비스의 제공 및 변경)
            </h2>
            <p className="text-gray-700 mb-3">협회는 다음과 같은 서비스를 제공합니다.</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>협회 소개 및 공지사항 제공</li>
              <li>경기 일정 안내 및 참가 신청</li>
              <li>클럽 운영 및 클럽 내 메신저 서비스</li>
              <li>자유게시판 및 갤러리 등 커뮤니티 서비스</li>
              <li>기타 협회가 정하는 서비스</li>
            </ol>
            <p className="text-gray-700 mt-3">
              협회는 서비스의 내용이 변경되는 경우에는 그 사유 및 변경 내용을 홈페이지에 공지합니다.
            </p>
          </section>

          {/* 제5조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제5조 (서비스의 중단)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>협회는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
              <li>제1항에 의한 서비스 중단의 경우에는 홈페이지에 사전 공지합니다. 다만, 협회가 사전에 통지할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.</li>
            </ol>
          </section>

          {/* 제6조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제6조 (회원가입)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>이용자는 협회가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</li>
              <li>협회는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                  <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                  <li>기타 회원으로 등록하는 것이 협회의 운영에 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </li>
              <li>회원가입계약의 성립시기는 협회의 승낙이 회원에게 도달한 시점으로 합니다.</li>
              <li>회원은 등록사항에 변경이 있는 경우, 즉시 전자우편 기타 방법으로 협회에 대하여 그 변경사항을 알려야 합니다.</li>
            </ol>
          </section>

          {/* 제7조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제7조 (회원 탈퇴 및 자격 상실 등)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>회원은 협회에 언제든지 탈퇴를 요청할 수 있으며 협회는 즉시 회원탈퇴를 처리합니다.</li>
              <li>회원이 다음 각 호의 사유에 해당하는 경우, 협회는 회원자격을 제한 및 정지시킬 수 있습니다.
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                  <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 질서를 위협하는 경우</li>
                  <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                </ul>
              </li>
              <li>협회가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고, 회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.</li>
            </ol>
          </section>

          {/* 제8조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제8조 (회원에 대한 통지)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>협회가 회원에 대한 통지를 하는 경우, 회원이 가입 시 등록한 전자우편 주소로 할 수 있습니다.</li>
              <li>협회는 불특정다수 회원에 대한 통지의 경우 1주일 이상 홈페이지 게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다.</li>
            </ol>
          </section>

          {/* 제9조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제9조 (회원의 아이디 및 비밀번호에 대한 의무)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>아이디(이메일)와 비밀번호에 관한 관리책임은 회원에게 있습니다.</li>
              <li>회원은 자신의 아이디 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.</li>
              <li>회원이 자신의 아이디 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 협회에 통보하고 협회의 안내가 있는 경우 그에 따라야 합니다.</li>
            </ol>
          </section>

          {/* 제10조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제10조 (이용자의 의무)
            </h2>
            <p className="text-gray-700 mb-3">이용자는 다음 행위를 하여서는 안됩니다.</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>홈페이지에 게시된 정보의 변경</li>
              <li>협회가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
              <li>협회 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>협회 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 홈페이지에 공개 또는 게시하는 행위</li>
            </ol>
          </section>

          {/* 제11조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제11조 (게시물의 관리)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>회원의 게시물이 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 및 「저작권법」 등 관련법에 위반되는 내용을 포함하는 경우, 권리자는 관련법이 정한 절차에 따라 해당 게시물의 게시중단 및 삭제 등을 요청할 수 있으며, 협회는 관련법에 따라 조치를 취하여야 합니다.</li>
              <li>협회는 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나 기타 협회의 정책 및 관련법에 위반되는 경우에는 관련법에 따라 해당 게시물에 대해 임시조치 등을 취할 수 있습니다.</li>
            </ol>
          </section>

          {/* 제12조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제12조 (저작권의 귀속 및 이용제한)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>협회가 작성한 저작물에 대한 저작권 기타 지적재산권은 협회에 귀속합니다.</li>
              <li>이용자는 홈페이지를 이용함으로써 얻은 정보를 협회의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</li>
              <li>회원이 서비스 내에 게시한 게시물의 저작권은 해당 회원에게 귀속됩니다.</li>
            </ol>
          </section>

          {/* 제13조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제13조 (협회의 의무)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>협회는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고 안정적으로 서비스를 제공하는 데 최선을 다하여야 합니다.</li>
              <li>협회는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함) 보호를 위한 보안 시스템을 갖추어야 합니다.</li>
              <li>협회는 이용자가 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.</li>
            </ol>
          </section>

          {/* 제14조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제14조 (개인정보보호)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>협회는 이용자의 개인정보를 수집할 때 서비스 제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.</li>
              <li>협회는 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.</li>
              <li>협회는 수집된 개인정보를 목적 외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공 단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.</li>
              <li>이용자는 언제든지 협회가 가지고 있는 자신의 개인정보에 대해 열람 및 오류정정을 요구할 수 있으며 협회는 이에 대해 지체 없이 필요한 조치를 취할 의무를 집니다.</li>
            </ol>
          </section>

          {/* 제15조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제15조 (분쟁해결)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>협회는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.</li>
              <li>협회는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.</li>
              <li>협회와 이용자 간에 발생한 분쟁은 「전자거래기본법」 제28조 및 동 시행령 제15조에 의하여 설치된 전자거래분쟁조정위원회의 조정에 따를 수 있습니다.</li>
            </ol>
          </section>

          {/* 제16조 */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-700 pb-2 mb-4">
              제16조 (재판권 및 준거법)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>협회와 이용자 간에 발생한 서비스 이용에 관한 분쟁에 대하여는 대한민국 법을 적용합니다.</li>
              <li>서비스 이용으로 발생한 분쟁에 대한 소송은 민사소송법상의 관할법원에 제기합니다.</li>
            </ol>
          </section>

          {/* 부칙 */}
          <div className="border-t border-gray-200 pt-6 text-sm text-gray-500 text-center">
            <p>공고일자: 2026년 4월 6일</p>
            <p>시행일자: 2026년 4월 6일</p>
          </div>
        </div>
      </div>
    </div>
  );
}
