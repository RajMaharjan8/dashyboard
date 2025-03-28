import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import JoditEditor from 'jodit-react';
import React, { FormEvent, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blogs / Create',
        href: '/blog',
    },
];

interface Blog {
    model: {
        id: bigint;
        blog_title: string;
        blog_description: string;
        media: string;
    };
}

interface FormData {
    blog_title: string;
    blog_description: string;
    media: File | null;
    remember: boolean;
    [key: string]: any;
}

export default function Create(props: Blog) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        blog_title: props.model?.blog_title ?? '',
        blog_description: props.model?.blog_description ?? '',
        media: null,
        _method: props.model?.id ? 'PUT' : 'POST',
        remember: false,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('media', e.target.files[0]);
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        {
            props.model?.id ? post(route('blog.update', [props.model?.id])) : post(route('blog.store'));
        }
    };

    //Editor
    const editor = useRef(null);
    const [content, setContent] = useState(data.blog_description || '');

    const handleEditorChange = (newContent: string) => {
        setContent(newContent);
        setData('blog_description', newContent);
    };
    const editorConfig = {
        theme: 'dark',
        height: 500,
        allowResizeX: false,
        allowResizeY: false,
    };

    //DropZone
    const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setData('media', acceptedFiles[0]);
            }
        },
        multiple: false,
        preventDropOnDocument: true,
    });
    const acceptedFileItems = acceptedFiles.map((file) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blogs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container">
                    <form onSubmit={submit}>
                        <div className="mb-4 flex flex-col gap-2">
                            <Input
                                type="text"
                                placeholder="Blog Name"
                                value={data.blog_title}
                                name="blog_title"
                                onChange={(e) => setData('blog_title', e.target.value)}
                            />
                            {errors.blog_title && <div className="text-red-500">{errors.blog_title}</div>}

                            <JoditEditor
                                className="jodit-editor font-black"
                                ref={editor}
                                value={content}
                                tabIndex={1}
                                onBlur={(newContent) => handleEditorChange(newContent)}
                                config={editorConfig}
                            />

                            {errors.blog_description && <div className="text-red-500">{errors.blog_description}</div>}

                            <div className="mt-5 grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="picture">Picture</Label>
                                {props.model?.media && !data.media && (
                                    <div className="mb-4">
                                        <h4 className="mt-4">Current Image</h4>
                                        <img
                                            src={props.model.media}
                                            alt="Blog media"
                                            className="h-auto max-w-full rounded-lg"
                                            style={{ maxHeight: '200px' }}
                                        />
                                    </div>
                                )}
                                <section className="container flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4">
                                    <div {...getRootProps({ className: 'dropzone' })}>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop some files here</p>
                                        <em>(Only *.jpeg and *.png images will be accepted)</em>
                                    </div>
                                    <aside className="mt-5">
                                        <h4>Selected files</h4>
                                        <ul>{acceptedFileItems}</ul>
                                    </aside>
                                </section>
                                {errors.media && <div className="text-red-500">{errors.media}</div>}
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
