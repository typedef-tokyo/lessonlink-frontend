'use client'

import { createTheme, ThemeProvider } from '@mui/material/styles'

const muiTheme = createTheme({
  palette: {
    primary: { main: '#7E57C2' },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: '#7E57C2', // 非アクティブ時の枠線
          },
          '&:hover fieldset': {
            borderColor: '#9575CD', // ホバー時
          },
          '&.Mui-focused fieldset': {
            borderColor: '#7E57C2', // フォーカス時
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#7E57C2', // ラベル色
          '&.Mui-focused': {
            color: '#7E57C2',
          },
        },
      },
    },
  },
})

export function MuiProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
}
