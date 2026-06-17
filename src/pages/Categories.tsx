import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../store/AppContext'
import ConfirmDialog from '../components/ConfirmDialog'
import styles from './Categories.module.css'

export default function Categories() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProject, addCategory, deleteCategory } = useAppContext()
  const project = id ? getProject(id) : undefined

  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2>项目不存在</h2>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 24px', background: 'var(--color-primary)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600,
            marginTop: 16,
          }}
        >
          返回项目列表
        </button>
      </div>
    )
  }

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) return

    if (project.categories.some((c) => c.name === trimmed)) {
      setError('分类名称已存在')
      return
    }

    addCategory(project.id, trimmed)
    setName('')
    setError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  const handleDelete = (categoryId: string) => {
    const ok = deleteCategory(project.id, categoryId)
    if (!ok) {
      setError('无法删除该分类：已有账目使用此分类，请先删除相关账目')
      setTimeout(() => setError(''), 3000)
    }
  }

  // Count expenses per category
  const getCategoryExpenseCount = (categoryId: string) =>
    project.expenses.filter((e) => e.categoryId === categoryId).length

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(`/project/${project.id}`)}>
          ← 返回
        </button>
        <h1>🏷️ 分类管理</h1>
      </div>

      {project.categories.length === 0 && (
        <div className={styles.defaultHint}>
          💡 建议添加一些常用分类，如：餐饮、交通、住宿、购物、娱乐等
        </div>
      )}

      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          onKeyDown={handleKeyDown}
          placeholder="输入分类名称，如：餐饮、交通"
        />
        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={!name.trim()}
        >
          ➕ 添加
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {project.categories.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏷️</div>
          <h3>还没有消费分类</h3>
          <p>添加快捷分类方便记账</p>
        </div>
      ) : (
        <div className={styles.list}>
          {project.categories.map((cat) => (
            <div key={cat.id} className={styles.item}>
              <span className={styles.itemName}>
                🏷️ {cat.name}
                <span className={styles.itemCount}>
                  ({getCategoryExpenseCount(cat.id)} 笔)
                </span>
              </span>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  const count = getCategoryExpenseCount(cat.id)
                  if (count > 0) {
                    setError('无法删除该分类：已有账目使用此分类，请先删除相关账目')
                    setTimeout(() => setError(''), 3000)
                    return
                  }
                  setDeleteId(cat.id)
                }}
                title="删除分类"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          title="删除分类"
          message="确定要删除该消费分类吗？"
          onConfirm={() => {
            handleDelete(deleteId)
            setDeleteId(null)
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
