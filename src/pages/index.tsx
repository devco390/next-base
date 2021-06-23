import Base from 'templates/Base'
import Loader from 'components/Loader'
import { USER_LOGIN_STATES } from 'models/login'
import Dashboard from 'components/Dashboard'

import useUser from 'hooks/useUser'

const Home = () => {
  const { user } = useUser()

  return (
    <>
      {user === USER_LOGIN_STATES.NOT_LOGGED ||
        (user === USER_LOGIN_STATES.NOT_KNOWN && <Loader loading={true} />)}
      {user && (
        <Base>
          <Dashboard />
        </Base>
      )}
    </>
  )
}

export default Home
