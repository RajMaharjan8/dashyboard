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
    onPageChange: (pageNumber: number)=> void;
}
export default function CustomPagination(props: PaginationProps){
    const currentPage = props.currentPage;
    const totalPage = props.totalPage;
    const onPageChange = props.onPageChange;

    return(
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                <PaginationPrevious onClick={(currentPage !== 1) ? ()=> onPageChange(currentPage -1) : ()=>onPageChange(currentPage) }  />
                </PaginationItem>


                <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>

                <PaginationItem>
                <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem>
                <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
            </Pagination>

    );

  }
