'use client'

import React from 'react'
import Sidebar, { SidebarProvider, useSidebar } from './sidebar/index'
import styles from '../layout.module.css'

interface LayoutContentProps {
  children: React.ReactNode
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  const { isCollapsed } = useSidebar()

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={`${styles.mainArea} ${isCollapsed ? styles.mainAreaCollapsed : ''}`}>
        <main className={styles.main}>
          <div className={styles.content}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

interface ClientLayoutWrapperProps {
  children: React.ReactNode
}

const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}

export default ClientLayoutWrapper
