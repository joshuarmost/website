import React, { useEffect, useState } from 'react';
import { Instagram, Moon, Sun, Menu, X, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

const Dev = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch dev posts
  useEffect(() => {
    fetch('/api/devPosts') // backend route
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className={`min-h-screen font-sans relative overflow-x-hidden ${darkMode ? 'text-white' : 'text-black'}`}
      style={{
        backgroundImage: `url(/images/dev.avif)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay so image stays consistent in light/dark */}
      <div className={`${darkMode ? 'bg-black/60' : 'bg-white/30'} absolute inset-0 backdrop-blur-sm`} />

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
                <Link to="/" className="text-sm uppercase tracking-wider hover:text-zinc-900">Home</Link>
                <Link to="/about" className="text-sm uppercase tracking-wider hover:text-zinc-900">About</Link>
                <Link to="/contact" className="text-sm uppercase tracking-wider hover:text-zinc-900">Contact</Link>
                <Link to="/dev" className="text-sm uppercase tracking-wider hover:text-zinc-900">Dev</Link>
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-zinc-900">
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

        {/* Dev Content */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
          <h1 className="text-5xl font-bold text-center mb-12 animate-fade-in">Dev Journal</h1>

          {loading && <p className="text-center text-lg text-gray-400">Loading posts...</p>}

          {!loading && posts.map(post => (
            <div
              key={post.id}
              className={`p-8 rounded-lg shadow-lg animate-fade-in ${darkMode ? 'bg-zinc-900/90' : 'bg-white/90'} overflow-hidden`}
            >
              <h2 className="text-2xl font-bold mb-2 break-words">{post.title}</h2>
              <p className="text-sm text-gray-400 mb-4">{post.date}</p>
              <div className="prose max-w-full break-words overflow-hidden">
                <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        {!loading && (
          <footer className={`py-12 px-4 ${darkMode ? 'bg-black/80 border-t border-zinc-900' : 'bg-white/80 border-t border-zinc-900'}`}>
            <div className="max-w-7xl mx-auto text-center space-y-4">
              <div className="flex justify-center space-x-4">
                <a
                  href="https://www.instagram.com/joshuarmost"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://github.com/joshuarmost"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/joshua-most-947616307/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
              <p className={`text-sm ${darkMode ? 'text-white' : 'text-black'}`}>
                © {new Date().getFullYear()} Joshua Most Photography
              </p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Dev;
