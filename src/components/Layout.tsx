import { type ReactNode } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAppContext } from '../store/AppContext'
import styles from './Layout.module.css'

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { getProject } = useAppContext()

  // Extract current projectId from URL
  const currentProjectId = location.pathname.match(/\/project\/([^/]+)/)?.[1]
  const project = currentProjectId ? getProject(currentProjectId) : undefined

  const isHome = location.pathname === '/'

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link to="/">
          <div className={styles.sidebarTitle}>
            <span>📒</span> 团队记账
          </div>
        </Link>

        <Link
          to="/"
          className={`${styles.navLink} ${isHome ? styles.navLinkActive : ''}`}
        >
          📋 所有项目
        </Link>

        {project && (
          <>
            <div className={styles.navSection}>
              <div className={styles.navSectionLabel}>当前项目</div>
              <div style={{ padding: '0 14px', marginBottom: 12, fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                {project.name}
              </div>
              <Link
                to={`/project/${project.id}`}
                className={`${styles.navLink} ${
                  location.pathname === `/project/${project.id}` ? styles.navLinkActive : ''
                }`}
              >
                💰 记账管理
              </Link>
              <Link
                to={`/project/${project.id}/categories`}
                className={`${styles.navLink} ${
                  location.pathname === `/project/${project.id}/categories` ? styles.navLinkActive : ''
                }`}
              >
                🏷️ 分类管理
              </Link>
            </div>
          </>
        )}
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
