import { Response } from 'express';

export interface entity {
  id: number;
  lastIndex: boolean;
  src: string;
  title: string;
  alt: string;
}

export type entities = entity[];

export const reply = (
  res: Response,
  body: {},
  timeout = 1000,
  statusCode = 200
) =>
  setTimeout(() => {
    res.status(statusCode).json(body);
  }, timeout);

export const getById = (entities: entities) => (id: number) =>
  entities.find((entity: entity) => entity.id === id);

export const getByIndex = (entities: entities) => (index: number) =>
  entities[index];

export const updateById =
  (entities: entities) => (id: number, data: entity) => {
    const index = entities.findIndex((entity: entity) => entity.id === id);
    entities[index] = { ...entities[index], ...data };

    return entities[index];
  };
