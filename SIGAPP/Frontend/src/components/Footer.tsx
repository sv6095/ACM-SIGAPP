import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {  
  Linkedin, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone,
  Send
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/company/srm-acm-sigapp/", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/srmacmsigapp/", label: "Instagram" }
  ];

  const quickLinks = [
    { label: "About", href: "#about" },
    { label: "Events", href: "#events" },
    { label: "Team", href: "#team" },
    { label: "Domain", href: "#domains" }
  ];

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("⚠️ Please enter an email");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Subscribed successfully!");
        setEmail("");
      } else {
        setMessage("❌ " + (data.error || "Failed to subscribe"));
      }
    } catch (err) {
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative py-20 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className="text-3xl font-bold gradient-text mb-4">
               SRM ACM SIGAPP
              </h3>
              <p className="text-gray-300 leading-relaxed">
                A community of students passionate about applied computing, technology innovation, 
                research, and real-world problem solving. We empower members through workshops, projects, 
                and collaborative learning.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-gradient-cyan" />
                <span>SRMIST, Kattankulathur</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-gradient-cyan" />
                <span>srmacmsigapp@gmail.com</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-6 gradient-text-alt">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-gray-300 hover:text-gradient-cyan transition-colors py-2 hover:translate-x-1 transition-transform"
                  whileHover={{ x: 4 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-6 gradient-text-alt">
              Stay Updated
            </h4>
            <p className="text-gray-300 mb-6">
              Subscribe to get updates about our projects, events, and tech workshops.
            </p>
            
            <div className="glass p-6 rounded-xl border border-gradient-cyan/30 hover:border-gradient-violet/50 transition-all">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-transparent border-white/20 text-white placeholder:text-gray-400 focus:border-gradient-cyan/50"
                />
                <Button 
                  variant="hero" 
                  size="default"
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="gradient-bg-animated group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              {message && (
                <p className="text-xs text-gray-400 mt-3">{message}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Social Links & Copyright */}
        <motion.div
          className="border-t border-white/10 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-12 h-12 glass rounded-full flex items-center justify-center hover:glass-hover transition-all group float"
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <social.icon className="w-5 h-5 text-gray-300 group-hover:text-gradient-cyan transition-colors" />
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2025 ACM SIGAPP, SRMIST KTR. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Built by ACM SIGAPP Web Team.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gradient-cyan/5 to-transparent pointer-events-none" />
    </footer>
  );
};

export default Footer;
