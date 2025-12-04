import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Certificates from '@/components/Certificates';
import Footer from '@/components/Footer';

const CertificatesPage = () => {
    const navigate = useNavigate();

    return (
        <div className="gradient-bg">
            {/* Aurora Background Effect */}
            <div className="aurora-bg" />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="relative z-10 pt-16">
                {/* Back Button */}
                <div className="container mx-auto px-6 pt-8">
                    <motion.button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Back to Home</span>
                        <Home className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                    </motion.button>
                </div>

                <Certificates />
                <section id="contact">
                    <Footer />
                </section>
            </main>
        </div>
    );
};

export default CertificatesPage;
