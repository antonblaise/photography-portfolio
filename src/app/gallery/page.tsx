'use client';

import { getPhotos, getFilmStocks, getCameras } from "@/utils/actions";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import { useEffect, useState } from "react";
import "@/utils/animations";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

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
            options: filmStocks,
            state: filmStocksFilter,
            setState: setFilmStocksFilter
        },
        {
            name: "Cameras",
            options: cameras,
            state: camerasFilter,
            setState: setCamerasFilter
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
                {
                    filters.map((filter) => (
                        <Listbox key={filter.name} value={filter.state} onChange={filter.setState} multiple>
                            <ListboxButton
                                className={`flex flex-row`}
                            >
                                <span
                                    className="tracking-widest italic px-5 cursor-pointer hover:scale-120 transition-all ease-out duration-200"
                                >{`> ${filter.name}`}</span>
                                {
                                    filter.state.length > 0
                                    &&
                                    <div>
                                        <span
                                            className="ml-2 bg-black text-white dark:bg-white dark:text-black text-xs px-2 py-0.5 rounded-full"
                                        >
                                            {filter.state.length}
                                        </span>
                                        <span>
                                            <button
                                                type="button"
                                                className="px-5 translate-y-1 cursor-pointer opacity-50 scale-120 hover:scale-150 transition-all ease-out duration-200"
                                                onClick={() => filter.setState([])}
                                            >
                                                <i className="fi fi-sr-cross-circle" />
                                            </button>
                                            
                                        </span>
                                    </div>
                                }
                            </ListboxButton>

                            <ListboxOptions
                                anchor="bottom start"
                                className="space-y-2 translate-y-5"
                            >
                                {
                                    filter.options.map((option) => (
                                        <ListboxOption
                                            key={option.id}
                                            value={option.id}
                                            className="
                                                italic tracking-widest text-sm flex p-5 select-none justify-between cursor-pointer opacity-60 bg-black text-white dark:bg-white dark:text-black
                                                transition-all ease-out duration-200
                                                data-[focus]:text-yellow-500 data-[focus]:text-xl data-[focus]:opacity-100
                                                data-[selected]:opacity-100 data-[selected]:font-bold
                                            "
                                        >
                                            <span>{option.name}</span>
                                        </ListboxOption>
                                    ))
                                }

                            </ListboxOptions>
                        </Listbox>
                    ))
                }
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