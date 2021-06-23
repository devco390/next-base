import { useEffect, useState } from 'react'
import {
  addUser,
  findUserByEmail,
  loginWithGmail,
  setLocalStorageUserInfo,
  clearLocalStorageUserInfo
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
import { useSession } from 'contexts/session'
import { IUser, IUserGmail } from 'models/user'

export const MESSAGE_MODAL_GMAIL_OPEN = 'Esperando inicio de sesión en Gmail'

const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(String(email).toLowerCase())
}

const Login = () => {
  const {
    dispatch,
    state: { user }
  } = useSession()

  const [email, setEmail] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [status, setStatus] = useState(LOGIN_STATES.USER_NOT_KNOWN)

  useEffect(() => {
    if (user && user.accessToken && user.idToken) {
      setLocalStorageUserInfo(user)
    }
  }, [user])

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

  const mapUser = ({
    id,
    email,
    rol,
    state,
    userName,
    accessToken,
    idToken
  }: IUser): IUser => {
    return {
      id,
      email,
      rol,
      state,
      userName,
      accessToken,
      idToken
    }
  }

  const setStateUserData = (userData: IUser | undefined) => {
    const userDataTransformed = userData ? mapUser(userData) : userData
    dispatch({
      type: 'SET_USER_DATA',
      payload: {
        key: 'user',
        value: userDataTransformed
      }
    })
  }

  const getFindUserByEmail = () => {
    setStatus(LOGIN_STATES.LOADING)
    findUserByEmail(email)
      .then((response) => {
        if (response[0] === undefined) {
          setStateUserData(USER_LOGIN_STATES.NOT_KNOWN)
          setStatus(LOGIN_STATES.USER_NOT_KNOWN)
          setOpen(true)
        } else {
          const userData = response[0] as IUser
          setStatus(LOGIN_STATES.MODAL_IS_OPEN)
          getLoginWithGmail(userData)
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const flowErrorLoginWithGmail = () => {
    setStateUserData(USER_LOGIN_STATES.NOT_KNOWN)
    clearLocalStorageUserInfo()
    setStatus(LOGIN_STATES.ERROR)
  }

  const getLoginWithGmail = (userData: IUser) => {
    loginWithGmail()
      .then((response: any) => {
        const {
          credential: { accessToken, idToken },
          user
        } = response as IUserGmail

        if (user.email === email) {
          setStateUserData({ ...userData, accessToken, idToken })
          setStatus(LOGIN_STATES.SUCCESS)
        } else {
          flowErrorLoginWithGmail()
        }
      })
      .catch((error) => {
        console.log(error)
        flowErrorLoginWithGmail()
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
