"use client";

import { Button } from "primereact/button";

// the total of fixed pages are the total of fixed buttons on each side of the pagination
// like 1 and 2 (or [...]) on the left or 9998 (or [...]) and 9999 on the right
const TOTAL_FIXED_PAGES = 2;

const CHEVRON_BUTTON_STYLE = "h-3rem";
const PAGE_BUTTON_STYLE = "";

type PageButtonProps = {
  page: number;
  active?: boolean;
  disabled?: boolean;
  onPageChange?: (page: number) => void;
};

const PageButton = ({
  page,
  active,
  disabled,
  onPageChange,
}: PageButtonProps) => {
  return (
    <Button
      disabled={disabled}
      text={!active}
      onClick={() => onPageChange?.(page)}
    >
      {page}
    </Button>
  );
};

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  disabled?: boolean;
  onPageChange?: (page: number) => void;
  className?: string;
};

const Pagination = ({
  totalPages,
  currentPage,
  disabled,
  onPageChange,
  className,
}: PaginationProps) => {
  const range = 1;

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const getRangeValue = () => {
    if (currentPage - range <= TOTAL_FIXED_PAGES)
      return range + (currentPage - TOTAL_FIXED_PAGES - range) * -1 + 1;

    if (currentPage + range > totalPages - TOTAL_FIXED_PAGES)
      return range + (currentPage + range + TOTAL_FIXED_PAGES - totalPages);

    return range;
  };

  const pageInGreaterRange = (page: number) => {
    return currentPage - getRangeValue() <= page;
  };

  const pageInLesserRange = (page: number) => {
    return currentPage + getRangeValue() >= page;
  };

  return (
    <div className="flex flex-row align-items-center justify-content-center overflow-x-auto border-round">
      <Button
        icon="pi pi-chevron-left"
        className={CHEVRON_BUTTON_STYLE}
        text
        onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
      />
      <ul className="mx-1 flex flex-row list-none p-0">
        <li>
          <PageButton
            page={1}
            active={currentPage === 1}
            onPageChange={onPageChange}
            disabled={disabled}
          />
        </li>
        {
          // If the first page is not in the range, show ellipsis
          !pageInGreaterRange(2) && (
            <li className="flex align-items-center justify-content-center px-1">
              ...
            </li>
          )
        }
        {pageNumbers
          .filter((page: number) => {
            if (page === 1 || page === totalPages) return false;
            return pageInGreaterRange(page) && pageInLesserRange(page);
          })
          .map((page) => (
            <li key={page}>
              <PageButton
                page={page}
                active={currentPage === page}
                onPageChange={onPageChange}
                disabled={disabled}
              />
            </li>
          ))}
        {
          // If the last page is not in the range, show ellipsis
          !pageInLesserRange(totalPages - 1) && (
            <li className="flex align-items-center justify-content-center px-1">
              ...
            </li>
          )
        }
        {totalPages > 1 && (
          <li>
            <PageButton
              page={totalPages}
              active={currentPage === totalPages}
              onPageChange={onPageChange}
              disabled={disabled}
            />
          </li>
        )}
      </ul>
      <Button
        icon="pi pi-chevron-right"
        className={CHEVRON_BUTTON_STYLE}
        text
        onClick={() =>
          currentPage < totalPages && onPageChange?.(currentPage + 1)
        }
        disabled={currentPage === totalPages || disabled}
      />
    </div>
  );
};

export { Pagination, type PaginationProps };
