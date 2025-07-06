import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDark(savedTheme === "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {isDark ? (
        <>
          <SunIcon className="w-5 h-5 text-yellow-400" />
          <span className="text-sm">Light Mode</span>
        </>
      ) : (
        <>
          <MoonIcon className="w-5 h-5 text-blue-500" />
          <span className="text-sm">Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default DarkModeToggle;

