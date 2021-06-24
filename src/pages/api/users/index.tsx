import { NextApiRequest, NextApiResponse } from 'next'

import UserService from 'services/user-api'

const userService = new UserService()

const getUsers = async (request: NextApiRequest, response: NextApiResponse) => {
  const data = await userService.getAll()
  const { code, ...dataTosend } = data

  response.status(code).send(dataTosend)
}

export default getUsers
