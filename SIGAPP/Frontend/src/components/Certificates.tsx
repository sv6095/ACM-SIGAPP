"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Award, ExternalLink, CheckCircle, Clock, Sparkles, Trophy, Medal } from "lucide-react";
import { ParticleSystem } from "@/components/ui/particles";

interface Certificate {
  id: string;
  eventName: string;
  description: string;
  certificateFile?: string;
  date: string;
  status: "available" | "coming-soon";
  color: string;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const sampleCertificates: Certificate[] = [
      {
        id: "escape-room",
        eventName: "AI Escape Room",
        description: "Certificate of Participation - AI Escape Room Challenge 2025",
        certificateFile: "/certificates/ai-escape-room-certificate.pdf",
        date: "November 2025",
        status: "coming-soon",
        color: "from-cyan-500 to-blue-600"
      },
      {
        id: "sense-actuate",
        eventName: "SENSE – ACTUATE'25",
        description: "Certificate of Participation - Course Project Expo",
        date: "February 2025",
        status: "coming-soon",
        color: "from-violet-500 to-purple-600"
      },
      {
        id: "genevoe",
        eventName: "Genevoe 24",
        description: "Certificate of Participation - AI/ML Showcase",
        date: "November 2024",
        status: "coming-soon",
        color: "from-pink-500 to-rose-600"
      }
    ];

    setCertificates(sampleCertificates);
  }, []);

  const handleDownload = async (cert: Certificate) => {
    if (!cert.certificateFile || cert.status !== "available") {
      return;
    }

    setDownloadingId(cert.id);

    // Simulate download delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const link = document.createElement("a");
    link.href = cert.certificateFile;
    link.download = `${cert.eventName}-Certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadingId(null);
  };

  return (
    <section className="py-24 relative bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <ParticleSystem particleCount={40} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">Achievements & Recognition</span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">Event Certificates</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Celebrate your achievements with official certificates from our events
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: "easeOut" }
                }
              }}
              className="group relative"
            >
              {/* Card Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${cert.color} rounded-3xl opacity-0 group-hover:opacity-50 blur-lg transition-all duration-500`} />

              {/* Main Card */}
              <div className="relative h-full bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500 overflow-hidden flex flex-col">
                {/* Top Ribbon */}
                <div className={`h-2 bg-gradient-to-r ${cert.color}`} />

                {/* Content */}
                <div className="relative p-8 flex-1 flex flex-col">
                  {/* Status Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${cert.status === "available"
                      ? "bg-emerald-500/10 border border-emerald-500/30"
                      : "bg-amber-500/10 border border-amber-500/30"
                      }`}>
                      {cert.status === "available" ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-medium text-emerald-400">Ready</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-medium text-amber-400">Coming Soon</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Event Name */}
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {cert.eventName}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors mb-6 flex-1">
                    {cert.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{cert.date}</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <motion.button
                    onClick={() => handleDownload(cert)}
                    disabled={downloadingId === cert.id || cert.status === "coming-soon"}
                    className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${cert.status === "available"
                      ? `bg-gradient-to-r ${cert.color} text-white hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-70`
                      : "bg-gray-800 text-gray-400 cursor-not-allowed"
                      }`}
                    whileHover={cert.status === "available" ? { scale: 1.02 } : {}}
                    whileTap={cert.status === "available" ? { scale: 0.98 } : {}}
                  >
                    {downloadingId === cert.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : cert.status === "available" ? (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download Certificate</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5" />
                        <span>Coming Soon</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${cert.color} opacity-20 rotate-45`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Award className="w-12 h-12 text-gray-600" />
            </div>
            <p className="text-gray-400 text-xl mb-2">No certificates available yet</p>
            <p className="text-gray-600">Check back after our upcoming events!</p>
          </motion.div>
        )}

        {/* Enhanced CTA Section */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-pink-500/20 rounded-3xl blur-xl" />

            {/* Card */}
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />

              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-300">Join Our Community</span>
              </motion.div>

              <h3 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                Ready to Earn Your Certificate?
              </h3>

              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Participate in our events to showcase your skills and earn official certificates of recognition
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
                  onClick={() => window.location.href = "/events"}
                >
                  <Medal className="w-5 h-5 mr-2" />
                  Explore Events
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-6 rounded-xl transition-all"
                  onClick={() => window.location.href = "#contact"}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Certificates;
