import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../store/AppContext'
import Modal from '../components/Modal'
import ExpenseList from '../components/ExpenseList'
import ExpenseForm from '../components/ExpenseForm'
import StatisticsPanel from '../components/StatisticsPanel'
import MemberPanel from '../components/MemberPanel'
import type { Expense } from '../types'
import styles from './ProjectDetail.module.css'

type Tab = 'expenses' | 'statistics' | 'members'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProject, addExpense, deleteExpense, updateProject } = useAppContext()
  const project = id ? getProject(id) : undefined

  const [activeTab, setActiveTab] = useState<Tab>('expenses')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2>项目不存在</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: '8px 0 24px' }}>
          该项目可能已被删除或不存在
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 24px', background: 'var(--color-primary)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600,
          }}
        >
          返回项目列表
        </button>
      </div>
    )
  }

  const handleAddExpense = (data: Omit<Expense, 'id'>) => {
    addExpense(project.id, data)
    setShowExpenseForm(false)
  }

  const handleEditProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) return
    updateProject(project.id, editName.trim(), editDescription.trim())
    setShowEditModal(false)
  }

  const openEditModal = () => {
    setEditName(project.name)
    setEditDescription(project.description)
    setShowEditModal(true)
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'expenses', label: '记账记录', icon: '💰' },
    { key: 'statistics', label: '消费统计', icon: '📊' },
    { key: 'members', label: '团队成员', icon: '👥' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1>{project.name}</h1>
        <div className={styles.headerActions}>
          <button className={styles.editBtn} onClick={openEditModal}>
            ✏️ 编辑
          </button>
        </div>
      </div>
      {project.description && (
        <div className={styles.description}>{project.description}</div>
      )}

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'expenses' && (
          <ExpenseList
            expenses={project.expenses}
            categories={project.categories}
            members={project.members}
            onAdd={() => setShowExpenseForm(true)}
            onDelete={(expenseId) => deleteExpense(project.id, expenseId)}
          />
        )}
        {activeTab === 'statistics' && (
          <StatisticsPanel project={project} />
        )}
        {activeTab === 'members' && (
          <MemberPanel projectId={project.id} />
        )}
      </div>

      {showExpenseForm && (
        <Modal title="记一笔账" onClose={() => setShowExpenseForm(false)}>
          <ExpenseForm
            members={project.members}
            categories={project.categories}
            onSubmit={handleAddExpense}
            onCancel={() => setShowExpenseForm(false)}
          />
        </Modal>
      )}

      {showEditModal && (
        <Modal title="编辑项目" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleEditProject}>
            <div className={styles.formGroup}>
              <label>项目名称 *</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
              />
            </div>
            <div className={styles.formGroup}>
              <label>项目描述</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={!editName.trim()}>
              保存修改
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
