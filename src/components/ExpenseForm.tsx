import { useState } from 'react'
import type { Member, Category, Expense } from '../types'
import styles from './ExpenseForm.module.css'

interface ExpenseFormProps {
  members: Member[]
  categories: Category[]
  onSubmit: (data: Omit<Expense, 'id'>) => void
  onCancel: () => void
}

export default function ExpenseForm({ members, categories, onSubmit, onCancel }: ExpenseFormProps) {
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [description, setDescription] = useState('')
  const [paidBy, setPaidBy] = useState(members[0]?.id || '')
  const [participantIds, setParticipantIds] = useState<string[]>(
    members.map((m) => m.id) // default: all members participate
  )
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  const toggleParticipant = (memberId: string) => {
    setParticipantIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('请输入有效的金额')
      return
    }
    if (!categoryId) {
      setError('请选择消费分类')
      return
    }
    if (!paidBy) {
      setError('请选择付款人')
      return
    }
    if (participantIds.length === 0) {
      setError('请至少选择一位参与人')
      return
    }

    onSubmit({
      amount: Math.round(amountNum * 100) / 100, // round to 2 decimals
      categoryId,
      description: description.trim(),
      paidBy,
      participantIds,
      date: new Date(date).toISOString(),
    })
  }

  if (members.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 24 }}>
        <p style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
          请先在"团队成员"标签页中添加成员
        </p>
        <button
          onClick={onCancel}
          style={{
            padding: '8px 20px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
          }}
        >
          关闭
        </button>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 24 }}>
        <p style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
          请先在"分类管理"页面中添加消费分类
        </p>
        <button
          onClick={onCancel}
          style={{
            padding: '8px 20px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
          }}
        >
          关闭
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>消费金额 *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          autoFocus
        />
      </div>

      <div className={styles.formGroup}>
        <label>消费分类 *</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>描述</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例如：午餐、打车..."
        />
      </div>

      <div className={styles.formGroup}>
        <label>付款人 *</label>
        <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
          {members.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>参与人 *</label>
        <div className={styles.checkboxGroup}>
          {members.map((member) => (
            <label
              key={member.id}
              className={`${styles.checkboxLabel} ${
                participantIds.includes(member.id) ? styles.checkboxChecked : ''
              }`}
            >
              <input
                type="checkbox"
                checked={participantIds.includes(member.id)}
                onChange={() => toggleParticipant(member.id)}
              />
              {member.name}
            </label>
          ))}
        </div>
        <div className={styles.hint}>
          消费金额将平均分摊给每位参与人
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>日期 *</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {error && (
        <div style={{
          padding: '10px 14px',
          background: 'var(--color-danger-light)',
          color: 'var(--color-danger)',
          borderRadius: 'var(--radius)',
          fontSize: 13,
          marginBottom: 12,
        }}>
          {error}
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          取消
        </button>
        <button type="submit" className={styles.submitBtn}>
          确认记账
        </button>
      </div>
    </form>
  )
}
