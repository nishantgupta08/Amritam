"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const HeartScene = dynamic(() => import("./components/HeartScene"), {
  ssr: false,
});

// Component to fetch YouTube video title and description
function YouTubeVideoTitle({ videoId, defaultTitle }: { videoId: string; defaultTitle: string }) {
  const [title, setTitle] = useState(defaultTitle);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        // Using oEmbed API (no API key required)
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
        }
      } catch (error) {
        console.error(`Error fetching title for video ${videoId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchTitle();
  }, [videoId]);

  return <>{loading ? defaultTitle : title}</>;
}

// Component to fetch YouTube video description
function YouTubeVideoDescription({ videoId, defaultDescription }: { videoId: string; defaultDescription: string }) {
  const [description, setDescription] = useState(defaultDescription);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        // Fetch from our API route (server-side, more secure)
        const response = await fetch(`/api/youtube?videoId=${videoId}`);
        const data = await response.json();
        
        if (data && data.description) {
          // Clean up the description - remove extra whitespace and newlines
          let cleanDesc = data.description.trim();
          
          // Remove common YouTube description patterns
          cleanDesc = cleanDesc.replace(/Subscribe.*$/i, '');
          cleanDesc = cleanDesc.replace(/Follow us.*$/i, '');
          cleanDesc = cleanDesc.replace(/Like.*share.*subscribe/gi, '');
          
          // Truncate description to first 150 characters for display
          const truncatedDesc = cleanDesc.length > 150 
            ? cleanDesc.substring(0, 150).trim() + '...' 
            : cleanDesc.trim();
          
          if (truncatedDesc && truncatedDesc.length > 10) {
            setDescription(truncatedDesc);
          }
        }
      } catch (error) {
        console.error(`Error fetching description for video ${videoId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [videoId]);

  return <>{description}</>;
}

export default function Home() {
  const [doctorImageError, setDoctorImageError] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Amritam Heart Care Hospital" 
                width={60} 
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Doctors</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <a href="tel:108" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Emergency
              </a>
              <button className="md:hidden p-2 text-gray-700 hover:text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: 'url(/hero_bg.png)',
              backgroundPosition: 'center top',
              backgroundPositionY: '0px',
            }}
          ></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
                <span className="text-gray-900">Advanced</span>
                <br className="hidden sm:block" />
                <span className="text-gray-900">Cardiac Care</span>
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent">You Can Trust</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-800 max-w-xl leading-relaxed font-semibold">
                Multispecialty cardiac expertise powered by advanced technology and compassionate care for every patient.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_30px_rgba(59,130,246,0.6)] transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base border-2 border-white/20">
                  <span className="drop-shadow-sm">Book Cardiology Consultation</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="group px-6 py-3 bg-white/95 backdrop-blur-sm text-blue-600 font-bold rounded-xl border-[3px] border-blue-400 hover:bg-white hover:border-blue-500 hover:shadow-[0_8px_20px_rgba(59,130,246,0.3)] transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Get Expert Second Opinion</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-2 text-xs pt-4">
                <div className="p-1 bg-green-500/20 rounded-lg backdrop-blur-sm border border-green-400/30">
                  <svg className="w-4 h-4 text-green-600 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-bold text-gray-900">Appointments available today</span>
              </div>
            </div>

            {/* Right Side - Heart Image */}
            <div className="relative flex-shrink-0 w-full lg:w-auto flex flex-col items-center justify-center gap-0.5">
              {/* Tagline with pink heart icon */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full border-2 border-white/30 shadow-lg backdrop-blur-sm">
                <svg className="w-4 h-4 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-xs sm:text-sm text-white font-bold drop-shadow-md">Because Every Heartbeat Matters</span>
              </div>
              
              {/* Heart Image */}
              <div className="relative w-full sm:w-96 h-96 sm:h-96 lg:w-[480px] lg:h-[480px] xl:w-[600px] xl:h-[600px] flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Central Heart Image */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <HeartScene />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Credibility Bar - Full Width */}
          <div className="w-full mt-8 lg:mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Doctor Profile Card - Comprehensive Design */}
              <div className="lg:col-span-2 group bg-white rounded-3xl border-2 border-gray-100 shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col md:flex-row">
                  {/* Left Side - Doctor Photo */}
                  <div className="relative md:w-2/5 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6 md:p-8">
                    <div className="w-full max-w-56 h-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                      {!doctorImageError ? (
                        <Image 
                          src="/pankaj_goyal.png" 
                          alt="Dr. Pankaj Goyal - Senior Cardiologist" 
                          width={224} 
                          height={298}
                          className="w-full h-full object-cover"
                          onError={() => setDoctorImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                      )}
                </div>
              </div>
              
                  {/* Right Side - Doctor Info & Stats */}
                  <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                    {/* Doctor Name & Designation */}
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dr. Pankaj Goyal</h3>
                      <p className="text-base md:text-lg text-blue-700 font-semibold mb-1">MBBS, MD, DM (Gold Medalist)</p>
                      <p className="text-sm md:text-base text-gray-600 font-medium">Senior Consultant Cardiologist</p>
                      <p className="text-sm text-blue-600 font-semibold mt-2">Director - Amritam Heart Care</p>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Rating */}
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                          <span className="text-2xl font-bold text-yellow-900">4.9</span>
                </div>
                        <p className="text-xs text-yellow-700 font-semibold">Rating (Google)</p>
                </div>
                      
                      {/* Experience */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span className="text-2xl font-bold text-purple-900">25+</span>
                        </div>
                        <p className="text-xs text-purple-700 font-semibold">Years Experience</p>
              </div>
              
                      {/* Patients Treated */}
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                          <span className="text-2xl font-bold text-pink-900">1500+</span>
                </div>
                        <p className="text-xs text-pink-700 font-semibold">Patients Treated</p>
                      </div>
                      
                      {/* Hospital Rating */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <span className="text-2xl font-bold text-blue-900">NABH</span>
                        </div>
                        <p className="text-xs text-blue-700 font-semibold">Certified</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Emergency Care Card */}
              <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-200 shadow-xl hover:shadow-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg ring-4 ring-green-400/20 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-2">24/7 Emergency</h3>
                <p className="text-base md:text-lg font-semibold text-green-700 mb-4">Cardiac Care</p>
                <p className="text-sm text-green-600">Always available for urgent cardiac emergencies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Success Videos Section */}
      <section className="relative py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Advanced Medical Equipment Video Card */}
            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-pink-200 hover:border-pink-400">
              <div className="relative aspect-video bg-gray-900">
                <div className="absolute top-2 left-2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-600 text-white text-xs font-bold rounded-full shadow-md">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Technology
                  </span>
                </div>
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/xh1_Y02v8cg"
                  title="Advanced Medical Equipment"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-5 bg-gradient-to-br from-pink-50 to-red-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Advanced Cath Lab</h3>
                </div>
                <p className="text-sm text-gray-700 font-medium">NEW ADVANCED CATH LAB & CCU Care</p>
              </div>
            </div>

            {/* Patient Success Story Video Card 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2 border-blue-100 hover:border-blue-300 relative">
              <div className="absolute top-2 left-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  Success Story
                </span>
              </div>
              <div className="relative aspect-video bg-gray-900">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/WAQhacSLIh4"
                  title="Heart Surgery Success"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-5 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Heart Surgery</h3>
                </div>
                <p className="text-sm text-gray-600">Life-changing treatment</p>
              </div>
            </div>

            {/* Doctor Profile / Expert Card */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-400 hover:border-blue-500 relative group">
              <div className="absolute top-2 left-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-md border border-white/30">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Expert Team
                </span>
              </div>
              <div className="p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">Dr. Pankaj Goyal</h3>
                    <p className="text-blue-100 text-sm">MBBS, MD, DM (Gold Medalist)</p>
                    <p className="text-blue-50 text-xs mt-1">Sr. Consultant Cardiologist</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span className="text-blue-50">25+ Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-blue-50">Director: Amritam Heart Care</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <span>View Profile</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAA YOJANA Empanelment Section */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Announcement */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 rounded-full mb-6 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="text-white font-bold text-lg">मुख्यमंत्री आयुष्मान आरोग्य योजना</span>
            </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                  <span className="text-blue-600">Empanelled with </span>
                  <span className="text-pink-600">MAA YOJANA</span>
                  <br />
                  <span className="text-blue-600">for Cashless Treatment</span>
                </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    आयुष्मान योजना के तहत हृदय सम्बन्धी समस्याओ के लिए संपर्क करें
                  </p>
                </div>

          {/* Services & Contact Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-100">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side - Services */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  Services Offered
                </h3>
                <div className="space-y-3">
                    {['Angiography', 'Pacemaker / ICD / CRT', 'CCU / EP Study', 'Angioplasty', 'Ventilators & ABG', 'Well Trained Staff'].map((service, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm border border-blue-100 hover:border-blue-300 transition-colors">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      <span className="text-sm md:text-base text-gray-800 font-semibold">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

              {/* Right Side - MAA YOJANA Logo */}
              <div className="p-6 md:p-8 bg-white flex items-center justify-center">
                <div className="relative w-full max-w-xs">
                  <Image
                    src="/MAA_YOJANA.png"
                    alt="MAA YOJANA Logo - मुख्यमंत्री आयुष्मान आरोग्य योजना"
                    width={400}
                    height={400}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    priority
                  />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor's Blog & Educational Videos Section - Modern Design */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Modern Section Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm mb-6">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-600">Educational Resources</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Learn from Our{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Expert
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover expert insights through informative blogs and educational videos by Dr. Pankaj Goyal
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-100">
              <button className="px-8 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
                All Content
              </button>
            </div>
          </div>

          {/* Main Content Grid - Modern Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Featured Blog Post - Large Card */}
            <div className="lg:col-span-8">
              <article 
                onClick={() => setSelectedBlog('best-heart-hospitals')}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-8 sm:p-10 lg:p-12">
                  {/* Category & Meta */}
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Blog
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600 font-medium">Cardiology</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">7 min read</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                    <span className="text-red-600">List of the Best Heart</span>
                    <br />
                    <span className="text-blue-600">Specialist Hospitals in Jaipur</span>
                  </h1>

                  {/* Blog Image */}
                  <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-shadow duration-500">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src="/blog_1.png"
                        alt="List of the Best Heart Specialist Hospitals in Jaipur"
                        width={800}
                        height={450}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Description */}
                  <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
                    Discover Jaipur's top heart specialist hospitals, with Amritam Heart Care leading as the best heart hospital in Rajasthan. Learn about experienced cardiologists like Dr. Pankaj Goyal, advanced Cath Labs, emergency cardiac care, and comprehensive services.
                  </p>

                  {/* CTA Button */}
                  <div className="flex items-center gap-4">
                    <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group/btn">
                      <span>Read Full Article</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">7 min read</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar - Recent Posts & Videos */}
            <div className="lg:col-span-4 space-y-6">
              {/* Recent Posts Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Posts</h3>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Recent Post 1 */}
                  <a href="#" className="block group p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-blue-100">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 shadow-md group-hover:shadow-lg transition-shadow">
                        <Image
                          src="/blog_1.png"
                          alt="Blog post"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Blog</p>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          List of Heart Hospitals in Jaipur under Chiranjeevi and Maa Yojana
                        </h4>
                      </div>
                    </div>
                  </a>

                  {/* Recent Post 2 */}
                  <button 
                    onClick={() => setSelectedBlog('best-heart-hospitals')}
                    className="block w-full text-left group p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-blue-100"
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.318a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Blog</p>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          List of the Best Heart Specialist Hospitals in Jaipur
                        </h4>
                      </div>
                    </div>
                  </button>

                  {/* Recent Post 3 - Video */}
                  <a 
                    href="https://www.youtube.com/watch?v=ed36fCm-dNo" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block group p-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-red-100"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                        <img 
                          src={`https://img.youtube.com/vi/ed36fCm-dNo/hqdefault.jpg`}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://img.youtube.com/vi/ed36fCm-dNo/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors">
                          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-red-600 mb-1 font-semibold uppercase tracking-wide">Video</p>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                          <YouTubeVideoTitle videoId="ed36fCm-dNo" defaultTitle="Educational Video by Dr. Pankaj Goyal" />
                        </h4>
                      </div>
                    </div>
                  </a>

                  {/* Recent Post 4 */}
                  <a href="#" className="block group p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-blue-100">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Blog</p>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          What Makes Amritam Heart Care the Best Heart Hospital in Rajasthan?
                        </h4>
                      </div>
                    </div>
                  </a>
                </div>

                {/* View All Link */}
                <a href="#" className="mt-6 block text-center py-3 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  View All Posts →
                </a>
              </div>

              {/* Quick Video Access */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl shadow-xl border border-red-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Educational Videos
                </h3>
                <div className="space-y-3">
                  {[
                    { id: 'ed36fCm-dNo', title: 'Video 1' },
                    { id: 'j0UDwISKFy0', title: 'Video 2' },
                    { id: 'MgEi3bZyRrY', title: 'Video 3' }
                  ].map((video) => (
                    <a
                      key={video.id}
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors">
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                          <img 
                            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                            <YouTubeVideoTitle videoId={video.id} defaultTitle="Educational Video" />
                          </h4>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mixed Cards Section - Testimonials, Achievements, and More */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              A mix of patient testimonials, achievements, and success stories
            </p>
          </div>

          {/* Mixed Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial Card 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                &quot;Excellent care and treatment. The doctors are highly skilled and the staff is very caring.&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">RK</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Rajesh Kumar</h4>
                  <p className="text-sm text-gray-600">Cardiac Surgery Patient</p>
                </div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-white">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">50,000+</h3>
              <p className="text-blue-100">Lives Saved Successfully</p>
              <p className="text-sm text-blue-50 mt-2">Our commitment to excellence in cardiac care</p>
            </div>

            {/* Testimonial Card 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                &quot;Amritam Heart Care saved my father&apos;s life. The emergency response was quick and the treatment was world-class.&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-bold text-lg">PS</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Priya Sharma</h4>
                  <p className="text-sm text-gray-600">Emergency Care Patient</p>
                </div>
              </div>
            </div>

            {/* Video Testimonial Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="relative aspect-video bg-gray-900">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Video Testimonial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-1">Patient Success Story</h3>
                <p className="text-sm text-gray-600">Watch how we transformed a patient&apos;s life</p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-white">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">24/7</h3>
              <p className="text-red-100">Emergency Services</p>
              <p className="text-sm text-red-50 mt-2">Always here when you need us most</p>
            </div>

            {/* Testimonial Card 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                &quot;Best cardiology hospital in Rajasthan. Advanced technology and expert doctors. Highly recommend!&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">AP</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Amit Patel</h4>
                  <p className="text-sm text-gray-600">Cardiac Consultation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Centre of Excellence - Specialties Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-4">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="text-sm font-semibold text-blue-600">Centre of Excellence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Specialties
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Providing best patient health care services with expert doctors, diagnosis and treatment
            </p>
          </div>

          {/* Specialties Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Cardiology */}
            <div className="group bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Cardiology</h3>
              <p className="text-xs sm:text-sm text-gray-600">Expert heart care and treatment</p>
            </div>

            {/* Pediatric Cardiology */}
            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 sm:p-8 border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Pediatric Cardiology</h3>
              <p className="text-xs sm:text-sm text-gray-600">Children&apos;s heart care</p>
            </div>

            {/* Gastroenterology */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Gastroenterology</h3>
              <p className="text-xs sm:text-sm text-gray-600">Digestive health care</p>
            </div>

            {/* General Physician */}
            <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">General Physician</h3>
              <p className="text-xs sm:text-sm text-gray-600">Comprehensive primary care</p>
            </div>

            {/* Urology */}
            <div className="group bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 sm:p-8 border border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Urology</h3>
              <p className="text-xs sm:text-sm text-gray-600">Urinary system care</p>
            </div>

            {/* Nephrology */}
            <div className="group bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 sm:p-8 border border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Nephrology</h3>
              <p className="text-xs sm:text-sm text-gray-600">Kidney health care</p>
            </div>

            {/* Critical Care */}
            <div className="group bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 sm:p-8 border border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Critical Care</h3>
              <p className="text-xs sm:text-sm text-gray-600">Intensive care unit</p>
            </div>

            {/* Neurology */}
            <div className="group bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Neurology</h3>
              <p className="text-xs sm:text-sm text-gray-600">Brain and nerve care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - YouTube Videos & Cards Carousel */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-blue-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-100 mb-4">
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="text-sm font-semibold text-red-600">Patient Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from patients who trusted us with their heart care journey
            </p>
          </div>

          {/* YouTube Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Video 1 - Placeholder */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="relative aspect-video bg-gray-900">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Patient Testimonial 1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Success Story</h3>
                <p className="text-sm text-gray-600">Patient shares their recovery journey</p>
              </div>
            </div>

            {/* Video 2 - Placeholder */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="relative aspect-video bg-gray-900">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Patient Testimonial 2"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Heart Surgery Success</h3>
                <p className="text-sm text-gray-600">Life-changing treatment experience</p>
              </div>
            </div>

            {/* Video 3 - Placeholder */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="relative aspect-video bg-gray-900">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Patient Testimonial 3"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Expert Care</h3>
                <p className="text-sm text-gray-600">Compassionate medical team</p>
              </div>
            </div>
          </div>

          {/* Testimonial Cards Carousel */}
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
              Patient Reviews
            </h3>
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* Blog Modal */}
      {selectedBlog === 'best-heart-hospitals' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedBlog(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">List of the Best Heart Specialist Hospitals in Jaipur</h2>
              <button
                onClick={() => setSelectedBlog(null)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6 sm:p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Considered the <strong>best heart hospital in Rajasthan</strong>, it is a major center of cardiac care. There are many excellent cardiology centres in the city, recognized for utilising the latest treatments, employing seasoned doctors, and prioritising patient care. Planning to get heart care for you or your loved ones? We're here to help you pick the best ones.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Leading this group is <strong>Amritam Heart Care</strong>, which has earned a reputation as the <strong>best heart hospital in Rajasthan</strong> thanks to its premium patient service, advanced facilities, and renowned cardiologist, <strong>Dr. Pankaj Goyal</strong>.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">1. Amritam Heart Care</h3>
                  <p className="text-gray-700 mb-2"><strong>Location:</strong> B-39, Prabhu Marg, close to A.C. Market, Tilak Nagar, Jaipur</p>
                  <p className="text-gray-700 mb-2"><strong>Contact:</strong> +91 8934076703 | amritamheartcare@gmail.com</p>
                  <p className="text-gray-700 mb-2"><strong>Lead Cardiologist:</strong> Dr. Pankaj Goyal (MBBS, MD, DM, Gold Medalist)</p>
                  <p className="text-gray-700 mb-4">Over 25+ years of experience in cardiology.</p>

                  <p className="text-gray-700 mb-4">
                    Amritam Heart Care keeps earning the title of <strong>best heart hospital in Rajasthan</strong>, providing excellent heart treatments with kindness. As the gold medalist in cardiology, Dr. Goyal oversees a team that helps the hospital treat small and serious cardiac cases at any time.
                  </p>

                  <h4 className="font-bold text-gray-900 mb-2">Why Patients Choose Amritam Heart Care:</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    <li>Emergency care for heart problems at any time</li>
                    <li>The latest Cath Lab and diagnostic equipment are available for patients</li>
                    <li>Procedures that include angioplasty, putting in pacemakers, and replacing heart valves</li>
                    <li>Emergency care, critical care, and medical care in an ICU</li>
                    <li>Adapted plans and advice about lifestyle care that fits within your budget</li>
                  </ul>

                  <p className="text-gray-700">
                    To treat both the condition and its consequences, Amritam Heart Care fully delivers the advantages of being the <strong>best heart hospital in Rajasthan</strong>.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Other Top Heart Hospitals in Jaipur:</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-gray-300 pl-4">
                    <h4 className="font-bold text-gray-900 mb-1">2. EHCC Eternal Hospital</h4>
                    <p className="text-gray-700 text-sm">Many people also connect the EHCC hospital with the best heart hospital in Rajasthan, which is close to Jawahar Circle. The group's successful services and advanced resources enable them to handle cardiac operations and assist many patients.</p>
                  </div>

                  <div className="border-l-4 border-gray-300 pl-4">
                    <h4 className="font-bold text-gray-900 mb-1">3. Fortis Escorts Hospital in Jaipur</h4>
                    <p className="text-gray-700 text-sm">As a member of the Fortis network, this hospital has leading cardiac facilities and is thought of by visitors as one of the best heart hospital in Rajasthan. An advanced Cath Lab and expert specialists work here to treat emergency and critical patients.</p>
                  </div>

                  <div className="border-l-4 border-gray-300 pl-4">
                    <h4 className="font-bold text-gray-900 mb-1">4. Manipal Hospital in Jaipur</h4>
                    <p className="text-gray-700 text-sm">Manipal Hospital's many heart care services makes it one of the best heart hospital in Rajasthan. Because of its top infrastructure and professional doctors, Manipal offers both surgical and medical care for heart diseases.</p>
                  </div>

                  <div className="border-l-4 border-gray-300 pl-4">
                    <h4 className="font-bold text-gray-900 mb-1">5. Rukmani Birla Hospital</h4>
                    <p className="text-gray-700 text-sm">The CK Birla Heart Centre is at RBH, and the hospital is a leading candidate for the best heart hospital in Rajasthan. It handles open-heart procedures, treatments for heart valve problems, and heart health care programs.</p>
                  </div>

                  <div className="border-l-4 border-gray-300 pl-4">
                    <h4 className="font-bold text-gray-900 mb-1">6. Santokba Durlabhji Memorial Hospital</h4>
                    <p className="text-gray-700 text-sm">SDMH has long supported medical care for people in Jaipur. Thanks to its strong heart care and reasonable rates, it is the favoured choice for those aiming to find the best heart hospital in Rajasthan with a long history.</p>
                  </div>

                  <div className="border-l-4 border-gray-300 pl-4">
                    <h4 className="font-bold text-gray-900 mb-1">7. Soni Hospital–Heart Institute</h4>
                    <p className="text-gray-700 text-sm">On Tonk Road, Soni Hospital is famous for its inexpensive cardiac treatments and its emergency heart care, 24 hours a day. Most concerned about the budget often choose it, as it's regularly recommended among the best heart hospital in Rajasthan.</p>
                  </div>

                  <div className="border-l-4 border-gray-300 pl-4">
                    <h4 className="font-bold text-gray-900 mb-1">8. Surya Hospital</h4>
                    <p className="text-gray-700 text-sm">Even though it is a new company, Surya Hospital provides cardiology services with the latest tools and innovations. Because of the rising satisfaction of its patients, it is getting noticed as the best heart hospital in Rajasthan.</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What Sets a Hospital Apart as the Best Heart Hospital in Rajasthan?</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li><strong>1. Experienced Cardiologists:</strong> The top cardiologist should lead the hospital team. Dr. Pankaj Goyal at Amritam Heart Care is the best heart specialist in Rajasthan because of his long record and gold medal in cardiology.</li>
                    <li><strong>2. Emergency Heart Care:</strong> Heart emergencies cannot wait for a delay in action. Emergency services are available at all times, and a team for quick handling of stroke, heart attack, and cardiac arrest cases is a necessity.</li>
                    <li><strong>3. Advanced Infrastructure:</strong> All areas in the hospital, including Cath Labs, ICU units and ECG, 2D Echo, and TMT, require advanced and frequently updated equipment.</li>
                    <li><strong>4. Comprehensive Services:</strong> A hospital with cardiology services, recovery programs after surgery, and help for healthy living can be seen as the best heart hospital in Rajasthan.</li>
                    <li><strong>5. Taking care of the whole heart:</strong> Best heart hospital in Rajasthan strives to help the heart by serving personalized diets, providing rehabilitation aid, overseeing drug use, and educating patients.</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">The Reason Amritam Heart Care Is the Best</h3>
                  <p className="text-gray-700 mb-4">
                    Amritam Heart Care isn't like any other hospital—it is solely focused on heart care. Here are the reasons why Amritam Heart Care earns the name of the <strong>best heart hospital in Rajasthan</strong>:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Getting Expert Advice from a Gold Medalist:</strong> Dr. Pankaj Goyal's great leadership results in an exact diagnosis and a highly effective cure.</li>
                    <li>• <strong>Modern Cardiology Strategies:</strong> The hospital provides quality treatment for cases that include device closures, angioplasty, and ICD implant pairs.</li>
                    <li>• <strong>Caring for All:</strong> Patients in any ward can expect all-around comfort from the facility.</li>
                  </ul>
                  <p className="text-gray-700 mt-4">
                    It works to improve its facilities and processes, so it always remains at the forefront of the field.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Final Thoughts</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Any cardiac illness must be managed immediately, with experts and in advanced healthcare settings. Because of its reputable hospitals, Jaipur should be considered the <strong>best heart hospital in Rajasthan</strong>. Still, Amritam Heart Care stays on top because it brings together kindness, excellent care, and progress in heart care.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    That's why, when you need the <strong>best heart hospital in Rajasthan</strong>, you should remember these important points and start with Amritam Heart Care.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>7 min read</span>
              </div>
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Testimonial Carousel Component
function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Jaipur",
      rating: 5,
      text: "Excellent care and treatment. The doctors are highly skilled and the staff is very caring. My heart condition was treated successfully.",
      treatment: "Cardiac Surgery"
    },
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      text: "Amritam Heart Care saved my father's life. The emergency response was quick and the treatment was world-class. Forever grateful!",
      treatment: "Emergency Care"
    },
    {
      name: "Amit Patel",
      location: "Ajmer",
      rating: 5,
      text: "Best cardiology hospital in Rajasthan. Advanced technology and expert doctors. Highly recommend for any heart-related issues.",
      treatment: "Cardiac Consultation"
    },
    {
      name: "Sunita Mehta",
      location: "Kota",
      rating: 5,
      text: "The multispeciality approach here is amazing. They treated my mother with such compassion and expertise. Thank you team!",
      treatment: "Multispeciality Care"
    },
    {
      name: "Vikram Singh",
      location: "Udaipur",
      rating: 5,
      text: "Outstanding facilities and professional care. The new Cath Lab is state-of-the-art. Very satisfied with the treatment.",
      treatment: "Cardiac Intervention"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="min-w-full px-2">
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-200">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
                
                {/* Patient Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {testimonial.treatment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 z-10"
        aria-label="Previous testimonial"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 z-10"
        aria-label="Next testimonial"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

