import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { SelectSingle } from '@/pages/components/selectSingle';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import JoditEditor from 'jodit-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users / Create',
        href: '/users',
    },
];

interface User {
    model: {
        id: bigint;
        name: string;
        email: string;
        role: string
    };
    roles: any[]
}

interface FormData {
    name: string;
    email: string;
    remember: boolean;
    [key: string]: any;
}

export default function Create(props: User) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: props.model?.name ?? '',
        email: props.model?.email ?? '',
        role: props.model?.role || '', 
        _method: props.model?.id ? 'PUT' : 'POST',
        remember: false,
    });

    useEffect(() => {
        console.log('Current role:', data.role);
        console.log('Available roles:', props.roles);
    }, [data.role, props.roles]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        props.model?.id 
            ? post(route('users.update', [props.model?.id])) 
            : post(route('users.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container">
                    <form onSubmit={submit}>
                        <div className="mb-4 flex flex-col gap-2">
                            <Input
                                type="text"
                                placeholder="Users Name"
                                value={data.name}
                                name="name"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <div className="text-red-500">{errors.name}</div>}
                            <Input
                                type="text"
                                placeholder="Users Email"
                                value={data.email}
                                name="email"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <div className="text-red-500">{errors.email}</div>}
                            
                            <SelectSingle 
                                options={props.roles ?? []} 
                                title="Select Role" 
                                data_name="role" 
                                setData={setData} 
                                selected_value={data.role || ''} 
                            />
                            {errors.role && <div className="text-red-500">{errors.role}</div>}
                        </div>
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}