"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ParticleSystem } from "@/components/ui/particles";

interface GalleryEvent {
  id: string;
  name: string;
  folder: string;
  icon: string;
}

const Gallery = () => {
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [media, setMedia] = useState<string[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const events: GalleryEvent[] = [
    {
      id: "escape-room",
      name: "AI Escape Room",
      folder: "aiescaperoom",
      icon: "🔐"
    },
    {
      id: "sense-actuate",
      name: "SENSE – ACTUATE'25",
      folder: "sense_actuate",
      icon: "🤖"
    },
    {
      id: "genevoe",
      name: "Genevoe 24",
      folder: "genevoe",
      icon: "🧠"
    }
  ];

  useEffect(() => {
    if (!selectedEvent) return;

    const loadMedia = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/events/${selectedEvent.folder}/`);
        const html = await response.text();
        const mediaRegex = /href="([^"]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov|avi|mkv))"/gi;
        const matches = html.matchAll(mediaRegex);
        const mediaFiles: string[] = [];

        for (const match of matches) {
          const filename = match[1];
          if (filename && !filename.includes("..")) {
            mediaFiles.push(`/events/${selectedEvent.folder}/${filename}`);
          }
        }

        setMedia(mediaFiles);
        setCurrentMediaIndex(0);
      } catch (error) {
        console.log("Could not load media files");
        setMedia([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedia();
  }, [selectedEvent]);

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi|mkv)$/i.test(url);

  const handlePrevious = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleNext = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: { y: -10, transition: { duration: 0.3 } }
  };

  return (
    <section className="py-20 relative bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Particles Background */}
      <ParticleSystem particleCount={40} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Event Gallery</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore photos and videos from our amazing events and showcases
          </p>
        </motion.div>

        {/* Event Selection Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {events.map((event) => (
            <motion.button
              key={event.id}
              variants={cardVariants}
              whileHover="hover"
              onClick={() => setSelectedEvent(event)}
              className="glass p-6 rounded-2xl border-white/10 hover:border-white/30 transition-all duration-300 text-left group"
            >
              <div className="text-5xl mb-4">{event.icon}</div>
              <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all">
                {event.name}
              </h3>
              <p className="text-gray-400 text-sm">
                Click to view gallery
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Media Gallery Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col relative border border-white/10 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gray-800/50">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span>{selectedEvent.icon}</span>
                    {selectedEvent.name} Gallery
                  </h3>
                  <p className="text-gray-400 mt-1">
                    {isLoading ? "Loading..." : `${media.length} ${media.length === 1 ? "item" : "items"}`}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Media Display */}
              <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-gradient-cyan rounded-full animate-spin" />
                    <p className="text-gray-400">Loading gallery...</p>
                  </div>
                ) : media.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentMediaIndex}
                        className="w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isVideo(media[currentMediaIndex]) ? (
                          <video
                            src={media[currentMediaIndex]}
                            controls
                            autoPlay
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <img
                            src={media[currentMediaIndex]}
                            alt={`Gallery item ${currentMediaIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Overlay */}
                    {media.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevious}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 rounded-lg transition-colors z-10 group"
                        >
                          <ChevronLeft className="w-8 h-8 text-white group-hover:text-gradient-cyan transition-colors" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 rounded-lg transition-colors z-10 group"
                        >
                          <ChevronRight className="w-8 h-8 text-white group-hover:text-gradient-cyan transition-colors" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 text-lg mb-4">No media files found for this event</p>
                    <p className="text-gray-500 text-sm">
                      Photos and videos will be added soon
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Controls */}
              {media.length > 0 && (
                <div className="p-6 bg-gray-800/50 border-t border-white/10">
                  {/* Counter and Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">
                      {currentMediaIndex + 1} / {media.length}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevious}
                        disabled={media.length <= 1}
                        className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={media.length <= 1}
                        className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Navigation Dots */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {media.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentMediaIndex
                            ? "bg-gradient-cyan scale-125"
                            : "bg-gray-600 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
