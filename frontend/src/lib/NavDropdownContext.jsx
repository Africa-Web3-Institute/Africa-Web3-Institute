// src/lib/NavDropdownContext.jsx
import { createContext, useContext, useState } from "react";

const NavDropdownContext = createContext();

export function NavDropdownProvider({ children }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  return (
    <NavDropdownContext.Provider value={{ activeDropdown, setActiveDropdown }}>
      {children}
    </NavDropdownContext.Provider>
  );
}

export function useNavDropdown() {
  const context = useContext(NavDropdownContext);
  if (!context) {
    throw new Error("useNavDropdown must be used within a NavDropdownProvider");
  }
  return context;
}