"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Award } from "lucide-react";
import { ParticleSystem } from "@/components/ui/particles";

interface Certificate {
  id: string;
  eventName: string;
  eventIcon: string;
  description: string;
  certificateFile?: string;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    // Sample certificates data - you can fetch this from an API
    const sampleCertificates: Certificate[] = [
      {
        id: "escape-room",
        eventName: "AI Escape Room",
        eventIcon: "🏆",
        description: "Certificate of Participation - AI Escape Room Challenge 2025",
        certificateFile: "/certificates/ai-escape-room-certificate.pdf"
      },
      {
        id: "sense-actuate",
        eventName: "SENSE – ACTUATE'25",
        eventIcon: "🤖",
        description: "Certificate of Participation - Course Project Expo",
        certificateFile: "/certificates/sense-actuate-certificate.pdf"
      },
      {
        id: "genevoe",
        eventName: "Genevoe 24",
        eventIcon: "🧠",
        description: "Certificate of Participation - AI/ML Showcase",
        certificateFile: "/certificates/genevoe-certificate.pdf"
      }
    ];

    setCertificates(sampleCertificates);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 }
    }
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
            <span className="gradient-text">Event Certificates</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Download certificates from our amazing events and workshops
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              variants={cardVariants}
              whileHover="hover"
              className="glass p-8 rounded-2xl border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col group"
            >
              {/* Icon */}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {cert.eventIcon}
              </div>

              {/* Award Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-gradient-cyan" />
                <span className="text-sm font-semibold text-gradient-cyan">Certificate Available</span>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all">
                {cert.eventName}
              </h3>
              <p className="text-gray-300 mb-6 flex-grow">
                {cert.description}
              </p>

              {/* Download Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="hero"
                  className="w-full group/btn"
                  onClick={() => {
                    // Handle certificate download
                    if (cert.certificateFile) {
                      const link = document.createElement("a");
                      link.href = cert.certificateFile;
                      link.download = `${cert.eventName}-Certificate.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } else {
                      alert(`Certificate for ${cert.eventName} will be available soon!`);
                    }
                  }}
                >
                  <Download className="w-5 h-5 mr-2 group-hover/btn:translate-y-1 transition-transform" />
                  Download Certificate
                </Button>
              </motion.div>

              {/* Additional Info */}
              <p className="text-gray-500 text-xs mt-4 text-center">
                {cert.certificateFile ? "Ready to download" : "Coming soon"}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-lg">No certificates available yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Check back after our upcoming events!
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="glass p-8 rounded-2xl border-white/10 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Stay Updated!</h3>
            <p className="text-gray-300 mb-6">
              Participate in our events to earn certificates and showcase your skills
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => window.location.href = "/events"}
            >
              Explore Events
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Certificates;
