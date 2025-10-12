import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { ParticleSystem } from "@/components/ui/particles";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  const navigate = useNavigate();

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

  const events = [
    {
      id: 1,
      type: "Escape Room",
      title: "AI Escape Room",
      description: "Solve Codes from clues, collaborate with your team, and break free before time runs out.",
      date: "To be revealed soon",
      time: "To be revealed soon",
      location: "To be revealed soon",
      gradient: "from-gradient-cyan to-gradient-blue",
      poster: "/Poster_02.webp",
    },
    {
      id: 2,
      type: "Course Project Expo",
      title: "SENSE – ACTUATE'25",
      description: "ACM SIGAPP, in association with the Department of Networking and Communications, successfully organized SENSE – ACTUATE'25: Budding Ideas That Move the Real World, a Course Project Expo held on 28th April 2025 at Tech Park 1 (Rooms 404–405). The event showcased a diverse range of innovative IoT-based projects developed by students, featuring creative solutions that integrated sensors, actuators, and microcontrollers to tackle real-world challenges through automation and smart technologies. Under the guidance of convenors Dr. K. Kalaiselvi, Dr. Vaishnavi Moorthy, and Dr. P. Gouthaman, and with the support of an esteemed advisory team led by Dr. Revathi Venkataraman, the expo provided a platform for students to demonstrate their technical expertise, creativity, and problem-solving skills. The initiative reflected ACM SIGAPP's ongoing commitment to promoting applied computing, fostering innovation, and nurturing the next generation of technology leaders.",
      date: "28th April 2025",
      time: "Completed",
      location: "Tech Park 1 (Rooms 404–405)",
      gradient: "from-gradient-green to-gradient-teal",
      poster: "/events/sense_actuate/SENSE - ACTUATE'2025.webp",
    },
    {
      id: 3,
      type: "AI/ML Showcase",
      title: "Genevoe 24",
      description: "Provided a platform for students to showcase their AI/ML projects, research, and innovative ideas. Organized as a project presentation and demonstration event with expert evaluations. Featured Dr. Vaishnavi Moorthy (ACM Mentor) and Mr. Murali Sundaram (Industry Expert) as judges. Offered students valuable feedback, constructive criticism, and real-world industry perspectives. Helped participants improve their problem-solving, research, and presentation skills. Enabled networking opportunities with experts and peers for future collaborations. Set a strong precedent for future chapter initiatives promoting innovation and interdisciplinary learning.",
      date: "Completed",
      time: "Completed",
      location: "SRMIST",
      gradient: "from-gradient-purple to-gradient-pink",
      poster: "/events/genevoe/genevoe poster1.jpg",
    },
    // Add more events here as needed
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Particles Background */}
      <ParticleSystem particleCount={50} />

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-300 hover:text-white group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
        </motion.div>

        {/* Page Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Events</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover exciting events and challenges where innovation meets collaboration
          </p>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map((event, index) => (
          <motion.div
            key={event.id}
            variants={cardVariants}
            className="glass p-8 rounded-2xl hover:glass-hover transition-all duration-300 group border-white/10 relative overflow-hidden mb-8"
            whileHover={{ y: -8 }}
            onClick={(e) => e.stopPropagation()}
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
              <h2 className="text-3xl font-bold mb-4 text-white group-hover:gradient-text transition-all">
                {event.title}
              </h2>

              {/* Event Poster */}
              <div className="mb-6 flex justify-center">
                <img 
                  src={event.poster} 
                  alt={`${event.title} Poster`} 
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

              {/* Action Button */}
              <div className="flex justify-center">
                {event.date === "Completed" || event.time === "Completed" ? (
                  <Button variant="outline" size="lg" className="group border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white">
                    <span>Event Completed</span>
                  </Button>
                ) : (
                  <Button variant="hero" size="lg" className="group">
                    <span>Register Now</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="glass p-8 rounded-2xl border-white/10">
            <h3 className="text-2xl font-bold mb-4 gradient-text">More Events Coming Soon!</h3>
            <p className="text-gray-300">
              Stay tuned for more exciting events and challenges. Follow us for updates!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventsPage;
