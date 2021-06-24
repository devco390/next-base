import { firestore } from 'firebase/Admin'
import { IApiResponse } from 'models/api'
import { IUser } from 'models/user'
import {
  transformSuccessResponse,
  transformNotFoundResponse,
  transformServerErrorResponse
} from 'utils/api-utils'

class UserService {
  async getAll(): Promise<IApiResponse> {
    try {
      return firestore
        .collection('users')
        .get()
        .then((querySnapshot: any) => {
          const dataUsers: IUser[] = []
          querySnapshot.forEach((doc: any) => {
            const id = doc.id
            const data = doc.data() as IUser
            dataUsers.push({ id, ...data })
          })
          return transformSuccessResponse(dataUsers)
        })
        .catch((error) => {
          return transformNotFoundResponse(error)
        })
    } catch (error) {
      return transformServerErrorResponse(error)
    }
  }
}

export default UserService
