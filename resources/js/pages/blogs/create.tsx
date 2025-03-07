import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useForm } from '@inertiajs/react'
import { FormEvent } from 'react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blogs / Create',
        href: '/blog',
    },
];



export default function Create(){
    const { data, setData, post, processing, errors } = useForm({
        blog_title: '',
        blog_description: '',
        media: null as File | null,
        remember: false,
      })


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files){
            setData('media', e.target.files[0]);
        }
    }
    const submit = (e: FormEvent)=>{
        e.preventDefault()
        post(route('blog.store'))
    }



    return(
       <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blogs" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                    <div className="container">
                        <form onSubmit={submit}>
                            <div className="flex flex-col gap-2 mb-4">
                                <Input type='text' placeholder='Blog Name' name="blog_title" onChange={e => setData('blog_title', e.target.value)}/>
                                {errors.blog_title && <div className='text-red-500'>{errors.blog_title}</div>}

                                <Textarea className="resize-none h-48" placeholder="Type your message here." name="blog_description" onChange={e => setData('blog_description', e.target.value)}/>
                                {errors.blog_description && <div className='text-red-500'>{errors.blog_description}</div>}

                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="picture">Picture</Label>
                                    <Input id="picture" type="file" name="media" onChange={handleFileChange}/>
                                    {errors.media && <div className='text-red-500'>{errors.media}</div>}

                                </div>


                            </div>
                            <Button type="submit"  disabled={processing}>Save</Button>
                        </form>
                    </div>



                </div>
        </AppLayout>
    );
}
