"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useSidebar } from "./sidebar-context";
import {
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineMenu,
  AiOutlineDashboard
} from "react-icons/ai";
import { MdInventory, MdAdminPanelSettings } from "react-icons/md";
import { useUserRoles } from "@/lib/hooks/useAuth";

import styles from "./sidebar.module.css";

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
  {
    displayName: "Administration",
    link: "/admin",
    icon: MdAdminPanelSettings,
  },
  {
    displayName: "Dashboard",
    link: "/dashboard",
    icon: AiOutlineDashboard,
  },
{
    displayName: "Stocks",
    link: "/stock",
    icon: MdInventory,
  },

];

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const { isAdmin } = useUserRoles();

  // Filter nav links based on user role
  const filteredNavLinks = navLinks.filter((navItem) => {
    // Hide Administration link for non-admin users
    if (navItem.link === "/admin" && !isAdmin) {
      return false;
    }
    return true;
  });

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
          {filteredNavLinks.map((navItem, index) => {
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
