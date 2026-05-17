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

    // State and data
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
                className="
                    flex 
                    justify-center 
                    tracking-widest 
                    pb-5 
                    text-xl 
                    md:pb-10 
                    md:text-3xl 
                "
            >
                GALLERY
            </h1>

            

            <div
                className="
                    flex flex-col md:flex-row items-center justify-center 
                    space-y-[5%] md:space-x-[40%] md:space-y-0 
                    py-5 md:p-10 
                "
            >
                {
                    filters.map((filter) => (
                        <Listbox key={filter.name} value={filter.state} onChange={filter.setState} multiple>
                            <div
                                className="
                                    flex flex-row items-center
                                "
                            >
                                <ListboxButton
                                    className="flex flex-row items-center"
                                >
                                    <span
                                        className="
                                            flex flex-row items-center tracking-widest 
                                            mx-2 md:mx-5 
                                            italic text-xs md:text-lg 
                                            cursor-pointer 
                                            hover:scale-120 
                                            transition-all ease-out duration-200 
                                        "
                                    >
                                        <i className="
                                                fi fi-rr-menu-burger 
                                                w-8 h-4 md:w-12 
                                                flex items-center justify-center 
                                            "
                                        />{filter.name}
                                    </span>
                                </ListboxButton>
                                {
                                    filter.state.length > 0
                                    &&
                                    <span
                                        className="
                                            mx-2 
                                            bg-black text-white 
                                            dark:bg-white dark:text-black 
                                            text-xs 
                                            scale-80 md:scale-100 
                                            px-2 py-0.5 
                                            rounded-full 
                                        "
                                    >
                                        {filter.state.length}
                                    </span>
                                }
                                {
                                    filter.state.length > 0
                                    &&
                                    <i 
                                        className="
                                            flex 
                                            fi fi-sr-cross-circle 
                                            opacity-50 md:scale-120 
                                            hover:scale-150 
                                            mx-2 
                                            transition-all ease-out duration-200 
                                        "
                                        onClick={() => filter.setState([])}
                                    />

                                }
                            </div>

                            <ListboxOptions
                                anchor="bottom start"
                                className="space-y-2 mt-5"
                            >
                                {
                                    filter.options.map((option) => (
                                        <ListboxOption
                                            key={option.id}
                                            value={option.id}
                                            className="
                                                flex justify-between 
                                                select-none cursor-pointer opacity-60 
                                                italic tracking-widest 
                                                bg-black text-white dark:bg-white dark:text-black 
                                                p-2 md:p-5 
                                                text-xs md:text-sm 
                                                transition-all ease-out duration-200 
                                                md:data-[focus]:text-yellow-500 md:data-[focus]:text-xl md:data-[focus]:opacity-100 
                                                data-[selected]:opacity-100 data-[selected]:font-bold data-[selected]:text-yellow-500 md:data-[selected]:text-white  
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