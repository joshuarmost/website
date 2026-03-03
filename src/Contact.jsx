import React, { useState, useEffect } from 'react';
import { Instagram, Mail, Moon, Sun, Send, Menu, X, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';

// Automatically use correct API URL for dev vs prod
const API_BASE =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5000";

const Contact = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [scrolled, setScrolled] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    setAnimate(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to send email');

      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/newsletter/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });

      if (!res.ok) throw new Error('Failed to sign up');

      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setNewsletterSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`min-h-screen font-sans relative ${
        darkMode ? 'text-white' : 'text-black'
      }`}
      style={{
        backgroundImage: `url(/images/contact.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background overlay */}
      <div
        className={`absolute inset-0 ${
          darkMode ? 'bg-black/60' : 'bg-white/30'
        } backdrop-blur-sm`}
      />

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

              {/* Logo */}
              <Link
                to="/"
                className="absolute left-1/2 transform -translate-x-1/2 text-center"
              >
                <h1
                  className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    darkMode ? 'text-white' : 'text-black'
                  }`}
                >
                  JOSHUA MOST
                </h1>
                <p
                  className={`text-xs sm:text-sm uppercase tracking-widest ${
                    darkMode ? 'text-white/80' : 'text-black/80'
                  }`}
                >
                  Photography
                </p>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8 ml-auto">
                <Link to="/" className="text-sm uppercase hover:text-zinc-900">Home</Link>
                <Link to="/about" className="text-sm uppercase hover:text-zinc-900">About</Link>
                <Link to="/contact" className="text-sm uppercase hover:text-zinc-900">Contact</Link>
                <Link to="/dev" className="text-sm uppercase hover:text-zinc-900">Dev</Link>

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

        {/* Contact Section */}
        <section id="contact-form" className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p
              className={`text-xl text-center mb-12 ${
                darkMode ? 'text-white' : 'text-gray-900'
              } ${animate ? 'animate-fade-in' : ''}`}
            >
              Have a project in mind? I'd love to hear from you.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Contact Form */}
              <div
                className={`p-8 rounded-lg ${
                  darkMode ? 'bg-zinc-900/90' : 'bg-white/90'
                } ${animate ? 'animate-fade-in-delay' : ''}`}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {['name', 'email', 'subject'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-2 capitalize">
                        {field}
                      </label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg outline-none ${
                          darkMode
                            ? 'bg-black border border-black-800 focus:ring-2 focus:ring-black-700'
                            : 'bg-white border border-black-300 focus:ring-2 focus:ring-black-900'
                        }`}
                        placeholder={`Your ${field}`}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg outline-none resize-none ${
                        darkMode
                          ? 'bg-black border border-black-800 focus:ring-2 focus:ring-black-700'
                          : 'bg-white border border-black-300 focus:ring-2 focus:ring-black-900'
                      }`}
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-medium ${
                      darkMode
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                    <span>{submitted ? 'Sent!' : 'Send Message'}</span>
                  </button>
                </form>
              </div>

              {/* Contact Info + Newsletter */}
              <div className={`space-y-8 ${animate ? 'animate-fade-in-delay' : ''}`}>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                  <p
                    className={`text-lg leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-black'
                    }`}
                  >
                    Feel free to reach out directly via email or through the
                    form. I typically respond within 24-48 hours.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail
                      className={`w-6 h-6 ${
                        darkMode ? 'text-gray-300' : 'text-black'
                      }`}
                    />
                    <a
                      href="mailto:me@joshuamost.com"
                      className="text-lg hover:text-zinc-900"
                    >
                      me@joshuamost.com
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Instagram
                      className={`w-6 h-6 ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}
                    />
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
                    <Github
                      className={`w-6 h-6 ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}
                    />
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

                {/* Commented out for the time being because I don't have a newsletter */}
                {/* Newsletter Signup 
                <div
                  className={`mt-8 p-6 rounded-lg ${
                    darkMode ? 'bg-zinc-900/90' : 'bg-white/90'
                  } ${animate ? 'animate-fade-in-delay' : ''}`}
                >
                  <h3 className="text-xl font-bold mb-4">
                    Sign up for future news!
                  </h3>

                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex flex-col space-y-4"
                  >
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Your email"
                      className={`w-full px-4 py-3 rounded-lg outline-none ${
                        darkMode
                          ? 'bg-black border border-black-800 focus:ring-2 focus:ring-black-700'
                          : 'bg-white border border-black-300 focus:ring-2 focus:ring-black-900'
                      }`}
                    />

                    <button
                      type="submit"
                      className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium ${
                        darkMode
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-zinc-900'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                      <span>
                        {newsletterSubmitted ? 'Subscribed!' : 'Subscribe'}
                      </span>
                    </button>
                  </form>
                </div> */}

              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`py-12 px-4 ${
            darkMode
              ? 'bg-black/80 border-t border-zinc-900'
              : 'bg-white/80 border-t border-zinc-900'
          } ${animate ? 'animate-fade-in-delay' : ''}`}
        >
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
            </div>

            <p
              className={`text-sm ${
                darkMode ? 'text-white' : 'text-black'
              }`}
            >
              © {new Date().getFullYear()} Joshua Most Photography
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Contact;
