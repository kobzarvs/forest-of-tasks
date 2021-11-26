import React from 'react';


export interface TaskFields {
  name?: string;
  description?: string;
  completed?: boolean;
}


export interface TodoItem extends TaskFields {
  id: string;
  parent?: string | undefined;
}


export type ITodoListIndex = { [key: string]: TodoItem };

export type API = {
  remove: (task: TodoItem) => void;
  update: (task: TodoItem, values: TaskFields) => void;
  add: (parent: string | undefined) => void;
};

const defaultHandler = () => {
  return;
};

export const TasksApi = React.createContext<API>({
  add: defaultHandler,
  remove: defaultHandler,
  update: defaultHandler
});
