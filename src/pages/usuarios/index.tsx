import Base from 'templates/Base'
import Loader from 'components/Loader'
import UserList from 'components/UserList'
import { USER_LOGIN_STATES } from 'models/login'

import useUser from 'hooks/useUser'

export interface PageProps {
  loading: boolean
}

const UsersPage = ({ loading }: PageProps) => {
  const { user } = useUser()

  return (
    <>
      {user === USER_LOGIN_STATES.NOT_LOGGED ||
        (user === USER_LOGIN_STATES.NOT_KNOWN && <Loader loading={true} />)}
      {user && (
        <Base>
          <UserList />
        </Base>
      )}
    </>
  )
}

export default UsersPage
