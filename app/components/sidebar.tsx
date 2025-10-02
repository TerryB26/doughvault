"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiOutlineClose, AiOutlineHome, AiOutlineMenu } from "react-icons/ai";
import { useSidebar } from "./sidebar-context";
import styles from "./sidebar/sidebar.module.css";

interface NavLink {
  displayName: string;
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navLinks: NavLink[] = [
  {
    displayName: "Home",
    link: "/",
    icon: AiOutlineHome,
  },
];

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <div
      className={`${styles.sidebar} ${
        isCollapsed ? styles.collapsed : styles.expanded
      }`}
    >
      <div className={styles.header}>
        {!isCollapsed && <h2 className={styles.title}>DoughVault</h2>}
        <button
          onClick={toggleSidebar}
          className={styles.toggleButton}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <AiOutlineMenu size={20} />
          ) : (
            <AiOutlineClose size={20} />
          )}
        </button>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navLinks.map((navItem, index) => {
            const IconComponent = navItem.icon;
            const isActive = pathname === navItem.link;
            return (
              <li key={index} className={styles.navItem}>
                <Link
                  href={navItem.link}
                  className={`${styles.navLink} ${
                    isActive ? styles.active : ""
                  }`}
                  title={isCollapsed ? navItem.displayName : undefined}
                >
                  <IconComponent size={20} className={styles.icon} />
                  {!isCollapsed && (
                    <span className={styles.navText}>
                      {navItem.displayName}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
