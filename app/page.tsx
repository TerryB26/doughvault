
import styles from './page.module.css'

export default function Home() {
  return (
    <div>
      <h1 className={styles.title}>
        Welcome to DoughVault
      </h1>
      <p className={styles.description}>
        Your personal finance management dashboard. Use the sidebar to navigate between different sections.
      </p>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          Getting Started
        </h2>
        <p className={styles.cardText}>
          Click the menu icon in the sidebar to toggle between collapsed and expanded views. 
          The sidebar includes navigation links for Home, Profile, and Settings.
        </p>
      </div>
    </div>
  );
}
