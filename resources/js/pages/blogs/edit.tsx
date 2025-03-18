import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import JoditEditor from 'jodit-react';
import { FormEvent, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blogs / Edit',
        href: '/blog',
    },
];

interface Blog {
    blog: {
        blog_title: string;
        blog_description: string;
        media: string;
    };
}

export default function Edit(props: Blog) {
    const { data, setData, put, processing, errors } = useForm({
        blog_title: props.blog.blog_title ?? '',
        blog_description: props.blog.blog_description ?? '',
        media: props.blog.media ?? (null as File | null),
        remember: false,
    });

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         setData('media', e.target.files[0]);
    //     }
    // };
    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('blog.update'));
    };

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
    });
    const acceptedFileItems = acceptedFiles.map((file) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    console.log('new content: ', data.media);

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
                                <section className="container flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4">
                                    <div {...getRootProps({ className: 'dropzone' })} className="flex cursor-pointer flex-col items-center gap-2">
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop some files here</p>
                                        <em>(Only *.jpeg and *.png images will be accepted)</em>
                                    </div>
                                    <aside className="mt-5">
                                        <h4>Selected files</h4>
                                        <ul>{acceptedFileItems}</ul>
                                    </aside>
                                </section>

                                {data.media.length > 0 ? 
                                    <div>
                                        <h1 className="mt-4">Image Preview</h1> 
                                        <div className="">
                                            <img src={data.media} />
                                        </div>
                                        
                                    </div>
                                
                                : null}

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
