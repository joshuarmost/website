import React, { useState, useEffect } from 'react';
import { Camera, Instagram, Mail, Menu, X, ChevronLeft, ChevronRight, Moon, Sun, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';

const Home = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    src: `/images/${i + 1}.avif`,
    alt: `Project ${i + 1}`
  }));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setSelectedImage(images[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, currentImageIndex]);

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      
      {/* Header */}
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? darkMode ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-white/95 backdrop-blur-sm shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo - Center */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                JOSHUA MOST
              </h1>
              <p className={`text-xs sm:text-sm uppercase tracking-widest ${
                darkMode ? 'text-white' : 'text-black'
              }`}>
                Photography
              </p>
            </div>

            {/* Desktop Navigation - Right */}
            <nav className="hidden md:flex items-center space-x-8 ml-auto">
              <a 
                href="/" 
                className={`text-sm uppercase tracking-wider transition-colors hover:text-zinc-900`}
              >
                Home
              </a>
              <Link 
                to="/about" 
                className={`text-sm uppercase tracking-wider transition-colors hover:text-zinc-900`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm uppercase tracking-wider transition-colors hover:text-zinc-900`}
              >
                Contact
              </Link>
                            <Link 
                to="/dev" 
                className={`text-sm uppercase tracking-wider transition-colors hover:text-zinc-900`}
              >
                Dev
              </Link>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg transition-colors hover:bg-zinc-900"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </nav>

            {/* Mobile Menu Button - Right */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors ml-auto hover:bg-zinc-900"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? 'max-h-80 border-t' : 'max-h-0'
          } ${darkMode ? 'bg-black border-gray-900' : 'bg-white border-gray-900'}`}
        >
          <nav className="px-4 py-6 space-y-4">
            <a 
              href="/" 
              onClick={() => setMenuOpen(false)}
              className="block text-sm uppercase tracking-wider transition-colors hover:text-zinc-900"
            >
              Home
            </a>
            <Link 
              to="/about" 
              onClick={() => setMenuOpen(false)}
              className="block text-sm uppercase tracking-wider transition-colors hover:text-zinc-900"
            >
              About
            </Link>
            <Link 
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="block text-sm uppercase tracking-wider transition-colors hover:text-zinc-900"
            >
              Contact
            </Link>
                        <Link 
              to="/dev"
              onClick={() => setMenuOpen(false)}
              className="block text-sm uppercase tracking-wider transition-colors hover:text-zinc-900"
            >
              Dev
            </Link>
            
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center space-x-2 text-sm uppercase tracking-wider w-full hover:text-zinc-900"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section with Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(/images/home.avif)`,
            filter: 'brightness(0.7)'
          }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 animate-fade-in">
            Capturing Moments
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl mb-8 animate-fade-in-delay">
            Through the Lens
          </p>
          <a 
            href="#portfolio"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-black rounded-full hover:bg-zinc-900 transition-all transform hover:scale-105"
          >
            <Camera className="w-5 h-5" />
            <span className="font-medium">View Portfolio</span>
          </a>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
          Portfolio
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images.map((image, index) => (
            <div 
              key={image.id}
              onClick={() => openLightbox(index)}
              className={`group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer ${
                darkMode ? 'bg-black' : 'bg-white'
              }`}
            >
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-medium">View</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 ${darkMode ? 'bg-black border-t border-zinc-900' : 'bg-white border-t border-zinc-900'}`}>
        <div className="max-w-7xl mx-auto text-center space-y-4">

          <div className="flex justify-center space-x-4">
            <a 
              href="https://www.instagram.com/joshuarmost"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a 
              href="https://github.com/joshuarmost"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/joshua-most-947616307/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
          <p className={`text-sm ${darkMode ? 'text-white' : 'text-black'}`}>
            © {new Date().getFullYear()} Joshua Most Photography
          </p>
        </div>
      </footer>


      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-zinc-900 rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 p-2 text-white hover:bg-zinc-900 rounded-full transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 p-2 text-white hover:bg-zinc-900 rounded-full transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          
          <img 
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
