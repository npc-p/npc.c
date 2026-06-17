import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = '确认删除',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className={styles.overlay} onClick={(e) => {
      if (e.target === e.currentTarget) onCancel()
    }}>
      <div className={styles.dialog}>
        <div className={styles.icon}>⚠️</div>
        <h4>{title}</h4>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onCancel}>取消</button>
          <button className={styles.btnConfirm} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
