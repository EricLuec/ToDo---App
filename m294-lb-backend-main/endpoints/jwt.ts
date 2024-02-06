import fastifyJwt from '@fastify/jwt'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { error } from '../helpers'
import { loginSchema } from '../schemas'
import { routes } from './plain'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { email: string }
    user: {
      email: string
    }
  }
}

export async function authenticate (request: FastifyRequest, response: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    response.code(401).send(error(401, 'authenicate with valid jwt token /auth/jwt/sign'))
  }
}

export default function setup (fastify: FastifyInstance) {
  fastify.register(fastifyJwt, {
    secret: 'this is just an example, not a real secret'
  })

  fastify.route({ ...routes.listTasks, url: '/auth/jwt/tasks', onRequest: authenticate })
  fastify.route({ ...routes.showTask, url: '/auth/jwt/task/:taskId', onRequest: authenticate })
  fastify.route({ ...routes.createTask, url: '/auth/jwt/tasks', onRequest: authenticate })
  fastify.route({ ...routes.updateTask, url: '/auth/jwt/tasks', onRequest: authenticate })
  fastify.route({ ...routes.deleteTask, url: '/auth/jwt/task/:taskId', onRequest: authenticate })

  fastify.get('/auth/jwt/verify', { onRequest: authenticate }, async (request, response) => {
    request.jwtVerify(function (err, decoded) {
      return response.send((err != null) || decoded)
    })
  })

  fastify.post('/auth/jwt/sign', { schema: loginSchema }, async (request: FastifyRequest<{ Body: { email: string, password: string } }>, response) => {
    const { email, password } = request.body

    if (password === 'm294') {
      request.session.email = email
      response.jwtSign({ email }, function (err, token) {
        return response.send((err != null) || { token })
      })
    } else {
      return await response.code(400).send({ statusCode: 400, message: 'invalid credentials, use «m294» as password' })
    }
  })
}
