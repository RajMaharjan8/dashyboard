import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from "axios";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from '@inertiajs/react'
import { useEffect, useState } from 'react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blogs',
        href: '/blogs',
    },
];

interface ListProps{
    items: string[]
}

interface Blog{
    id: number;
    blog_title: string;

}

export default function List(props: ListProps){

    const [data, setData] = useState<Blog[]>([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(1);

    const fetchData = async(page: number, searchTitle: string) =>{
        setLoading(true);
        let url = route('blog.paginate');
        try{
            const response = await axios.get(
                url + "?page="+page + "&title="+searchTitle
            );
            setData(response.data.data);
            setTotalPage(response.data.last_page);
            setPage(response.data.current_page);
        }catch(error){
            console.log(error);
        }finally {
            setLoading(false);
        }
    }

    const previousPage = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            fetchData(newPage, searchTitle);
        }
    };

    const nextPage = () => {
        if (page < totalPage) {
            const newPage = page + 1;
            setPage(newPage);
            fetchData(newPage, searchTitle);
        }
    };

    useEffect(()=>{
        fetchData(page, searchTitle);
    },[page, searchTitle]);







    return(
       <AppLayout breadcrumbs={breadcrumbs}>

            <Head title="Blogs" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="flex justify-between">
                        <div className="flex justify-center items-center gap-2">
                            <Input type='text' placeholder='Search'/>
                            <Button type="submit">Search</Button>
                        </div>
                        <Link href={route('blog.create')}><Button type="submit">Add New Blog</Button></Link>


                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">S.N.</TableHead>
                                <TableHead>Blog Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data.length > 0 ? (
                                    data.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell>{item.blog_title}</TableCell>
                                            <TableCell className="text-right">

                                                    <Button variant="secondary" className="mr-2">
                                                        Edit
                                                    </Button>
                                                <Button variant="destructive">Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ):
                                (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No blogs found
                                        </TableCell>
                                    </TableRow>
                                )
                            }

                        </TableBody>
                    </Table>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                            <PaginationPrevious onClick={()=>previousPage()} />
                            </PaginationItem>

                            {
                                [...Array(totalPage)].map((_, i)=>{
                                    const pageNumber = i + 1;
                                    return(
                                        <>
                                            <PaginationItem>
                                                <PaginationLink >{pageNumber}</PaginationLink>
                                            </PaginationItem>

                                        </>

                                    );
                                })

                            }
                            {/*
                            <PaginationItem>
                            <PaginationEllipsis />
                            </PaginationItem> */}


                            <PaginationItem>
                            <PaginationNext onClick={()=>nextPage()}/>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                </div>
        </AppLayout>
    );
}
