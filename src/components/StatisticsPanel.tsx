import type { Project } from '../types'
import { computeStatistics } from '../utils/statistics'
import styles from './StatisticsPanel.module.css'

interface StatisticsPanelProps {
  project: Project
}

const RANK_EMOJIS = ['🥇', '🥈', '🥉']

function BalanceRow({ value }: { value: number }) {
  if (value > 0.01) {
    return <span className={styles.positive}>+¥{value.toFixed(2)}（待收回）</span>
  }
  if (value < -0.01) {
    return <span className={styles.negative}>-¥{Math.abs(value).toFixed(2)}（待支付）</span>
  }
  return <span style={{ color: 'var(--color-text-muted)' }}>¥0.00（已平）</span>
}

export default function StatisticsPanel({ project }: StatisticsPanelProps) {
  const stats = computeStatistics(project)

  if (project.expenses.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📊</div>
        <h3>暂无消费数据</h3>
        <p>添加记账记录后，消费统计将在这里展示</p>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      {/* Overview Cards */}
      <div className={styles.overview}>
        <div className={styles.overviewCard}>
          <div className={styles.label}>总消费</div>
          <div className={`${styles.value} ${styles.accent}`}>
            ¥{stats.totalExpenses.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={styles.sub}>{project.expenses.length} 笔账目</div>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.label}>人均消费</div>
          <div className={styles.value}>
            ¥{stats.averagePerPerson.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={styles.sub}>{project.members.length} 名成员</div>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.label}>消费分类</div>
          <div className={styles.value}>
            {stats.categoryStats.filter((c) => c.total > 0).length}
          </div>
          <div className={styles.sub}>个活跃分类</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>📂 分类消费统计</div>
        {stats.categoryStats.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>暂无分类数据</p>
        ) : (
          <div className={styles.categoryList}>
            {stats.categoryStats.map((cat) => (
              <div key={cat.categoryId} className={styles.categoryItem}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>{cat.categoryName}</span>
                  <span className={styles.categoryAmount}>
                    ¥{cat.total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${Math.max(cat.percentage, 1)}%` }}
                  />
                </div>
                <div className={styles.barLabel}>
                  <span>{cat.percentage.toFixed(1)}%</span>
                  <span>{cat.total > 0 ? `${cat.percentage.toFixed(0)}%` : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Statistics & Ranking */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>👥 个人消费统计与排名</div>
        {stats.memberStats.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>暂无成员数据</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>排名</th>
                <th>成员</th>
                <th>已支付</th>
                <th>应分担</th>
                <th>结余</th>
                <th>记账数</th>
              </tr>
            </thead>
            <tbody>
              {stats.memberStats.map((member, idx) => (
                <tr key={member.memberId}>
                  <td>
                    {idx < 3 ? (
                      <span style={{ fontSize: 18 }}>{RANK_EMOJIS[idx]}</span>
                    ) : (
                      <span className={styles.rankBadge}>{idx + 1}</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{member.memberName}</td>
                  <td>
                    ¥{member.totalPaid.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td>
                    ¥{member.totalParticipated.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td>
                    <BalanceRow value={member.balance} />
                  </td>
                  <td>{member.expenseCount} 笔</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
