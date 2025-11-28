import React from 'react';
import HeroSection from '../components/hero-sec.jsx';
import MainPage from './main-page.jsx';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx'; 
export default function HomePage() {
  return (
    <div className=" bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <Navbar />
      <HeroSection />   
      <MainPage />
      <Footer />      
    </div>
  );
}
