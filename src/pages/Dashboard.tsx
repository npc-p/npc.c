import { useState } from 'react'
import { useAppContext } from '../store/AppContext'
import Modal from '../components/Modal'
import ProjectCard from '../components/ProjectCard'
import ConfirmDialog from '../components/ConfirmDialog'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { state, addProject, deleteProject } = useAppContext()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    addProject(name.trim(), description.trim())
    setName('')
    setDescription('')
    setShowCreate(false)
  }

  const handleDelete = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation()
    setDeleteId(projectId)
  }

  const confirmDelete = () => {
    if (deleteId) {
      deleteProject(deleteId)
      setDeleteId(null)
    }
  }

  const projects = state.projects

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>📋 项目列表</h1>
        <button className={styles.addBtn} onClick={() => setShowCreate(true)}>
          ➕ 新建项目
        </button>
      </div>

      {projects.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📒</div>
          <h3>还没有项目</h3>
          <p>点击上方按钮创建第一个记账项目吧</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="新建项目" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate}>
            <div className={styles.formGroup}>
              <label>项目名称 *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：团建旅游、聚餐活动"
                autoFocus
              />
            </div>
            <div className={styles.formGroup}>
              <label>项目描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简单描述一下这个项目..."
              />
            </div>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!name.trim()}
            >
              创建项目
            </button>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="删除项目"
          message="删除项目将同时删除该项目下的所有成员、分类和账目数据，此操作不可撤销。确定要删除吗？"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
