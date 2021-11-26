import React, {ReactChild, ReactNode, useCallback, useEffect, useState} from 'react';
import './styles.css';


type TaskFields = {
  name?: string;
  description?: string;
  completed?: boolean;
}


interface TodoItem {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  parent?: string | undefined;
}


type ITodoListIndex = { [key: string]: TodoItem };


const LinkToTask = ({className, task}: { className?: string; task: TodoItem }) => (
  <a className={`link-to-parent ${className}`}
     href={`#${task.id}`}
  >
    ↑ {task.name}
  </a>
);

const Task = ({tasks, task, deleteTask, addTask, updateTask}: {
  tasks: ITodoListIndex;
  task: TodoItem;
  children?: React.ReactChildren | React.ReactNode;
  deleteTask: (task: TodoItem) => void;
  updateTask: (task: TodoItem, values: TaskFields) => void;
  addTask: (parent: string | undefined) => void;
}) => (
  <details className="task" id={task.id.toString()}>
    <summary>
      {task.name ? <strong>{task.name}</strong> : '<Noname Task>'}
      {task.parent ? <LinkToTask className="right" task={tasks[task.parent]} /> : null}
    </summary>
    <div className="task-form">
      <label className="task-name-input">
        Name:
        <input type="text"
               value={task.name}
               onChange={e => updateTask(task, {name: e.target.value})}
        />
      </label>
      <label className="task-description-input">
        Description:
        <textarea rows={3}
                  value={task.description}
                  onChange={e => updateTask(task, {description: e.target.value})}
        />
      </label>
      <label className="task-completed-input">
        <input type="checkbox"
               checked={task.completed}
               onChange={e => updateTask(task, {completed: e.target.checked})}
        />
        is completed
      </label>
      <button className="btn secondary" onClick={() => deleteTask(task)}>
        Delete task
      </button>
    </div>
    <TodoList tasks={tasks}
              root={task}
              deleteTask={deleteTask}
              addTask={addTask}
              updateTask={updateTask}
    />
  </details>
);


const TodoList = ({tasks, root, deleteTask, addTask, updateTask}: {
  tasks: ITodoListIndex;
  root?: TodoItem;
  deleteTask: (task: TodoItem) => void;
  updateTask: (task: TodoItem, values: TaskFields) => void;
  addTask: (parent: string | undefined) => void;
}) => {
  if (!root) {
    root = undefined;
  }

  const taskList = Object.values(tasks).filter(task => task.parent === root?.id);

  return (
    <div className="task-list">
      {root && taskList.length !== 0 && <strong style={{marginBottom: '-1em'}}>Sub Task List</strong>}
      {taskList.map(task => (
        <Task key={task.id}
              tasks={tasks}
              task={task}
              deleteTask={deleteTask}
              addTask={addTask}
              updateTask={updateTask}
        />
      ))}
      <div className="task-actions">
        <button className="btn primary" onClick={() => addTask(root?.id)}>Add Task</button>
        {root?.name && <LinkToTask task={root} />}
      </div>
    </div>
  );
};


const nextId = () => (Math.random() * 100000 + Date.now() % 100000).toString(36);

const createTask = (parent: string | undefined) => ({
  id: nextId(),
  name: '',
  description: '',
  completed: false,
  parent,
});

const LOCAL_STORAGE_ID = 'forest-tasks';

const save = (tasks: ITodoListIndex) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify(tasks));
    console.log(JSON.stringify(tasks));
    return true;
  } catch (e) {
    console.error(e);
  }
  return false;
};

const load = (): ITodoListIndex => {
  try {
    const persistData = localStorage.getItem(LOCAL_STORAGE_ID);
    console.log('ls', persistData);
    if (persistData) {
      return JSON.parse(persistData);
    }
  } catch (e) {
    console.error(e);
  }
  return {};
};


const Tab = ({id, label, children}: {
  id: string;
  label: string;
  children: ReactNode | JSX.Element | JSX.Element[];
}) => {
  return null;//<>{children}</>;
};

const Tabs = ({selected, children, onChange}: {
  onChange: (id: string) => void;
  selected: string;
  children: React.ReactElement<{
    id: string;
    label: string;
    children: React.ReactElement;
  }> | React.ReactElement<{
    id: string;
    label: string;
    children: React.ReactElement;
  }>[];
}) => {
  return (
    <div className="tab-container">
      <div className="tab-bar">
        {React.Children.map(children, ({props: {id, label}}) => {
          return (
            <div key={id}
                 className="tab-button"
                 data-active={id === selected}
                 onClick={() => onChange(id)}
            >
              {label}
            </div>
          )
        })}
      </div>
      <div className="tab-content">
        {React.Children.toArray(children).filter((tab: React.ReactNode) => {
          return tab && (typeof tab === 'object') && ('props' in tab) && tab.props?.id === selected;
        }).map(tab => (tab as JSX.Element).props.children)}
      </div>
    </div>
  );
};


export const App = () => {
  const [tab, setTab] = useState('0');
  const [tasks, setTasks] = useState<ITodoListIndex>({});

  const deleteTask = useCallback((task: TodoItem) => {
    const newTasks = {...tasks};
    delete newTasks[task.id];
    setTasks(newTasks);
    save(newTasks);
  }, [tasks, setTasks]);

  const addTask = useCallback((parent: string | undefined) => {
    const task = createTask(parent);
    const newTasks = {
      ...tasks,
      [task.id]: task,
    };
    setTasks(newTasks);
    save(newTasks);
  }, [setTasks, tasks]);

  const updateTask = useCallback((task: TodoItem, values: TaskFields) => {
    const newTasks = {
      ...tasks,
      [task.id]: {
        ...task,
        ...values,
      },
    };
    setTasks(newTasks);
    save(newTasks);
  }, [tasks, setTasks]);

  useEffect(() => {
    setTasks(load());
  }, []);

  return (
    <div className="App">
      <Tabs selected={tab} onChange={setTab}>
        <Tab id="0" label="Cards">
          <h1>Forest of Tasks</h1>
          <TodoList tasks={tasks}
                    addTask={addTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
          />
        </Tab>
        <Tab id="1" label="Tree">
          Tree
        </Tab>
        <Tab id="2" label="Menu 3">
          Tree
        </Tab>
        <Tab id="3" label="Menu 4">
          Tree
        </Tab>
      </Tabs>
    </div>
  );
};
