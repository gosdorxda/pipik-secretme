import { useLocation } from "wouter";

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <div key={location} className="page-enter">
      {children}
    </div>
  );
}

export { PageTransition };
