import React from "react";
import Button from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const maxPageNumbersToShow = 5;

  const getPageNumbers = () => {
    const pages: number[] = [];

    // Determine the start and end pages to show
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    let endPage = startPage + maxPageNumbersToShow - 1;

    // Adjust if the end page goes beyond the total pages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center space-x-2 justify-center">
      <Button
        buttonStyle="secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {pages[0] > 1 && (
        <>
          <Button buttonStyle="secondary" onClick={() => onPageChange(1)}>
            1
          </Button>
          <span className="px-2">...</span>
        </>
      )}

      {pages.map((page) => (
        <Button
          buttonStyle={page === currentPage ? "primary" : "secondary"}
          key={page}
          className={`px-2 py-1 rounded ${
            page === currentPage
              ? "bg-[#2BD17E] text-white"
              : "bg-gray-700 text-white"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          <span className="px-2">...</span>
          <Button
            buttonStyle="primary"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        buttonStyle="secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
