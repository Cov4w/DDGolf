import { Link } from 'react-router-dom';
import OrganizationIcons from '../common/OrganizationIcons';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* 유관기관 아이콘 */}
      <OrganizationIcons />

      {/* Footer Links */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-center gap-6 py-4 text-sm text-gray-600">
            <li>
              <Link to="/about" className="hover:text-green-700">개인정보취급방침</Link>
            </li>
            <li className="text-gray-300">|</li>
            <li>
              <Link to="/about" className="hover:text-green-700">이용약관</Link>
            </li>
            <li className="text-gray-300">|</li>
            <li>
              <Link to="/about" className="hover:text-green-700">이메일무단수집거부</Link>
            </li>
            <li className="text-gray-300">|</li>
            <li>
              <Link to="/admin" className="hover:text-green-700">관리자</Link>
            </li>
            <li className="text-gray-300">|</li>
            <li>
              <Link to="/about" className="hover:text-green-700">오시는길</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong className="text-gray-700">DDGolf 협회</strong>
              {' '}서울특별시 강남구 테헤란로 123 골프타워 5층
            </p>
            <p className="mb-2">
              대표: 홍길동 | TEL: 02-1234-5678 | FAX: 02-1234-5679 | 고유번호: 123-45-67890
            </p>
            <p className="text-xs text-gray-400 mt-4">
              Copyright &copy; {new Date().getFullYear()} DDGolf Association. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
