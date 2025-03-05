import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Typography } from "@/components/Typography";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Typography variant="h1" className={["text-muted"]}>
          404
        </Typography>
        <Typography variant="p" className={[" text-gray-600"]}>
          Oops! Page not found
        </Typography>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
