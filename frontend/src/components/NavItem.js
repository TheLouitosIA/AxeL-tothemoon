// src/components/NavItem.js
import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({ to, icon: Icon, label, activeClass }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? `nav-link ${activeClass}` : "nav-link")}
      aria-label={label}
    >
      <Icon className="icon" />
      <span className="link-text">{label}</span>
    </NavLink>
  );
};

export default NavItem;