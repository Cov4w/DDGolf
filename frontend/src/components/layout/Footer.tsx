import { Link, useLocation } from 'react-router-dom';
import OrganizationIcons from '../common/OrganizationIcons';

export default function Footer() {
  const location = useLocation();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* 유관기관 아이콘 - 메인 페이지에서만 표시 */}
      {location.pathname === '/' && <OrganizationIcons />}

      {/* Footer Links */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-center gap-6 py-4 text-sm text-gray-600">
            <li>
              <Link to="/privacy" className="hover:text-green-700">개인정보취급방침</Link>
            </li>
            <li className="text-gray-300">|</li>
            <li>
              <Link to="/terms" className="hover:text-green-700">이용약관</Link>
            </li>
            <li className="text-gray-300">|</li>
            <li>
              <Link to="/email-policy" className="hover:text-green-700">이메일무단수집거부</Link>
            </li>
            <li className="text-gray-300">|</li>
            <li>
              <Link to="/admin" className="hover:text-green-700">관리자</Link>
            </li>
            <li className="text-gray-300">|</li>
            <li>
              <a href="https://naver.me/FriLMXfa" target="_blank" rel="noopener noreferrer" className="hover:text-green-700">오시는길</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <img src="/images/letter.png" alt="대덕구골프협회" className="h-10 object-contain mx-auto mb-3" />
            <p className="mb-2">
              대전광역시 대덕구 비래동로16번길 13
            </p>
            <p className="mb-2">
              T. 042-624-7080 | F. 0504-224-2549 | 사업자번호 160-80-03320
            </p>
            <p className="text-xs text-gray-400 mt-4">
              Copyright &copy; {new Date().getFullYear()} 대덕구골프협회(Dae Deok gu Golf Association). All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
