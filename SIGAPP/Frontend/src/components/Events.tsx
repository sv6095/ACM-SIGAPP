"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRight, Pause, Play } from "lucide-react";
import { ParticleSystem } from "@/components/ui/particles"; // Imported glitter particles background

const Events = () => {
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // All event images for carousel
  const allEventImages = [
    {
      src: "/events/sense_actuate/sense actuate2.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/sense_actuate/sense actuate3.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/sense_actuate/sense actuate4.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/sense_actuate/sense actuate5.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/sense_actuate/sense actuate6.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/sense_actuate/sa7.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/sense_actuate/sa8.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/sense_actuate/sa9.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/sense_actuate/sa10.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/sense_actuate/sa11.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/sense_actuate/sa12.jpg",
      title: "SENSE – ACTUATE'25",
      type: "Event Gallery"
    },
    {
      src: "/events/genevoe/genevoe1.png",
      title: "Genevoe 24",
      type: "Event Gallery"
    },
    {
      src: "/events/genevoe/genevoe2.png",
      title: "Genevoe 24",
      type: "Event Gallery"
    },
    {
      src: "/events/genevoe/genevoe 3.jpg",
      title: "Genevoe 24",
      type: "Event Gallery"
    },
    {
      src: "/events/genevoe/genevoe 4.jpg",
      title: "Genevoe 24",
      type: "Event Gallery"
    },
    {
      src: "/events/genevoe/genevoe 5.jpg",
      title: "Genevoe 24",
      type: "Event Gallery"
    },
    {
      src: "/events/genevoe/genevoe 6.jpg",
      title: "Genevoe 24",
      type: "Event Gallery"
    },
    {
      src: "/events/genevoe/genevoe 7.jpg",
      title: "Genevoe 24",
      type: "Event Gallery"
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allEventImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling, allEventImages.length]);

  // Scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320 + 16; // card width + gap
      const scrollPosition = currentIndex * cardWidth;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const event = {
    type: "Escape Room",
    title: "AI Escape Room",
    description: "Solve Codes from clues,collaborate with your team, and break free before time runs out.",
    date: "To be revealed soon",
    time: "To be revealed soon",
    location: "To be revealed soon",
    gradient: "from-gradient-cyan to-gradient-blue",
  };

  return (
    <section className="py-20 relative bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Glitter Particles Background */}
      <ParticleSystem particleCount={50} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Upcoming Event</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join us for an exciting challenge where teamwork and problem-solving meet adventure
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={cardVariants}
            className="glass p-8 rounded-2xl hover:glass-hover transition-all duration-300 group border-white/10 relative overflow-hidden cursor-pointer"
            whileHover={{ y: -8 }}
            onClick={() => window.open('/events', '_self')}
          >
            {/* Background Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

            {/* Event Type Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${event.gradient} bg-opacity-20 border border-white/20`}>
                <span className="text-sm font-semibold text-white">
                  {event.type}
                </span>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full glass">
                <ArrowRight className="w-6 h-6 text-gradient-cyan group-hover:text-gradient-violet transition-colors" />
              </div>
            </div>

            {/* Event Title */}
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:gradient-text transition-all">
              {event.title}
            </h3>

            {/* Event Poster */}
            <div className="mb-6 flex justify-center">
              <img 
                src="/Poster_02.webp" 
                alt="AI Escape Room Poster" 
                className="w-3/4 max-w-md h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Event Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              {event.description}
            </p>

            {/* Event Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <Calendar className="w-4 h-4 mr-3 text-gradient-cyan" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Clock className="w-4 h-4 mr-3 text-gradient-cyan" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-gradient-cyan" />
                <span>{event.location}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Event Images Carousel */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">
              <span className="gradient-text">Event Gallery</span>
            </h3>
            <p className="text-gray-300">
              Explore moments from our events and showcases
            </p>
          </div>
          
          <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {/* Auto-scroll controls */}
            <div className="flex justify-center mb-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className="border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
              >
                {isAutoScrolling ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isAutoScrolling ? 'Pause' : 'Play'}
              </Button>
            </div>

            {/* Carousel container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {allEventImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-72 sm:w-80 h-40 sm:h-48 rounded-lg overflow-hidden group cursor-pointer snap-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h4 className="text-white font-semibold text-xs sm:text-sm mb-1">{image.title}</h4>
                      <p className="text-gray-300 text-xs">{image.type}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center mt-4 gap-2">
              {allEventImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-gradient-cyan scale-125' 
                      : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* View All Events CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Button variant="hero" size="xl" className="group" onClick={() => window.open('/events', '_self')}>
            <span>View All Events</span>
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
