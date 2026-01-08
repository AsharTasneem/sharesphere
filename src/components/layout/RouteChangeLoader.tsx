import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Loader from "@/components/layout/Loader";

interface Props {
  children: React.ReactNode;
}

export default function RouteChangeLoader({ children }: Props) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;

    // Only show loader if the path has changed AND involves the landing page
    if (prevPath !== currentPath) {
      if (prevPath === "/" || currentPath === "/") {
        setLoading(true);
        const timeout = setTimeout(() => {
          setLoading(false);
        }, 1500); // 1.5s is usually enough for a polished feel

        prevPathRef.current = currentPath;
        return () => clearTimeout(timeout);
      }
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[100] bg-surface">
          <Loader />
        </div>
      )}
      {children}
    </>
  );
}
