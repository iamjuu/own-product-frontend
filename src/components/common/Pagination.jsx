import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 7,
  onPageChange,
  itemName = 'results',
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis if needed
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
      <div className="text-[#8a87a6] font-normal">
        Showing <span className="font-medium text-[#181829]">{startItem}</span> to{' '}
        <span className="font-medium text-[#181829]">{endItem}</span> of{' '}
        <span className="font-medium text-[#181829]">{totalItems}</span> {itemName}
      </div>

      <div className="flex items-center space-x-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-2.5 py-1.5 rounded-xl border border-slate-200/80 flex items-center space-x-1 transition-all ${
            currentPage <= 1
              ? 'opacity-40 cursor-not-allowed bg-white text-slate-400'
              : 'bg-white hover:bg-[#f0f2fb] text-[#181829]'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span key={`dots-${idx}`} className="px-2 py-1 text-[#8a87a6]">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-xl font-normal transition-all flex items-center justify-center text-xs ${
                  p === currentPage
                    ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/25'
                    : 'bg-[#f0f2fb] text-[#8a87a6] hover:text-[#181829] hover:bg-[#e4e7f7]'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-2.5 py-1.5 rounded-xl border border-slate-200/80 flex items-center space-x-1 transition-all ${
            currentPage >= totalPages
              ? 'opacity-40 cursor-not-allowed bg-white text-slate-400'
              : 'bg-white hover:bg-[#f0f2fb] text-[#181829]'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
