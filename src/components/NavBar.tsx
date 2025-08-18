// src/components/NavBar.tsx
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);

  const linkClasses =
    "block px-4 py-2 text-lg hover:bg-green-800 md:hover:bg-transparent";

  return (
    <header className="bg-green-900 text-white fixed top-0 left-0 w-full z-50 print-hidden">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="font-bold text-xl" onClick={close}>
          Unnecessary PMI
        </Link>
        <button
          className="md:hidden"
          onClick={toggle}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className="hidden md:flex gap-6">
            <NavLink to="/quiz" className={({ isActive }) => (isActive ? "underline" : undefined)}>
            Check Eligibility
          </NavLink>
          <NavLink to="/learn" className={({ isActive }) => (isActive ? "underline" : undefined)}>
            Learn More
          </NavLink>
          <NavLink to="/take-action" className={({ isActive }) => (isActive ? "underline" : undefined)}>
            Take Action
          </NavLink>
        </nav>
      </div>
      {open && (
        <nav className="md:hidden border-t border-green-800">
          <NavLink to="/quiz" className={linkClasses} onClick={close}>
            Check Eligibility
          </NavLink>
          <NavLink to="/learn" className={linkClasses} onClick={close}>
            Learn More
          </NavLink>
          <NavLink to="/take-action" className={linkClasses} onClick={close}>
            Take Action
          </NavLink>
        </nav>
      )}
    </header>
  );
}
