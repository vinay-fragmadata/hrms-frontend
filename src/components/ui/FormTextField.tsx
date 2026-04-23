import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { memo } from 'react'

export const FormTextField = memo(function FormTextField({
  margin = 'normal',
  fullWidth = true,
  ...rest
}: TextFieldProps) {
  return <TextField margin={margin} fullWidth={fullWidth} {...rest} />
})
