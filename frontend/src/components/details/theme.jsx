import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Theme = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 h-screen w-full flex items-center justify-center">
      {loading? (
        <h1 className="text-2xl font-bold">
          <span className="text-blue-500">XYZ Stock  </span>
          <span className="text-gray-500">management</span>
        </h1>
      ) : (
        <Navigate to="/index" replace={true} />
      )}
    </div>
  );
};

export default Theme;