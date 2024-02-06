import { FastifyInstance, RouteOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { error, parseId } from '../helpers'
import { addTaskSchema, updateTaskSchema } from '../schemas'
import * as taskService from '../task_service'
import type { Task } from '../task_service'

export default function setup (fastify: FastifyInstance) {
  fastify.route(listTasks)
  fastify.route(showTask)
  fastify.route(deleteTask)
  fastify.route(updateTask)
  fastify.route(createTask)
}

const listTasks: RouteOptions<Server, IncomingMessage, ServerResponse, {}> = {
  method: 'GET',
  url: '/tasks',
  handler: async (request, response) => {
    response.send(taskService.getAllTasks())
  }
}

const showTask: RouteOptions<Server, IncomingMessage, ServerResponse, { Params: { taskId: string } }> = {
  method: 'GET',
  url: '/task/:taskId',
  handler: async (request, response) => {
    const task = taskService.getTaskById(parseId(request.params.taskId))
    if (task == null) return await response.code(404).send({ statusCode: 404, error: 'Not found' })

    response.send(task)
  }
}

const deleteTask: RouteOptions<Server, IncomingMessage, ServerResponse, { Params: { taskId: string } }> = {
  method: 'DELETE',
  url: '/task/:taskId',
  handler: async (request, response) => {
    const taskToDelete = taskService.getTaskById(parseId(request.params.taskId))
    if (taskToDelete == null) return await response.code(404).send({ statusCode: 404, error: 'Not found' })

    taskService.deleteTaskById(taskToDelete.id)
    response.send(taskToDelete)
  }
}

const createTask: RouteOptions<Server, IncomingMessage, ServerResponse, { Body: Omit<Task, "id"> }> = {
  method: 'POST',
  url: '/tasks',
  schema: addTaskSchema,
  handler: async (request, response) => {
    try {
      const task = taskService.addTask({ title: request.body.title, completed: request.body.completed })
      response.send(task)
    } catch (e) {
      return await response.code(400).send(error(400, (e as Error).message))
    }
  }
}

const updateTask: RouteOptions<Server, IncomingMessage, ServerResponse, { Body: Task }> = {
  method: 'PUT',
  url: '/tasks',
  schema: updateTaskSchema,
  handler: async (request, response) => {
    const { id, title, completed } = request.body

    try {
      const task = taskService.updateTask({ id: parseId(id), title, completed })
      if (task != null) return await response.send(task)

      return await response.code(404).send({ statusCode: 404, error: 'Not found' })
    } catch (e) {
      return await response.code(400).send(error(400, (e as Error).message))
    }
  }
}

export const routes = { listTasks, showTask, createTask, updateTask, deleteTask }
