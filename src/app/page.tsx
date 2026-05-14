'use client';

import { useState, useEffect } from "react";
import "@/utils/animations"
import { fadeInAnimation } from "@/utils/animations";

export default function HomePage() {

  const [hasMounted, sethasMounted] = useState(false);

  const cloudinaryUrlPrefix = "https://res.cloudinary.com/drrafhtry/image/upload/f_auto,q_auto";

  const sloganLines = [
    "Advance",
    "Compose",
    "Shutter",
    "Repeat"
  ];

  const previewItems = [
    {
      src: "v1777867480/2604010007__notuny.jpg",
      caption: "Kodak Gold 200 120",
    },
    {
      src: "v1777133886/A010371-R1-29-29_um3qer.jpg",
      caption: "Kodak Colorplus 200",
    },
    {
      src: "v1778675701/A010158-R1-21-20_rtzv2k.jpg",
      caption: "Kodak Ultramax 400",
    },
    {
      src: "v1778675602/2603040003__upvch5.jpg",
      caption: "Fomapan 200",
    },
    {
      src: "v1778676498/A007008-R1-13-12_uyzgok.jpg",
      caption: "Kodak Gold 200",
    },
    {
      caption: "And more.",
      noImage: true,
    },
  ];

  useEffect(() => {
    sethasMounted(true);
  }, []);

  return (
    <main className={`flex flex-col md:flex-row w-[90%]`}>

      {/* Left side */}
      <div 
        className={`flex-1 text-right md:p-20 ${fadeInAnimation(hasMounted, "delay-100")}`}
      >
        <p className="share-tech-mono-regular text-4xl md:text-8xl py-10 md:py-20 md:-translate-x-50 md:translate-y-40">
          ANTONIUS
        </p>
        {sloganLines.map((line, index) => (
          <p 
            key={index}
            className="pt-2 md:pt-5 italic text-sm md:text-xl tracking-widest md:-translate-x-50 md:translate-y-40">
            {line}
          </p>
        ))}
      </div>

      {/* Right side */}
      <div className={`flex-1 grid md:grid-cols-3 md:grid-rows-2 gap-10 md:gap-20 p-10 md:p-20 text-xs font-light tracking-widest`}>
        {previewItems.map((item, index) => (
          <div
            key={index}
            className={`${item.noImage ? "flex items-center text-center" : "flex flex-col gap-4"} ${fadeInAnimation(hasMounted)}`}
            style={
              {
                transitionDelay: `${(item.noImage ? 400 : 200) * (index+1) + 200}ms`
              }
            }
          >
            {item.src && <img
              src={`${cloudinaryUrlPrefix}/${item.src}`}
              className="aspect-[2/3] object-cover md:hover:opacity-60 duration-200"
            />}
            <p>{item.caption}</p>
          </div>
        ))}
      </div>

    </main>
  );
}