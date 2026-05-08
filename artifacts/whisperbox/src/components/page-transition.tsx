import { useEffect } from "react";
import { useLocation } from "wouter";

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    const timer = setTimeout(() => {
      document.body.style.overflowY = "";
    }, 220);
    return () => {
      clearTimeout(timer);
      document.body.style.overflowY = "";
    };
  }, [location]);

  return (
    <div key={location} className="page-enter">
      {children}
    </div>
  );
}

export { PageTransition };
