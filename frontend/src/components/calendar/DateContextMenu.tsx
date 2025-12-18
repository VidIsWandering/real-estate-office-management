import { Plus, Eye } from "lucide-react";
import { useEffect, useRef } from "react";

interface DateContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onAddEvent: () => void;
  onViewEvents: () => void;
}

export function DateContextMenu({
  isOpen,
  position,
  onClose,
  onAddEvent,
  onViewEvents,
}: DateContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[200px]"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <button
        onClick={() => {
          onAddEvent();
          onClose();
        }}
        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
      >
        <Plus className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">
          New Event
        </span>
      </button>
      {/* <button
        onClick={() => {
          onViewEvents();
          onClose();
        }}
        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
      >
        <Eye className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-gray-700">
          View All Events
        </span>
      </button> */}
    </div>
  );
}
