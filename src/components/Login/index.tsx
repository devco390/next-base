import { useState } from 'react'
import {
  addUser,
  findUserByEmail,
  loginWithGmail,
  setLocalStorageUserInfo
} from 'firebase/Client'

import ButtonLogin from '../ButtonLogin'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import Logo from 'components/Logo'
import Image from 'components/Image'
import Loader from 'components/Loader'

import * as S from './styles'

import {
  USER_STATES,
  USER_ROLES,
  LOGIN_STATES,
  USER_LOGIN_STATES
} from 'models/login'

export const MESSAGE_MODAL_GMAIL_OPEN = 'Esperando inicio de sesión en Gmail'

const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(String(email).toLowerCase())
}

const Login = () => {
  const [email, setEmail] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [status, setStatus] = useState(LOGIN_STATES.USER_NOT_KNOWN)

  const messageLoading =
    status === LOGIN_STATES.MODAL_IS_OPEN ? MESSAGE_MODAL_GMAIL_OPEN : ''

  const isButtonDisabled =
    email.length === 0 ||
    !validateEmail(email) ||
    status === LOGIN_STATES.LOADING

  const showLoading =
    status === LOGIN_STATES.LOADING || status === LOGIN_STATES.MODAL_IS_OPEN

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    getFindUserByEmail()
  }

  const getFindUserByEmail = () => {
    setStatus(LOGIN_STATES.LOADING)
    findUserByEmail(email)
      .then((response) => {
        console.log('info user by firebase:', response[0])
        if (response[0] === undefined) {
          setLocalStorageUserInfo(USER_LOGIN_STATES.NOT_KNOWN)
          setStatus(LOGIN_STATES.USER_NOT_KNOWN)
          setOpen(true)
        } else {
          setLocalStorageUserInfo(response[0])
          setStatus(LOGIN_STATES.MODAL_IS_OPEN)
          getLoginWithGmail()
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const getLoginWithGmail = () => {
    loginWithGmail()
      .then(() => {
        setStatus(LOGIN_STATES.SUCCESS)
      })
      .catch((error) => {
        console.log(error)
        setLocalStorageUserInfo(USER_LOGIN_STATES.NOT_KNOWN)
        setStatus(LOGIN_STATES.ERROR)
      })
  }

  // const addnewUser = () => {
  //   const userId = 'Y7zwDwTCtKd1kOZSgHyMHn5DQ3U2'
  //   const email = 'danieling1990@gmail.com'
  //   const userName = 'daniel perez'
  //   const rol = USER_ROLES.IT_MANAGER
  //   const state = USER_STATES.ACTIVE

  //   addUser({
  //     userId,
  //     email,
  //     userName,
  //     rol,
  //     state
  //   })
  //     .then((response) => {
  //       console.log(response)
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //     })
  // }

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setEmail(value)
  }

  const handleClick = () => {
    getFindUserByEmail()
  }

  return (
    <S.Wrapper>
      <Loader loading={showLoading} message={messageLoading} />
      <S.LoginForm onSubmit={handleSubmit}>
        <S.Content>
          <S.WrapperLogo>
            <Logo />
          </S.WrapperLogo>
          <input
            onChange={handleChangeEmail}
            type="email"
            placeholder="Ingrese su Correo"
            value={email}
          ></input>
          <ButtonLogin onClick={handleClick} disabled={isButtonDisabled}>
            <div>
              <Image
                src={'/icons/gmail.svg'}
                width={24}
                height={24}
                quality={25}
              />
            </div>
            <label>Iniciar Sesión con Gmail</label>
          </ButtonLogin>
        </S.Content>
      </S.LoginForm>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          correo no autorizado.
        </Alert>
      </Snackbar>
    </S.Wrapper>
  )
}

export default Login
