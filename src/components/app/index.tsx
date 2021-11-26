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
  const [tab, setTab] = useState(localStorage.getItem(LOCAL_STORAGE_ID + '-tab') || '0');
  const [tasks, setTasks] = useState<ITodoListIndex>({});
  const [currentNode, setCurrentNode] = useState<TodoItem | undefined>(undefined);


  const remove = useCallback((taskId: string | undefined) => {
    console.log(taskId);
    if (!taskId) {
      setTasks({});
      setCurrentNode(undefined);
      save({});
      return;
    }
    const newTasks = {...tasks};
    delete newTasks[taskId];
    setTasks(newTasks);
    setCurrentNode(newTasks[taskId]);
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

  const update = useCallback((id: string, values: TaskFields) => {
    const newTasks = {
      ...tasks,
      [id]: {
        ...tasks[id],
        ...values,
      },
    };
    setTasks(newTasks);
    setCurrentNode(newTasks[id]);
    save(newTasks);
  }, [tasks, setTasks]);

  const isEmpty = Object.keys(tasks).length === 0;
  console.log(isEmpty, Object.keys(tasks).length, Object.keys(tasks));

  const resetSelection = (e: React.MouseEvent<HTMLElement>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (e.target?.classList?.contains('tree-container')) {
      setCurrentNode(undefined);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCurrentNode(undefined);
    }
  }, [resetSelection]);

  useEffect(() => {
    setTasks(load());

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const handleChangeTreeNode = (task: TodoItem) => {
    setCurrentNode(task);
  };

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
              <div className="tree-container" onClick={resetSelection}>
                <TodoTree tasks={tasks}
                          onChange={handleChangeTreeNode}
                          selected={currentNode}
                />
              </div>
              <div className="tree-form">
                <Task task={currentNode} mode={TaskMode.block} />
                {!currentNode && (
                  <div style={{
                    color: '#aaa',
                    fontSize: '2em',
                    placeSelf: 'center'
                  }}>
                    No task selected
                  </div>)
                }
                <div className="task-actions-buttons"
                     style={{
                       placeItems: 'end',
                       placeContent: 'end',
                     }}
                >
                  <button className="btn secondary"
                          onClick={() => remove(currentNode?.id)}
                          disabled={isEmpty}
                  >
                    Delete task and all sub tasks
                  </button>
                  <button className="btn primary" onClick={() => add(currentNode?.id)}>
                    Add Sub Task
                  </button>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </TasksApi.Provider>
  );
};
