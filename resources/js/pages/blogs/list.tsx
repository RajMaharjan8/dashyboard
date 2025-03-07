import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from "axios";

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

export default function List(props: ListProps){

    const [data, setData] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");

    const fetchData = async(page: number) =>{
        let url = route('blog.paginate');
        try{
            const response = await axios.get(
                url + "?page="+page + "&title="+searchTitle
            );
            setData(response.data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchData(1);
        console.log("text: "+data);
    },[]);

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
                                <TableHead>Blog Category</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>


                                <TableCell className="font-medium">INV001</TableCell>
                                    <TableCell>Paid</TableCell>
                                    <TableCell>Credit Card</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="secondary" className='mr-2'>Edit</Button>
                                        <Button variant="destructive">Delete</Button>

                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                </div>
        </AppLayout>
    );
}
