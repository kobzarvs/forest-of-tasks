import React, {useCallback, useEffect, useState} from 'react';
import './styles.css';
import {ITodoListIndex, TaskFields, TasksApi, TodoItem} from '../todo/api';
import {createTask, load, LOCAL_STORAGE_ID, save} from '../todo/helpers';
import {TodoList} from '../todo/todo-list';
import '../todo/styles.css';
import {Tab, Tabs} from '../tabs';
import {TodoTree} from '../todo/todo-tree';
import {Task, TaskMode} from '../todo/task';


export const App = () => {
  const [tab, setTab] = useState(    localStorage.getItem(LOCAL_STORAGE_ID + '-tab') || '0');
  const [tasks, setTasks] = useState<ITodoListIndex>({});
  const [currentNode, setCurrentNode] = useState<TodoItem | undefined>(undefined);


  const remove = useCallback((task: TodoItem) => {
    const newTasks = {...tasks};
    delete newTasks[task.id];
    setTasks(newTasks);
    setCurrentNode(newTasks[task.id]);
    save(newTasks);
  }, [tasks, setTasks]);

  const add = useCallback((parent: string | undefined) => {
    const task = createTask(parent);
    const newTasks = {
      ...tasks,
      [task.id]: task,
    };
    setTasks(newTasks);
    setCurrentNode(newTasks[task.id]);
    save(newTasks);
  }, [setTasks, tasks]);

  const update = useCallback((task: TodoItem, values: TaskFields) => {
    const newTasks = {
      ...tasks,
      [task.id]: {
        ...task,
        ...values,
      },
    };
    setTasks(newTasks);
    setCurrentNode(newTasks[task.id]);
    save(newTasks);
  }, [tasks, setTasks]);

  useEffect(() => {
    setTasks(load());
  }, []);

  const handleChangeTreeNode = (task:TodoItem) => {
    console.log(task);
    setCurrentNode(task);
  }

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ID + '-tab', tab);
  }, [tab]);

  return (
    <TasksApi.Provider value={{add, remove, update}}>
      <div className="App">
        <Tabs selected={tab} onChange={setTab}>
          <Tab id="0" label="Cards">
            <h1>Forest of Tasks - Cards UI</h1>
            <TodoList tasks={tasks} />
          </Tab>

          <Tab id="1" label="Tree">
            <h1>Forest of Tasks - Tree UI</h1>
            <div className="tree-layout">
              <div className="tree-container">
                <TodoTree tasks={tasks}
                          onChange={handleChangeTreeNode}
                          selected={currentNode}
                />
              </div>
              <div className="tree-form">
                <Task task={currentNode} mode={TaskMode.block}/>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </TasksApi.Provider>
  );
};
