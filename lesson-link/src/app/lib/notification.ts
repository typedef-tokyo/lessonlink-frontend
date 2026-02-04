import { ROUTES } from '@constants/Constants'
import { hideNotification, showNotification } from '@mantine/notifications'
import { AxiosError } from 'axios'

type ApiError = {
  msg: string
}

export const showLoading = (id: string, title: string, message: string) => {
  showNotification({
    id: id,
    loading: true,
    title: title,
    message: message,
    color: 'green',
    autoClose: false,
  })
}

export const dismissLoading = (id: string) => {
  setTimeout(() => {
    hideNotification(id)
  }, 500)
}

export const showSuccess = (title: string, message: string) => {
  showNotification({
    title,
    message,
    color: 'green',
    autoClose: 5000,
  })
}

export const showError = (title: string, message: string) => {
  showNotification({
    title,
    message: message,
    color: 'red',
    autoClose: 10000,
  })
}

export const showErrorManualClose = (title: string, message: string) => {
  showNotification({
    title,
    message: message,
    color: 'red',
    autoClose: false,
    withCloseButton: true,
  })
}

export const showApiError = (error: Error) => {
  if (typeof error === 'string') {
    return showError('エラー', error)
  }

  if (error instanceof AxiosError) {
    if (error.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = ROUTES.LOGIN
        return
      }
    }
    const apiError = error.response?.data as ApiError
    if (apiError) {
      return showError('エラー', apiError.msg)
    }
  }

  showError('エラー', error.message)
}
