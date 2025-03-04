'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageData {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  width?: number;
  height?: number;
}

type LayoutType = 'B' | 'S' | 'M';

interface PhotoGridProps {
  images: ImageData[];
  className?: string;
  enableFullScreen?: boolean;
  type?: LayoutType;
  showLayoutToggle?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;  // Added showSubtitle prop
}

const FullScreenImage = ({ src, alt, title, subtitle, description, onClose }: { 
  src: string; 
  alt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  onClose: () => void 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [, setDimensions] = useState({ width: 0, height: 0 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 overflow-hidden"
      onClick={onClose}
    >
      {/* Add blurred background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${src})`,
          filter: 'blur(20px) brightness(0.3)',
          transform: 'scale(1.1)', // Prevent blur edges from showing
        }}
      />
      
      <motion.div
        className="relative w-full h-full max-h-screen flex items-center justify-center p-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="relative group max-w-full max-h-full">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-900/80 rounded-lg animate-pulse flex items-center justify-center">
              <div className="w-full h-[85vh] max-w-[1200px] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-lg" />
              </div>
            </div>
          )}
          <Image
            src={src}
            alt={alt || ""}
            className={`w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            width={1200}
            height={800}
            priority
            onLoadingComplete={({ naturalWidth, naturalHeight }) => {
              setDimensions({ width: naturalWidth, height: naturalHeight });
              setIsLoading(false);
            }}
          />
          {!isLoading && (title || subtitle || description) && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 rounded-b-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="max-w-full [text-shadow:_0_1px_3px_rgba(0,0,0,0.9)]">
                {title && <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-1 md:mb-2">{title}</h2>}
                {subtitle && <h3 className="text-sm md:text-base lg:text-lg text-white mb-1 md:mb-2">{subtitle}</h3>}
                {description && <p className="text-xs md:text-sm lg:text-base text-white/95 leading-relaxed line-clamp-3">{description}</p>}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const LayoutIcon = ({ type }: { type: LayoutType }) => {
  switch (type) {
    case 'B':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="5" height="12" rx="1" />
          <rect x="9" y="2" width="5" height="12" rx="1" />
        </svg>
      );
    case 'S':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="3" height="3" rx="0.5" />
          <rect x="6.5" y="2" width="3" height="3" rx="0.5" />
          <rect x="11" y="2" width="3" height="3" rx="0.5" />
          <rect x="2" y="6.5" width="3" height="3" rx="0.5" />
          <rect x="6.5" y="6.5" width="3" height="3" rx="0.5" />
          <rect x="11" y="6.5" width="3" height="3" rx="0.5" />
          <rect x="2" y="11" width="3" height="3" rx="0.5" />
          <rect x="6.5" y="11" width="3" height="3" rx="0.5" />
          <rect x="11" y="11" width="3" height="3" rx="0.5" />
        </svg>
      );
    case 'M':
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="3.5" height="5" rx="0.5" />
          <rect x="6.5" y="2" width="3.5" height="7" rx="0.5" />
          <rect x="11" y="2" width="3" height="4" rx="0.5" />
          <rect x="2" y="8" width="3.5" height="6" rx="0.5" />
          <rect x="6.5" y="10" width="3.5" height="4" rx="0.5" />
          <rect x="11" y="7" width="3" height="7" rx="0.5" />
        </svg>
      );
  }
};

export default function PhotoGrid({
  images,
  className = "",
  enableFullScreen = true,
  type,
  showLayoutToggle,
  showTitle = true  // Default to true for backward compatibility
}: PhotoGridProps) {
  const [layout, setLayout] = useState<LayoutType>(type || 'M');
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [isInView, setIsInView] = useState(true); // Changed default to true
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only update isInView when element leaves viewport completely
        if (!entry.isIntersecting) {
          setIsInView(false);
        } else {
          setIsInView(true);
        }
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    );

    const currentRef = gridRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [layout]); // Add layout as dependency to re-observe after layout changes

  const getGridClass = () => {
    switch(layout) {
      case 'B':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 'S':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
      case 'M':
      default:
        return 'columns-1 md:columns-2 lg:columns-3 gap-4';
    }
  };

  return (
    <div ref={gridRef} className="relative min-h-[200px]"> {/* Added min-height to ensure visibility */}
      <AnimatePresence>
        {isInView && showLayoutToggle && (
          <motion.div 
            className="fixed bottom-4 right-4 z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }} // smoother transition
          >
            <div className="bg-transparent hover:bg-black/40 rounded-full p-1.5 backdrop-blur-sm group">
              <div className="flex flex-col gap-2">
                {(['B', 'S', 'M'] as LayoutType[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLayout(l)}
                    className={`p-2 rounded-full transition-all duration-500 ${
                      layout === l 
                        ? 'block text-white' 
                        : 'hidden group-hover:block text-white/40 hover:text-white'
                    }`}
                  >
                    <LayoutIcon type={l} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${getGridClass()} ${className}`}>
        {images.map((image, idx) => (
          <motion.div
            key={image.src}
            className={`relative ${layout !== 'M' ? 'aspect-square' : 'mb-4'} group`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div 
              className="relative h-full overflow-hidden rounded-lg cursor-pointer"
              onClick={() => enableFullScreen && setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt || ""}
                width={800}
                height={800}
                className={`w-full h-full object-cover ${layout !== 'M' ? 'aspect-square' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="transform transition-all duration-300 group-hover:translate-y-[-8px] [text-shadow:_0_1px_3px_rgba(0,0,0,0.9)]">
                    {image.title && (
                      <h3 className={`text-white font-medium text-lg mb-1 transition-all duration-300
                        ${!showTitle ? 'opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0' : 'opacity-100'}
                      `}>
                        {image.title}
                      </h3>
                    )}
                    {image.subtitle && (
                      <h4 className={`text-white text-sm mb-3 transition-all duration-300
                        ${!showTitle ? 'opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0' : 'opacity-90'}
                      `}>
                        {image.subtitle}
                      </h4>
                    )}
                    {image.description && (
                      <p className="text-white/90 text-sm transform transition-all duration-300 
                        opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <FullScreenImage
            src={selectedImage.src}
            alt={selectedImage.alt}
            title={selectedImage.title}
            subtitle={selectedImage.subtitle}
            description={selectedImage.description}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}