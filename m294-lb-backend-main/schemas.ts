
export const updateTaskSchema = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      title: { type: 'string' },
      completed: { type: 'string' }
    },
    required: ['id']
  }
}

export const addTaskSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      completed: { type: 'string' }
    },
    required: ['title']
  }
}

export const loginSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['email', 'password']
  }
}
