"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Calendar, Clock, MapPin } from 'lucide-react';

interface EventBannerProps {
  eventUrl: string;
  expiryDate: string; // ISO string format
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  prizePool: string;
  registrationFee: string;
}

const EventBanner: React.FC<EventBannerProps> = ({
  eventUrl,
  expiryDate,
  title,
  description,
  date,
  time,
  location,
  prizePool,
  registrationFee
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Check if banner should be visible (before expiry date)
  useEffect(() => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    
    if (now < expiry) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [expiryDate]);


  const handleRegister = () => {
    window.open(eventUrl, '_blank');
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-purple-900 via-blue-900 to-cyan-900 border-b border-white/20 shadow-2xl"
        style={{ marginTop: '64px' }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Event Info - Larger */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                {title}
              </h3>
              
              <p className="text-gray-300 text-base mb-4 max-w-2xl">
                {description}
              </p>

              {/* Event Details - Larger */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gradient-cyan" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gradient-cyan" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gradient-cyan" />
                  <span>{location}</span>
                </div>
              </div>

              {/* Prize Info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gradient-cyan font-semibold">Prize Pool:</span>
                  <span className="text-white font-bold text-lg">{prizePool}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gradient-cyan font-semibold">Registration Fee:</span>
                  <span className="text-white font-bold text-lg">{registrationFee}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Larger */}
            <div className="flex flex-col items-center gap-4">
              <Button
                disabled
                size="lg"
                className="bg-gray-600 text-white font-bold px-8 py-3 text-lg rounded-xl transition-all duration-300 shadow-xl"
              >
                Completed
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventBanner;
