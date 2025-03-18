import { Link } from "@inertiajs/react";

export default function Card() {
    return (
        <>
            <Link>
            <div className="border-2 flex gap-2 w-1/2 py-4 cursor-pointer">

                <div className="flex-shrink-0 w-1/2 h-full overflow-hidden">
                    <img className="object-cover w-full h-full" src="https://static.wixstatic.com/media/4a6ac9_cf63728efd474c3bb3289f62618016d0~mv2.jpg/v1/fill/w_346,h_292,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/4a6ac9_cf63728efd474c3bb3289f62618016d0~mv2.jpg" alt="" />
                </div>
                <div>
                    <h1 className="font-bold text-2xl">Text</h1>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio nisi nesciunt dolores sequi tenetur iusto nostrum fugiat
                        cupiditate! Nesciunt qui enim tenetur ipsum maxime magnam vel facilis dolorum animi quasi?
                    </p>
                </div>
            </div>
            </Link>
        </>
    );
}
