'use client';

import { getPhotos, getFilmStocks, getCameras } from "@/utils/actions";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import { useEffect, useState } from "react";
import "@/utils/animations";
import { fadeInAnimation } from "@/utils/animations";

interface Photo {
    src: string;
    width: number;
    height: number;
    alt: string;
}

interface FilmStock {
    id: number;
    name: string;
    iso: number;
}

interface Camera {
    id: number;
    name: string;
    format: string;
}

export default function GalleryPage() {

    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [filmStocks, setFilmStocks] = useState<FilmStock[]>([]);
    const [cameras, setCameras] = useState<Camera[]>([]);

    // Filters
    const [filmStocksFilter, setFilmStocksFilter] = useState<number[]>([]);
    const [camerasFilter, setCamerasFilter] = useState<number[]>([]);

    const filters = [
        {
            name: "Film Stocks",
            list: filmStocks,
            state: filmStocksFilter
        },
        {
            name: "Cameras",
            list: cameras,
            state: camerasFilter
        }
    ];

    // RowsPhotoAlbum specs
    const [rowHeight, setRowHeight] = useState<number>(250);
    const [spacing, setSpacing] = useState<number>(10);

    useEffect(() => {

        setHasMounted(false);

        // Query Supabase
        getFilmStocks().then((data) => { setFilmStocks(data) })
        getCameras().then((data) => { setCameras(data) })

        getPhotos(filmStocksFilter, camerasFilter)
        .then((rawPhotos) => {
            const formattedPhotos = rawPhotos.map((p) => (
                {
                    src: p.image_url.replace("/upload", "/upload/f_auto,q_auto,w_800"),
                    width: p.width,
                    height: p.height,
                    alt: p.title || "photo"
                }
            ));

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

    }, [filmStocksFilter, camerasFilter]);

    function handleFilterToggle(filter: string, id: number) {

        if (filter == filters[0].name) {
            setFilmStocksFilter((prev) => 
                prev.includes(id) ? prev.filter((item) => item != id) : [...prev, id]
            );
        }

        if (filter == filters[1].name) {
            setCamerasFilter((prev) => 
                prev.includes(id) ? prev.filter((item) => item != id) : [...prev, id]
            );
        }

    }
    
    return (

        <main className="p-5 md:p-10">
            <h1
                className={`flex justify-center tracking-widest pb-5 text-xl md:pb-10 md:text-3xl`}
            >
                GALLERY
            </h1>

            

            <div
                className="flex flex-row md:justify-center md:gap-[20vw] py-5 md:p-10"
            >
                {filters.map((filter) => (
                    <details
                        key={filter.name}
                        className="p-5 italic tracking-widest hover:cursor-pointer"
                    >
                        <summary>{filter.name}</summary>
                        <div
                            className="flex flex-col fixed z-10 pt-5 md:p-5"
                        >
                            {filter.list.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleFilterToggle(filter.name, item.id)}
                                    className={`flex border-transparent p-5 hover:cursor-pointer hover:scale-120 hover:opacity-100 transition-all bg-white dark:bg-black ${filter.state.includes(item.id) ? 'opacity-100' : 'opacity-60'}`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </details>
                ))}
            </div>

            { 
                hasMounted ? 
                (
                    photos.length > 0 ?
                        <RowsPhotoAlbum
                            photos={photos}
                            targetRowHeight={rowHeight}
                            spacing={spacing}
                        />
                    :
                        <p className="flex max-w-screen justify-center p-20 tracking-widest italic">None</p>
                ) : (
                    <div className="flex justify-center pt-50 items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-800 dark:border-gray-200"></div>
                    </div>
                )
            }
            
        </main>

    );

};