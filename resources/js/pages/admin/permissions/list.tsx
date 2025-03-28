import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import CustomPagination from '@/pages/components/pagination';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
];

interface ListProps {}

interface Role {
    id: number;
    name: string;
    group: string;
}

export default function List(props: ListProps) {
    const [data, setData] = useState<Role[]>([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { delete: destroy } = useForm(); 

    const fetchData = async (page: number, searchTitle: string) => {
        setLoading(true);
        let url = route('permissions.paginate');
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

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.preventDefault();

        if (confirm('Are you sure you want to delete this permission?')) {
            destroy(route('permissions.destroy', id), {
                onSuccess: () => {
                    fetchData(page, searchTitle);
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
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

                    <Link href={route('roles.create')}>
                        <Button type="submit">Add New Roles</Button>
                    </Link>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">S.N.</TableHead>
                            <TableHead>Roles Name</TableHead>
                            <TableHead>Group Name</TableHead>

                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.group ?? 'N/A'}</TableCell>

                                    <TableCell className="text-right">
                                        <Link href={route('roles.edit', { id: item.id })}>
                                            <Button variant="secondary" className="mr-2">
                                                Edit
                                            </Button>
                                        </Link>

                                        <Button 
                                            onClick={(e) => handleDelete(e, item.id)} 
                                            variant="destructive"
                                        >Delete</Button>
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
