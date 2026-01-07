import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "@/components/layout/Loader";

interface Props {
  children: React.ReactNode;
}

export default function RouteChangeLoader({ children }: Props) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400); // adjust if needed

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}
      {!loading && children}
    </>
  );
}
