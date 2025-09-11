"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Domains", href: "#domains" },
    { label: "Events", href: "#events" },
    { label: "Team", href: "#team" }
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            {/* First Logo */}
            <img
              src="/srm.webp"
              alt="Logo 1"
              className="h-8 w-8 object-contain"
            />

            {/* Second Logo */}
            <img
              src="/logo.webp"
              alt="Logo 2"
              className="h-8 w-8 object-contain"
            />

            {/* Title */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()} // prevents reload
              className="font-bold text-2xl md:text-3xl tracking-tighter"
            >
              <span className="text-white">SRM ACM </span>
              <span className="gradient-text">SIGAPP</span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors relative group text-sm md:text-base"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gradient-cyan to-gradient-violet transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="#contact">
              <Button
                variant="glass"
                size="sm"
                className="group px-3 py-1 text-sm"
              >
                <span>Contact Us</span>
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden w-9 h-9 glass rounded-lg flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-3 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-3">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors py-1 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="pt-3">
                <Button
                  variant="glass"
                  size="sm"
                  className="w-full px-3 py-1 text-sm"
                >
                  Join Now
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
