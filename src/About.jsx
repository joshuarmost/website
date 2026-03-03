import React, { useState, useEffect } from 'react';
import { Instagram, Mail, Moon, Sun, Menu, X, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';

const About = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen font-sans relative ${darkMode ? 'text-white' : 'text-black'}`}
      style={{
        backgroundImage: `url(/images/about.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Optional overlay for readability */}
      <div
        className={`absolute inset-0 ${
          darkMode ? 'bg-black/60' : 'bg-white/30'
        } backdrop-blur-sm`}
      />

      {/* Content wrapper */}
      <div className="relative z-10">

        {/* Header */}
        <header
          className={`fixed w-full top-0 z-50 transition-all duration-300 ${
            scrolled
              ? darkMode
                ? 'bg-black/95 backdrop-blur-sm shadow-lg'
                : 'bg-white/95 backdrop-blur-sm shadow-sm'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">

              {/* Logo - Center */}
              <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 text-center">
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
                  JOSHUA MOST
                </h1>
                <p className={`text-xs sm:text-sm uppercase tracking-widest ${darkMode ? 'text-white/80' : 'text-black/80'}`}>
                  Photography
                </p>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8 ml-auto">
                <Link to="/" className="text-sm uppercase tracking-wider transition-colors hover:text-zinc-900">
                  Home
                </Link>
                <Link to="/about" className="text-sm uppercase tracking-wider transition-colors hover:text-zinc-900">
                  About
                </Link>
                <Link to="/contact" className="text-sm uppercase tracking-wider transition-colors hover:text-zinc-900">
                  Contact
                </Link>
                <Link to="/dev" className="text-sm uppercase tracking-wider transition-colors hover:text-zinc-900">
                  Dev
                </Link>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg transition-colors hover:bg-zinc-900"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </nav>

              {/* Mobile Menu Button */}
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
              <Link to="/" onClick={() => setMenuOpen(false)} className="block text-sm uppercase tracking-wider hover:text-zinc-900">
                Home
              </Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="block text-sm uppercase tracking-wider hover:text-zinc-900">
                About
              </Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="block text-sm uppercase tracking-wider hover:text-zinc-900">
                Contact
              </Link>
              <Link to="/dev" onClick={() => setMenuOpen(false)} className="block text-sm uppercase tracking-wider hover:text-zinc-900">
                Dev
              </Link>
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

        {/* About Content */}
        <section id="about-content" className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">

              {/* Image */}
              <div className="order-2 lg:order-1 max-w-md mx-auto animate-fade-in">
                <img 
                  src={`/images/profile.webp`}
                  alt="Joshua Most"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* About Text */}
              <div className="order-1 lg:order-2 space-y-6 animate-fade-in-delay">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                  Hello There!
                </h2>
                <p className={`text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-black'}`}>
                  My name is Joshua Most. I am a passionate photographer dedicated
                  to capturing the beauty in everyday moments.
                </p>
                <p className={`text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-black'}`}>
                  Whether it's the quiet elegance of nature or the unique stories of
                  people, my goal is to capture images that convey emotion.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`} />
                    <a href="mailto:me@joshuamost.com" className="text-lg hover:text-zinc-900">
                      me@joshuamost.com
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Instagram className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`} />
                    <a 
                      href="https://www.instagram.com/joshuarmost" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg hover:text-zinc-900"
                    >
                      @joshuarmost
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Github className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`} />
                    <a 
                      href="https://github.com/joshuarmost" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg hover:text-zinc-900"
                    >
                      joshuarmost
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-12 px-4 ${darkMode ? 'bg-black/80 border-t border-zinc-900' : 'bg-white/80 border-t border-zinc-900'}`}>
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
            </div>
            <p className={`text-sm ${darkMode ? 'text-white' : 'text-black'}`}>
              © {new Date().getFullYear()} Joshua Most Photography
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;
