"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Grid3X3, Sparkles, Loader2, ZoomIn } from "lucide-react";
import { ParticleSystem } from "@/components/ui/particles";

interface GalleryEvent {
  id: string;
  name: string;
  folder: string;
  color: string;
  description: string;
}

// Use Vite's glob import to dynamically load all images from events folders
const aiEscapeRoomImages = import.meta.glob('/public/events/aiescaperoom/*.(jpg|jpeg|png|gif|webp|JPG|JPEG|PNG)', { eager: true, query: '?url', import: 'default' });
const senseActuateImages = import.meta.glob('/public/events/sense_actuate/*.(jpg|jpeg|png|gif|webp|JPG|JPEG|PNG)', { eager: true, query: '?url', import: 'default' });
const genevoeImages = import.meta.glob('/public/events/genevoe/*.(jpg|jpeg|png|gif|webp|JPG|JPEG|PNG)', { eager: true, query: '?url', import: 'default' });

// Convert glob imports to arrays of image URLs
const getImageUrls = (globResult: Record<string, unknown>): string[] => {
  return Object.entries(globResult).map(([path]) => {
    return path.replace('/public', '');
  });
};

const Gallery = () => {
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [eventImages, setEventImages] = useState<Record<string, string[]>>({});
  const [imageLoading, setImageLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('grid'); // Start with grid view

  // Initialize image URLs from glob imports
  useEffect(() => {
    setEventImages({
      'escape-room': getImageUrls(aiEscapeRoomImages),
      'sense-actuate': getImageUrls(senseActuateImages),
      'genevoe': getImageUrls(genevoeImages)
    });
  }, []);

  // Define events
  const events: GalleryEvent[] = [
    {
      id: "escape-room",
      name: "AI Escape Room",
      folder: "aiescaperoom",
      color: "from-cyan-500 to-blue-600",
      description: "Navigate through AI-powered puzzles and challenges"
    },
    {
      id: "sense-actuate",
      name: "SENSE – ACTUATE'25",
      folder: "sense_actuate",
      color: "from-violet-500 to-purple-600",
      description: "IoT and robotics project showcase"
    },
    {
      id: "genevoe",
      name: "Genevoe 24",
      folder: "genevoe",
      color: "from-pink-500 to-rose-600",
      description: "AI/ML innovations and demonstrations"
    }
  ];

  const getImagesForEvent = (eventId: string): string[] => {
    return eventImages[eventId] || [];
  };

  const handlePrevious = () => {
    if (!selectedEvent) return;
    const images = getImagesForEvent(selectedEvent.id);
    setImageLoading(true);
    setCurrentMediaIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (!selectedEvent) return;
    const images = getImagesForEvent(selectedEvent.id);
    setImageLoading(true);
    setCurrentMediaIndex((prev) => (prev + 1) % images.length);
  };

  const openGallery = (event: GalleryEvent) => {
    setSelectedEvent(event);
    setCurrentMediaIndex(0);
    setViewMode('grid'); // Always open in grid view first
    setImageLoading(true);
  };

  const openSingleImage = (index: number) => {
    setCurrentMediaIndex(index);
    setViewMode('single');
    setImageLoading(true);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEvent]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedEvent) return;
      if (viewMode === 'single') {
        if (e.key === "ArrowLeft") handlePrevious();
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "Escape") setViewMode('grid');
      } else {
        if (e.key === "Escape") setSelectedEvent(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent, eventImages, viewMode]);

  return (
    <section className="py-24 relative bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <ParticleSystem particleCount={50} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-gray-300">Memories & Moments</span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">Event Gallery</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            Relive the excitement through photos from our incredible events
          </p>
        </motion.div>

        {/* Event Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          {events.map((event) => {
            const images = getImagesForEvent(event.id);
            return (
              <motion.button
                key={event.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                onMouseEnter={() => setHoveredCard(event.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => openGallery(event)}
                className="group relative text-left"
              >
                {/* Card Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${event.color} rounded-3xl opacity-0 group-hover:opacity-75 blur-lg transition-all duration-500`} />

                {/* Card */}
                <div className="relative h-full bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500 overflow-hidden">
                  {/* Preview Image */}
                  <div className="h-48 overflow-hidden bg-gray-800 relative">
                    {images.length > 0 ? (
                      <>
                        <img
                          src={images[0]}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <ZoomIn className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Grid3X3 className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {event.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="text-sm">{images.length} photos</span>
                      <motion.div animate={{ x: hoveredCard === event.id ? 5 : 0 }}>
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Bottom Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${event.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {(() => {
              const images = getImagesForEvent(selectedEvent.id);

              return (
                <div className="w-full h-full flex flex-col">
                  {/* Header */}
                  <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black">
                    <div className="flex items-center gap-4">
                      {viewMode === 'single' ? (
                        <button
                          onClick={() => setViewMode('grid')}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Grid3X3 className="w-5 h-5 text-gray-400" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedEvent(null)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 border border-white/20"
                        >
                          <ChevronLeft className="w-5 h-5 text-white" />
                          <span className="text-white font-medium">Back</span>
                        </button>
                      )}
                      <h3 className="text-xl font-bold text-white">
                        {selectedEvent.name}
                      </h3>
                      {viewMode === 'single' && (
                        <span className="text-gray-500">
                          {currentMediaIndex + 1} / {images.length}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400 hover:text-white" />
                    </button>
                  </div>

                  {/* Content */}
                  {viewMode === 'grid' ? (
                    /* Grid View */
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-7xl mx-auto">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => openSingleImage(index)}
                            className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 cursor-pointer hover:ring-2 hover:ring-cyan-400"
                          >
                            <img
                              src={image}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Single Image View */
                    <div className="flex-1 relative flex items-center justify-center bg-black">
                      {/* Close Button */}
                      <button
                        onClick={() => setViewMode('grid')}
                        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors z-20"
                      >
                        <X className="w-6 h-6 text-white" />
                      </button>

                      {/* Loading */}
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                        </div>
                      )}

                      {/* Image */}
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentMediaIndex}
                          src={images[currentMediaIndex]}
                          alt={`${selectedEvent.name} - ${currentMediaIndex + 1}`}
                          className="max-w-full max-h-full object-contain"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: imageLoading ? 0 : 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          onLoad={() => setImageLoading(false)}
                        />
                      </AnimatePresence>

                      {/* Navigation */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
                          >
                            <ChevronLeft className="w-6 h-6 text-white" />
                          </button>
                          <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
                          >
                            <ChevronRight className="w-6 h-6 text-white" />
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Bottom Thumbnails (Single View) */}
                  {
                    viewMode === 'single' && images.length > 1 && (
                      <div className="px-6 py-4 border-t border-white/10 bg-black/80 backdrop-blur-sm">
                        <div className="flex justify-center gap-2 overflow-x-auto py-1 scrollbar-hide">
                          {images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setImageLoading(true);
                                setCurrentMediaIndex(index);
                              }}
                              className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all ${index === currentMediaIndex
                                ? "ring-2 ring-cyan-400"
                                : "opacity-40 hover:opacity-100"
                                }`}
                            >
                              <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  }
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </section >
  );
};

export default Gallery;
