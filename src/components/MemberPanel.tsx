import { useState } from 'react'
import { useAppContext } from '../store/AppContext'
import styles from './MemberPanel.module.css'

interface MemberPanelProps {
  projectId: string
}

export default function MemberPanel({ projectId }: MemberPanelProps) {
  const { getProject, addMember, removeMember } = useAppContext()
  const project = getProject(projectId)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  if (!project) return null

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) return

    // Check duplicate
    if (project.members.some((m) => m.name === trimmed)) {
      setError('成员名称已存在')
      return
    }

    addMember(projectId, trimmed)
    setName('')
    setError('')
  }

  const handleRemove = (memberId: string) => {
    const ok = removeMember(projectId, memberId)
    if (!ok) {
      setError('无法删除该成员：已参与记账记录，请先删除相关账目')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          onKeyDown={handleKeyDown}
          placeholder="输入成员姓名，按回车添加"
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

      {project.members.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👤</div>
          <p>还没有添加团队成员</p>
        </div>
      ) : (
        <div className={styles.list}>
          {project.members.map((member) => (
            <span key={member.id} className={styles.tag}>
              {member.name}
              <button
                className={styles.removeBtn}
                onClick={() => handleRemove(member.id)}
                title="移除成员"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
