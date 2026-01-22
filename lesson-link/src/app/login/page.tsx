'use client'
import { ROUTES } from '@constants/Constants'
import { useRouter } from 'next/navigation'
import React from 'react'
import { showApiError, showError } from '@/app/lib/notification'
import { apiHooks } from '@/app/lib/zodios'
import { User, useUser } from '@/context/UserContext'
import { schemas } from '@/generated/api'
import { LoginFormValue, LoginTemplate } from './_components/LoginTemplate'

const LoginPage = () => {
  const router = useRouter()
  const { mutateAsync: postUserLogin } = apiHooks.usePostUserlogin()
  const { setUser } = useUser()

  const handleOnSubmit = (values: LoginFormValue) => {
    if (!values.user_name || !values.password) {
      return
    }

    const loginData = schemas.controller_UserLoginParams.parse(values)

    postUserLogin(loginData)
      .then(response => {
        const validatedResponse = schemas.presenter_UserLoginResponse.parse(response)

        const userData: User = {
          id: validatedResponse.login_user.id,
          name: validatedResponse.login_user.name,
          userName: validatedResponse.login_user.user_name,
          roleKey: validatedResponse.login_user.role_key,
        }

        setUser(userData)
        router.push(ROUTES.CAMPUS_SELECT)
      })
      .catch(error => {
        if (error.response?.status === 401) {
          showError('ログインエラー', error.response.data.msg)
        } else {
          showApiError(error)
        }
      })
  }

  return <LoginTemplate onSubmit={handleOnSubmit} />
}

export default LoginPage
