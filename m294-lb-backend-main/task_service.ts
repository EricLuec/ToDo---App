const fs = require('fs')

export interface Task {
  id: number
  title: string
  completed: boolean
}

export class TaskInvalid extends Error {
  constructor (message: string) {
    super(message)

    Object.setPrototypeOf(this, TaskInvalid.prototype)
  }
}

let tasks: Task[] = [
  { id: 1, title: 'Feed pets', completed: false }
]

export function getTaskById (id: number | undefined): Task | undefined {
  return tasks.find((task) => task.id == id)
}

export function getAllTasks (): Task[] {
  return tasks
}

export function deleteTaskById (id: number | undefined) {
  tasks = tasks.filter(task => task.id != id)
	persistTasksToFile()
}

export function getNextId (): number {
  if (tasks.length === 0) {
    return 1
  }
  return Math.max(...tasks.map(task => task.id)) + 1
}

export function addTask ({ title, completed }: {title?: string, completed?: boolean}): Task {
  if (title === undefined || title?.length < 1) {
    throw new Error("property 'title' must be at least 1 character long")
  }

  const task: Task = {
    id: getNextId(),
    title,
    completed: completed === true || completed as unknown as string === 'true'
  }
  tasks.push(task)
	persistTasksToFile()
  return task
}

export function updateTask ({ id, title, completed }: Partial<Task>): Task | undefined {
  const task = getTaskById(id)
  if (task == null) return

  if (title === undefined || title?.length < 1) {
    throw new Error("property 'title' must be at least 1 character long")
  } else {
    task.title = title
  }

  task.completed = completed === true || completed as unknown as string === 'true'
	persistTasksToFile()

  return task
}

function persistTasksToFile(file = 'data.json') {
	fs.writeFile(file, JSON.stringify(tasks), () => {})
}
