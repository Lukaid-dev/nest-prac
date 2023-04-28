import { Request, Response } from 'express';

export interface IAuthUser {
  user?: {
    id: number
  }
}
export interface IContext {
  req: Request & IAuthUser
  res: Response
}