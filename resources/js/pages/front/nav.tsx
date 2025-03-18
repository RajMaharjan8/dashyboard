import { Link } from '@inertiajs/react';

interface NavProps {
    is_active: string;
}

export default function Nav(props: NavProps) {
    const is_active = props.is_active;

    return (
        <>
            <nav className="py-4 shadow-md ">
                <ul className="flex items-center justify-center gap-4">
                    <li className={`hover:text-purple-500 ${is_active === 'articles' ? 'text-purple-500' : ''}`}>
                        <Link href="/articles">Articles</Link>
                    </li>
                    <li className={`hover:text-purple-500 ${is_active === 'about' ? 'text-purple-500' : ''}`}>
                        <Link href="/articles">About</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}
