import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { memo } from 'react'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  cancelLabel?: string
  confirmLabel?: string
  confirmLoading?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const ConfirmDialog = memo(function ConfirmDialog({
  open,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  confirmLoading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={confirmLoading ? undefined : onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description" component="span">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={confirmLoading} color="inherit">
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={confirmLoading}
          variant="contained"
          color="primary"
          autoFocus
        >
          {confirmLoading ? 'Please wait…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
})
