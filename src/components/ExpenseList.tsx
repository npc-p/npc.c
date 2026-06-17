import type { Expense, Member, Category } from '../types'
import ExpenseItem from './ExpenseItem'
import styles from './ExpenseList.module.css'

interface ExpenseListProps {
  expenses: Expense[]
  members: Member[]
  categories: Category[]
  onAdd: () => void
  onDelete: (expenseId: string) => void
}

export default function ExpenseList({ expenses, members, categories, onAdd, onDelete }: ExpenseListProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  // Sort by date descending (newest first)
  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <span className={styles.summary}>
          共 {expenses.length} 笔账，合计{' '}
          <strong>¥{total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </span>
        <button className={styles.addBtn} onClick={onAdd}>
          ➕ 记一笔
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📝</div>
          <h3>还没有记账记录</h3>
          <p>点击"记一笔"开始记录团队消费吧</p>
        </div>
      ) : (
        <div className={styles.list}>
          {sorted.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              members={members}
              categories={categories}
              onDelete={() => onDelete(expense.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
