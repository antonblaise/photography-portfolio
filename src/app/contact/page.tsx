'use client';

import { useState, useEffect } from "react";
import "@/utils/animations";
import { fadeInAnimation } from "@/utils/animations";

export default function ContactPage() {

    const [hasMounted, setHasMounted] = useState(false);

    const overallDelayMs: number = 300;

    const contactLinks = [
        {
            url: "https://github.com/antonblaise",
            icon: "fi fi-brands-github"
        },
        {
            url: "https://www.instagram.com/la_voir_seer",
            icon: "fi fi-brands-instagram"
        },
        {
            url: "https://www.linkedin.com/in/ha-how-ung-722766181/",
            icon: "fi fi-brands-linkedin"
        },
        {
            url: "mailto:antoniusblaise@gmail.com",
            icon: "fi fi-rr-envelope"
        },
        {
            url: "https://www.youtube.com/@antoniusblaise",
            icon: "fi fi-brands-youtube"
        },
        {
            url: "https://www.facebook.com/antoniusblaise/",
            icon: "fi fi-brands-facebook"
        }
    ];

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return (
        <main
            className={`min-h-[80vh] md:px-100 pt-15 md:py-50 flex grid md:grid-cols-3 md:grid-rows-2 items-center justify-center ${fadeInAnimation(hasMounted)}`}
        >
            {hasMounted && contactLinks.map((link, index) => (
                <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center p-10 md:p-30 text-2xl md:text-5xl md:hover:scale-120 duration-200"
                                style={
              {
                transitionDelay: `${100 * (index+1) + overallDelayMs}ms`
              }
            }
                >
                    <i className={link.icon}/>
                </a>
            ))}
        </main>
    );
}