"use client";

import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faDesktop } from '@fortawesome/free-solid-svg-icons';

const Button = ({ handler, children }: { handler: () => void; children: ReactNode }) => {
  return (
    <button
      type="button"
      className="bg-white dark:bg-gray-800 text-slate-900 border dark:border-gray-700 border-gray-200 dark:text-white flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors"
      onClick={handler}
    >
      {children}
    </button>
  );
};

export function ThemeSwitcher({ type }: { type?: "dark" | "light" | "system" }) {
  const { theme: currentTheme, setTheme } = useTheme();

  const handleToggleTheme = (theme: "dark" | "light" | "system") => {
    setTheme(theme);
  };

  if (type === "dark") {
    return (
      <Button handler={() => handleToggleTheme("dark")}>
        <FontAwesomeIcon icon={faMoon} className="h-4 w-4" />
      </Button>
    );
  }

  if (type === "light") {
    return (
      <Button handler={() => handleToggleTheme("light")}>
        <FontAwesomeIcon icon={faSun} className="h-4 w-4" />
      </Button>
    );
  }

  if (type === "system") {
    return (
      <Button handler={() => handleToggleTheme("system")}>
        <FontAwesomeIcon icon={faDesktop} className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button handler={() => handleToggleTheme(currentTheme === "dark" ? "light" : "dark")}>
      {currentTheme === "dark" ? (
        <FontAwesomeIcon icon={faSun} className="h-4 w-4" />
      ) : (
        <FontAwesomeIcon icon={faMoon} className="h-4 w-4" />
      )}
    </Button>
  );
}

export default ThemeSwitcher;
