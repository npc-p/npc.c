import { useNavigate } from 'react-router-dom'
import type { Project } from '../types'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  onDelete: (e: React.MouseEvent, projectId: string) => void
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate = useNavigate()
  const totalExpenses = project.expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className={styles.card} onClick={() => navigate(`/project/${project.id}`)}>
      <button
        className={styles.deleteBtn}
        onClick={(e) => onDelete(e, project.id)}
        title="删除项目"
      >
        🗑️
      </button>
      <div className={styles.name}>{project.name}</div>
      {project.description && (
        <div className={styles.description}>{project.description}</div>
      )}
      <div className={styles.meta}>
        <span className={styles.metaItem}>👥 {project.members.length} 名成员</span>
        <span className={styles.metaItem}>💳 {project.expenses.length} 笔账</span>
        <span className={styles.metaItem}>
          💰 ¥{totalExpenses.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={styles.metaItem}>
          📅 {new Date(project.createdAt).toLocaleDateString('zh-CN')}
        </span>
      </div>
    </div>
  )
}
