import { getSinglePhoto } from '@/utils/actions';

interface PhotoPageProps {
    params: Promise<{ photoId: string }>;
}

export default async function PhotoPage({ params }: PhotoPageProps) {

    // URL → photo ID
    const props = await params;
    const photoId = props.photoId;

    // Supabase → actions.ts → photo
    const photo = await getSinglePhoto(Number(photoId));

    if (!photo) {
        return (
            <div
                className="flex h-[50vh] items-center justify-center tracking-widest"
            >
                Photo not found.
            </div>
        )
    }

    return (
        <main>
            <div
                className="flex justify-center"
            >
                <img 
                    src={photo.image_url}
                    alt={photo.title || "photo"}
                    className="max-h-[80vh] py-10 md:py-5"
                />
            </div>

            <div
                className="flex flex-col space-y-5 md:space-y-2 max-w-screen md:items-center tracking-widest md:tracking-[4] italic text-sm md:text-lg mx-5"
            >
                <p
                    className="font-bold"
                >
                    {photo.title}
                </p>
                <p>
                <a
                    href={`/gallery?cameras=${photo.camera_id}`}
                    className="hover:opacity-50 duration-200"
                >{photo.cameras?.name}</a> • <a
                    href={`/gallery?film_stocks=${photo.film_stock_id}`}
                    className="hover:opacity-50 duration-200"
                >{photo.film_stocks?.name}</a>
                </p>
                <p>
                    {photo.date}
                </p>
            </div>
        </main>
    );
}