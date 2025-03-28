import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import CustomPagination from '@/pages/components/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];


interface ListProps {
}

interface User {
    id: number;
    name: string;
    email: string;
}

export default function List(props: ListProps) {
    const [data, setData] = useState<User[]>([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchData = async (page: number, searchTitle: string) => {
        setLoading(true);
        let url = route('users.paginate');
        try {
            const response = await axios.get(url + '?page=' + page + '&name=' + searchTitle);
            setData(response.data.data);
            setTotalPage(response.data.last_page);
            setCurrentPage(response.data.current_page);
            setPage(response.data.current_page);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNum: number) => {
        if (pageNum >= 1 && pageNum <= totalPage && pageNum !== currentPage) {
            setPage(pageNum);
            fetchData(pageNum, searchTitle);
        }
    };

    useEffect(() => {
        fetchData(page, searchTitle);

    }, [page, searchTitle, currentPage]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between">
                    <div className="flex items-center justify-center gap-2">
                        <Input
                            type="text"
                            onChange={(e) => {
                                setSearchTitle(e.target.value);
                            }}
                            placeholder="Search"
                        />
                        {/* <Button type="submit">Search</Button> */}
                    </div>

                    <Link href={route('users.create')}>
                        <Button type="submit">Add New Users</Button>
                    </Link>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">S.N.</TableHead>
                            <TableHead>Users Name</TableHead>
                            <TableHead>Users Email</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow> 
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={route('users.edit', { id: item.id })}>
                                            <Button variant="secondary" className="mr-2">
                                                Edit
                                            </Button>
                                        </Link>

                                        {/* <Button variant="destructive">Delete</Button> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    No data found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {totalPage > 1 && <CustomPagination currentPage={currentPage} totalPage={totalPage} handlePageChange={handlePageChange} />}
            </div>
        </AppLayout>
    );
}
