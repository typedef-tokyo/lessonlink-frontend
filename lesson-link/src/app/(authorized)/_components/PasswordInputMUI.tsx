import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'

type Props = {
  form: any
  inputPropsName: string
  label: string
  description?: string
  enableEdit?: boolean
  required?: boolean
}

export const PasswordField = ({
  form,
  inputPropsName,
  label,
  description = '',
  enableEdit = true,
  required = true,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextField
      label={label}
      type={showPassword ? 'text' : 'password'}
      required={required}
      inputProps={{ required: false }}
      size='small'
      fullWidth
      autoComplete='new-password'
      disabled={!enableEdit}
      placeholder=''
      helperText={description}
      {...form.getInputProps(inputPropsName)}
      onChange={e => {
        const halfWidth = e.target.value.replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, s =>
          String.fromCharCode(s.charCodeAt(0) - 0xfee0),
        )
        form.setFieldValue(inputPropsName, halfWidth.replace(/[^\x20-\x7E]/g, ''))
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}
