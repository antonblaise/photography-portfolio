import { getPhotos } from "@/utils/actions";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

export default async function GalleryPage() {
  const rawPhotos = await getPhotos();

  const photos = rawPhotos.map((p) => ({
    src: p.image_url,
    width: p.width,
    height: p.height,
    alt: p.title || "", 
  }));

  return (
    <main className="p-10">
      <h1 className="mb-10 text-xl font-light tracking-widest uppercase">Gallery</h1>
      
      <RowsPhotoAlbum 
        photos={photos} 
        targetRowHeight={250} 
      />
    </main>
  );
}