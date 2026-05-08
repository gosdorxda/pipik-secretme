import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [displayKey, setDisplayKey] = useState(location);
  const [visibleChildren, setVisibleChildren] = useState(children);
  const [exiting, setExiting] = useState(false);
  const latestChildren = useRef(children);
  const latestLocation = useRef(location);

  latestChildren.current = children;
  latestLocation.current = location;

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

  useEffect(() => {
    if (location === displayKey) {
      if (exiting) setExiting(false);
      return;
    }

    setExiting(true);

    const timer = setTimeout(() => {
      setVisibleChildren(latestChildren.current);
      setDisplayKey(latestLocation.current);
      setExiting(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [location, displayKey]);

  useEffect(() => {
    if (!exiting) {
      setVisibleChildren(children);
    }
  }, [children, exiting]);

  return (
    <div key={displayKey} className={exiting ? "page-exit" : "page-enter"}>
      {visibleChildren}
    </div>
  );
}

export { PageTransition };
