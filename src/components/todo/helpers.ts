import {ITodoListIndex} from './api';


export const LOCAL_STORAGE_ID = 'forest-tasks';

const nextId = () => (Math.random() * 100000 + Date.now() % 100000).toString(36);

export const createTask = (parent: string | undefined) => ({
  id: nextId(),
  name: '',
  description: '',
  completed: false,
  parent,
});

export const save = (tasks: ITodoListIndex) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify(tasks));
    return true;
  } catch (e) {
    console.error(e);
  }
  return false;
};

export const load = (): ITodoListIndex => {
  try {
    const persistData = localStorage.getItem(LOCAL_STORAGE_ID);
    if (persistData) {
      return JSON.parse(persistData);
    }
  } catch (e) {
    console.error(e);
  }
  return {};
};
