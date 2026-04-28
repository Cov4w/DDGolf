import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PopupNotice } from '../../types';

interface Props {
  popups: PopupNotice[];
  onClose: () => void;
  initialPosition?: { x: number; y: number };
}

export default function NoticePopup({ popups, onClose, initialPosition }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hideToday, setHideToday] = useState(false);
  const navigate = useNavigate();

  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  // Center on mount if no initial position
  useEffect(() => {
    if (!initialPosition && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setPosition({
        x: (window.innerWidth - rect.width) / 2,
        y: Math.max(40, (window.innerHeight - rect.height) / 3),
      });
    }
  }, [initialPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!popupRef.current) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const current = popups[currentIndex];
  if (!current) return null;

  const handleClose = () => {
    if (hideToday) {
      const today = new Date().toISOString().split('T')[0];
      const hiddenIds = JSON.parse(localStorage.getItem('popup_hidden') || '{}');
      popups.forEach((p) => {
        hiddenIds[p.id] = today;
      });
      localStorage.setItem('popup_hidden', JSON.stringify(hiddenIds));
    }
    onClose();
  };

  const handleNext = () => {
    if (currentIndex < popups.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      {/* Header - draggable */}
      <div
        className="flex justify-between items-center px-4 py-3 border-b bg-green-700 text-white cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h3 className="font-semibold text-sm truncate flex-1">{current.title}</h3>
        <button
          onClick={handleClose}
          className="text-white hover:text-green-200 text-xl leading-none ml-2"
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {current.popup_image && (
          <img
            src={current.popup_image}
            alt={current.title}
            className="w-full rounded-lg mb-3 object-cover max-h-64"
          />
        )}
        {current.popup_content && (
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-3">
            {current.popup_content}
          </p>
        )}

        {/* Action Button */}
        <div className="mb-3">
          <button
            onClick={() => {
              onClose();
              if (current.linked_event) {
                navigate(`/schedule/${current.linked_event}`);
              } else {
                navigate(`/notices/${current.id}`);
              }
            }}
            className="w-full py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium"
          >
            {current.linked_event ? '참가 신청' : '자세히 보기'}
          </button>
        </div>

        {/* Navigation for multiple popups */}
        {popups.length > 1 && (
          <div className="flex justify-center items-center gap-3 mb-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-sm"
            >
              &lt; 이전
            </button>
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {popups.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === popups.length - 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-sm"
            >
              다음 &gt;
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
        <label className="flex items-center cursor-pointer text-sm text-gray-500">
          <input
            type="checkbox"
            checked={hideToday}
            onChange={(e) => setHideToday(e.target.checked)}
            className="mr-2 rounded text-green-600 focus:ring-green-500"
          />
          오늘 하루 보지 않기
        </label>
        <button
          onClick={handleClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
