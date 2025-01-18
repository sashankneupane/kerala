"use client";
import React, { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import Head from 'next/head';

const playfair = Playfair_Display({ subsets: ["latin"] });

const IMAGES: string[] = [];
for (let i = 1; i <= 68; i++) {
  IMAGES.push(`/images/project2/${i}.jpg`);
}

// Different size options for grid items
const sizeClasses = [
  { cols: 1, rows: 1 }, // normal
  { cols: 2, rows: 1 }, // wide
  { cols: 1, rows: 2 }, // tall
  { cols: 2, rows: 2 }, // large
];

interface ImageItem {
  src: string;
  size: typeof sizeClasses[number];
}

export default function Project2Page() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleImages, setVisibleImages] = useState<ImageItem[]>([]);
  const imagesPerPage = 12;

  // Initialize randomized images on mount
  useEffect(() => {
    const randomizedImages = IMAGES.map(src => ({
      src,
      // Weighted random to choose size
      size: sizeClasses[Math.floor(Math.random() * (
        Math.random() < 0.7 ? 1 : sizeClasses.length
      ))]
    }));

    // Shuffle
    const shuffled = [...randomizedImages].sort(() => Math.random() - 0.5);

    setImages(shuffled);
    setVisibleImages(shuffled.slice(0, imagesPerPage));
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleImages(prev => [
            ...prev,
            ...images.slice(prev.length, prev.length + imagesPerPage)
          ]);
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [images, imagesPerPage]);

  // Track scrollY to fade in background overlay
  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Overlay up to 0.7 after ~800px
  const overlayOpacity = Math.min(scrollY / 800, 0.7).toFixed(2);

  // Generate styles for each grid item based on its size
  const getGalleryItemStyle = (size: typeof sizeClasses[number]) => ({
    ...galleryItemStyle,
    gridColumn: `span ${size.cols}`,
    gridRow: `span ${size.rows}`,
    height: "100%",
  });

  // Add playfair font to styles
  const titleStyle: React.CSSProperties = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    color: "#fff",
    fontFamily: playfair.style.fontFamily,
  };

  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={pageContainerStyle}>
        {/* Dark overlay that increases with scroll */}
        <div
          style={{
            ...backgroundOverlayStyle,
            backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
          }}
        />

        {/* Add Title Section */}
        <section style={heroSectionStyle}>
          <h1 style={titleStyle}>Project Gallery</h1>
        </section>

      {/* New Author / Description Section */}
      <section style={authorSectionStyle}>
        <div style={authorContainerStyle}>
          {/* Portrait */}
          <div style={portraitContainerStyle}>
            <Image
              src="/dp/Timothy.jpeg"
              alt="Author Portrait"
              width={300}
              height={300}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>

          {/* Description */}
          <div style={authorTextContainerStyle}>
            <h2 style={authorNameStyle}>By: Timothy Chiu</h2>
            <p style={authorDescriptionStyle}>
              Timothy Chiu is a hobbyist street photographer that enjoys capturing the stories of everyday life in his travels. In Kerala, his photo project aims to record the intimate moments of people and activity and the rich colors and textures found everywhere in India.
            </p>
          </div>
        </div>
      </section>
      
        {/* Photo Collage */}
        <section style={gallerySectionStyle}>
          <div style={galleryGridStyle}>
            {visibleImages.map((image, idx) => (
              <div 
                style={getGalleryItemStyle(image.size)} 
                key={idx}
                className="gallery-item"
                onClick={() => setSelectedImage(image.src)}
              >
                <Image
                  src={image.src}
                  alt={`Gallery ${idx}`}
                  width={500}
                  height={500}
                  style={{
                    ...galleryImageStyle,
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            ))}
            {/* sentinel for intersection observer */}
            <div id="sentinel" style={{ height: "20px" }} />
          </div>
        </section>

        {/* Full Screen Modal */}
        {selectedImage && (
          <div 
            style={modalOverlayStyle}
            onClick={() => setSelectedImage(null)}
          >
            <Image 
              src={selectedImage} 
              alt="Full screen view"
              width={1200}
              height={900}
              style={modalImageStyle}
            />
          </div>
        )}

        <style jsx>{`
          .gallery-item {
            transition: all 0.3s ease;
          }

          .gallery-item:hover {
            transform: scale(1.1);
            z-index: 10;
          }
          .gallery-item:hover ~ .gallery-item {
            transform: scale(0.85);
          }
        `}</style>
      </div>
    </>
  );
}

/* ------------------ STYLES ------------------ */

const pageContainerStyle: React.CSSProperties = {
  position: "relative",
  minHeight: "200vh", // enough room to scroll
  background: "url('/images/IMG_3429.jpg') no-repeat center center / cover",
  overflow: "hidden",
};

const backgroundOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
};

const gallerySectionStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  padding: "2rem",
  backgroundColor: "rgba(0,0,0,0.1)",
};

const galleryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "1rem",
  gridAutoRows: "250px", // Base row height
};

const galleryItemStyle: React.CSSProperties = {
  borderRadius: "4px",
  overflow: "hidden",
  cursor: "pointer",
  position: "relative",
  transition: "transform 0.3s ease-in-out",
};

const galleryImageStyle: React.CSSProperties = {
  display: "block",
  objectFit: "cover",
  transition: "transform 0.3s ease-in-out",
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  cursor: 'pointer'
};

const modalImageStyle: React.CSSProperties = {
  maxWidth: '90%',
  maxHeight: '90vh',
  objectFit: 'contain'
};

const heroSectionStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  padding: "4rem 2rem",
  textAlign: "center",
  backgroundColor: "rgba(0,0,0,0.3)",
};
// Author / Description Section
const authorSectionStyle: React.CSSProperties = {
    minHeight: "70vh",
    background: "#f8f8f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  };
  
  const authorContainerStyle: React.CSSProperties = {
    maxWidth: "1000px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
    alignItems: "center",
    justifyContent: "center",
  };
  
  const portraitContainerStyle: React.CSSProperties = {
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    overflow: "hidden",
    flexShrink: 0,
  };
  
  const authorTextContainerStyle: React.CSSProperties = {
    flex: 1,
  };
  
  const authorNameStyle: React.CSSProperties = {
    fontSize: "2rem",
    marginBottom: "1rem",
    fontFamily: playfair.style.fontFamily,
  };
  
  const authorDescriptionStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    lineHeight: 1.6,
    color: "#333",
    fontFamily: playfair.style.fontFamily,
  };