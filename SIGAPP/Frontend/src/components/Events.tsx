"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { ParticleSystem } from "@/components/ui/particles"; // Imported glitter particles background

const Events = () => {
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
    title: "Escape Room Challenge",
    description: "Solve puzzles, collaborate with your team, and break free before time runs out.",
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
            className="glass p-8 rounded-2xl hover:glass-hover transition-all duration-300 group border-white/10 relative overflow-hidden"
            whileHover={{ y: -8 }}
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

        {/* View All Events CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Button variant="hero" size="xl" className="group">
            <span>View All Events</span>
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
