import { TodoAccess } from './todosAcess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic

const todoAccess = new TodoAccess()

const logger = createLogger('todos')

export async function createTodo(req: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info("createTodo", { userId: userId, name: req.name, duedate: req.dueDate });

    const createdAt = new Date().toISOString()
    const todoId = uuid.v4()

    return await todoAccess.createTodo({
        userId,
        todoId,
        createdAt,
        name: req.name,
        dueDate: req.dueDate,
        done: false,
    })
}

export async function deleteTodo(userId: string, todoId: string) {
    logger.info("deleteTodo", { userId: userId, todoId: todoId });

    return await todoAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(req: UpdateTodoRequest, userId: string, todoId: string): Promise<TodoUpdate> {
    logger.info("updateTodo", { userId: userId, todoId: todoId, name: req.name, duedate: req.dueDate, done: req.done });
    
    return await todoAccess.updateTodo({
        name: req.name,
        dueDate: req.dueDate,
        done: req.done
    }, todoId, userId)
}

export async function createAttachmentPresignedUrl(url, userId: string, todoId: string): Promise<TodoItem> {
    logger.info("createAttachmentPresignedUrl", { userId: userId, todoId: todoId, url: url.attachmentUrl });
    
    return await todoAccess.createAttachmentPresignedUrl({
      userId,
      todoId,
      attachmentUrl: url.attachmentUrl,
    })
}

export async function getTodo(userId: string, todoId: string): Promise<TodoItem[]> {
    logger.info("getTodo", { userId: userId, todoId: todoId });

    return todoAccess.getTodo(userId, todoId)
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info("getTodosForUser", { userId: userId });

    return todoAccess.getTodosForUser(userId)
}
