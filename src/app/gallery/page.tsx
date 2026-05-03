'use client';

import { getPhotos } from "@/utils/actions";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import { useEffect, useState } from "react";

interface Photo {
    src: string;
    width: number;
    height: number;
    alt: string;
}

export default function GalleryPage() {

    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [rowHeight, setRowHeight] = useState<number>(250);
    const [spacing, setSpacing] = useState<number>(10);

    useEffect(() => {

        getPhotos()
        .then((rawPhotos) => {
            const formattedPhotos = rawPhotos.map((p) => ((
                {
                    src: p.image_url,
                    width: p.width,
                    height: p.height,
                    alt: p.title || "photo"
                }
            )));

            setPhotos(formattedPhotos);

            // Only raise the flag when all photos have indeed been loaded.
            setHasMounted(true);
        });

        const updateRowHeightAndSpacing = () => {
            setRowHeight(window.innerWidth >= 768 ? 250 : 150);
            setSpacing(window.innerWidth >= 768 ? 10 : 5);
        };

        updateRowHeightAndSpacing();

        window.addEventListener('resize', updateRowHeightAndSpacing);

        return () => window.removeEventListener('resize', updateRowHeightAndSpacing);

    }, []);

    if (!hasMounted) {
        return (
            <div className="flex justify-center pt-50 items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-800 dark:border-gray-200"></div>
            </div>
        );
    }
    
    return (

        <main className="p-5 md:p-10">
            <h1 className="
            
            flex
            justify-center
            tracking-widest

            /* Mobile */
            p-5
            text-xl

            /* Desktop */
            md:p-10
            md:text-3xl

            ">GALLERY</h1>
            <RowsPhotoAlbum
                photos={photos}
                targetRowHeight={rowHeight}
                spacing={spacing}
            />
        </main>

    );

};