import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

interface PaginationProps{
    currentPage: number;
    totalPage: number;
    handlePageChange: (pageNumber: number)=> void;
}
export default function CustomPagination(props: PaginationProps){
    const currentPage = props.currentPage;
    const totalPage = props.totalPage;
    const handlePageChange = props.handlePageChange;
    

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; 
        
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPage, currentPage + 2);

        if (totalPage > maxVisiblePages) {
            if (endPage === totalPage) {
                startPage = totalPage - maxVisiblePages + 1;
            }
            if (startPage === 1) {
                endPage = maxVisiblePages;
            }
        } else {
            startPage = 1;
            endPage = totalPage;
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return(
        <Pagination>
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
            </PaginationItem>

            {getPageNumbers().map((pageNum) => (
                <PaginationItem key={pageNum}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                        }}
                        isActive={pageNum === currentPage}
                    >
                        {pageNum}
                    </PaginationLink>
                </PaginationItem>
            ))}

            {totalPage > 5 && currentPage < totalPage - 2 && (
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
            )}

            <PaginationItem>
                <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPage ? 'pointer-events-none opacity-50' : ''}
                />
            </PaginationItem>
        </PaginationContent>
    </Pagination>
    );

  }
