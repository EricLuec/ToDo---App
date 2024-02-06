import Fastify from 'fastify'
import { readFileSync } from 'fs'
import setupPlainEndpoint from './endpoints/plain'
import setupCookieEndpoint from './endpoints/cookie'
import setupJwtEndpoint from './endpoints/jwt'
import cors from '@fastify/cors'

const fastify = Fastify({
  logger: true
})

setupPlainEndpoint(fastify)
setupCookieEndpoint(fastify)
setupJwtEndpoint(fastify)

fastify.register(cors, {
  origin: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Credentials'],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true
})

fastify.get('/', async (request, response) => {
  response.type('text/html').send(readFileSync('index.html'))
})

fastify.listen({ port: 3000 }, function (error) {
  if (error != null) {
    fastify.log.error(error)
    process.exit(1)
  }
})
