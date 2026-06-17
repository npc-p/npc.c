import { useState } from 'react'
import type { Expense, Member, Category } from '../types'
import ConfirmDialog from './ConfirmDialog'
import styles from './ExpenseItem.module.css'

interface ExpenseItemProps {
  expense: Expense
  members: Member[]
  categories: Category[]
  onDelete: () => void
}

export default function ExpenseItem({ expense, members, categories, onDelete }: ExpenseItemProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const category = categories.find((c) => c.id === expense.categoryId)
  const payer = members.find((m) => m.id === expense.paidBy)
  const participantNames = expense.participantIds
    .map((id) => members.find((m) => m.id === id)?.name)
    .filter(Boolean) as string[]

  return (
    <>
      <div className={styles.item}>
        <div className={styles.amount}>
          ¥{expense.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={styles.content}>
          <div className={styles.topRow}>
            {category && <span className={styles.category}>{category.name}</span>}
            {expense.description && (
              <span className={styles.description}>{expense.description}</span>
            )}
          </div>
          <div className={styles.bottomRow}>
            <span className={styles.paidBy}>💳 {payer?.name || '未知'} 支付</span>
            <span>📅 {new Date(expense.date).toLocaleDateString('zh-CN')}</span>
            {participantNames.length > 0 && (
              <span className={styles.participants}>
                👤 {participantNames.map((name) => (
                  <span key={name} className={styles.participantTag}>{name}</span>
                ))}
              </span>
            )}
          </div>
        </div>
        <button
          className={styles.deleteBtn}
          onClick={() => setShowConfirm(true)}
          title="删除账单"
        >
          🗑️
        </button>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="删除账单"
          message={`确定要删除这笔 ¥${expense.amount.toFixed(2)} 的账目吗？`}
          onConfirm={() => { onDelete(); setShowConfirm(false) }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}
