import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { FormEvent, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions / Create',
        href: '/permissions',
    },
];

interface Permission {
    model: {
        id: bigint;
        name: string;
      
    };
}

interface FormData {
    name: string;
    guard_name: string;
    remember: boolean;
    [key: string]: any;
}

export default function Create(props: Permission) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: props.model?.name ?? '',
        guard_name: 'web',
        _method: props.model?.id ? 'PUT' : 'POST',
        remember: false,
    });



    const submit = (e: FormEvent) => {
        e.preventDefault();

        {
            props.model?.id ? post(route('permissions.update', [props.model?.id])) : post(route('permissions.store'));
        }
    };


 

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container">
                    <form onSubmit={submit}>
                        <div className="mb-4 flex flex-col gap-2">
                            <Input
                                type="text"
                                placeholder="Permissions Name"
                                value={data.name}
                                name="name"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <div className="text-red-500">{errors.name}</div>}
               
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
