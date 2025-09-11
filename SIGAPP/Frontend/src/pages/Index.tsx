import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Domains from '@/components/Domains';
import Events from '@/components/Events';
import Team from '@/components/Team';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="gradient-bg">
      {/* Aurora Background Effect */}
      <div className="aurora-bg" />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="relative z-10">
        <section id="home">
          <Hero />
        </section>
        <section id="domains">
          <Domains />
        </section>
        <section id="events">
          <Events />
        </section>
        <section id="team">
          <Team />
        </section>
        <section id="contact">
          <Footer />
        </section>
      </main>
    </div>
  );
};

export default Index;
