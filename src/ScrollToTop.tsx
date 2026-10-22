import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Delay until after the browser has painted the new route
    const id = requestAnimationFrame(() => {
      // Use a second frame in case images or fonts affect layout
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    });

    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
