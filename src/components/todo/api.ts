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
  remove: (id: string | undefined) => void;
  update: (id: string , values: TaskFields) => void;
  add: (id: string | undefined) => void;
};

const defaultHandler = () => {
  return;
};

export const TasksApi = React.createContext<API>({
  add: defaultHandler,
  remove: defaultHandler,
  update: defaultHandler
});
