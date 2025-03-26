import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles / Create',
        href: '/roles',
    },
];

interface Role {
    model: {
        id: bigint;
        name: string;
        permission: any;
        media: string;
    };
    permissions: any[];
}

interface FormData {
    name: string;
    permissions: any[];
    remember: boolean;
    [key: string]: any;
}

export default function Create(props: Role) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: props.model?.name ?? '',
        permissions: props.model?.permission ?? [],
        _method: props.model?.id ? 'PUT' : 'POST',
        remember: false,
    });

    useEffect(()=>{
        console.log(data.permissions);
    },[]);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        {
            props.model?.id ? post(route('roles.update', [props.model?.id])) : post(route('roles.store'));
        }
    };

    const handlePermissionChange = (e: any, permission_id: number) => {
        if (e == true) {
            setData('permissions', [...data.permissions, permission_id]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((id) => id !== permission_id),
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container">
                    <form onSubmit={submit}>
                        <div className="mb-4 flex flex-col gap-2">
                            <Input
                                type="text"
                                placeholder="Roles Name"
                                value={data.name}
                                name="name"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <div className="text-red-500">{errors.name}</div>}

                            <div className="mt-6">
                                <h1>Give Permissions</h1>

                                {props.permissions?.length > 0
                                    ? props.permissions.map((item: { name: string; id: any }, index: number) => {
                                        const isChecked = data.permissions.includes(item.id);
                                          return (
                                              <div className="mt-2 flex items-center space-x-2" key={index}>
                                                  <Checkbox id={item.id} checked={isChecked} onCheckedChange={(e) => handlePermissionChange(e, item.id)} />
                                                  <label
                                                      htmlFor="terms"
                                                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                  >
                                                      {item.name}
                                                  </label>
                                              </div>
                                          );
                                      })
                                    : null}
                            </div>
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
