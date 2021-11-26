import {API, ITodoListIndex, TasksApi, TodoItem} from './api';
import React, {useContext} from 'react';
import {LinkToTask} from './link-to-task';
import {Task} from './task';


export const TodoList = ({tasks, root}: {
  tasks: ITodoListIndex;
  root?: TodoItem;
}) => {
  const {add} = useContext<API>(TasksApi);
  const taskList = Object.values(tasks).filter(task => task.parent === root?.id);

  return (
    <div className="task-list">
      {root && taskList.length !== 0 && <header>
        Sub Task List ({taskList.length}) item(s)
      </header>}

      {taskList.map((task, index) => (
        <Task key={task.id} task={task} parentTask={root} num={index + 1}>
          <TodoList tasks={tasks} root={task} />
        </Task>
      ))}

      <div className="task-actions">
        <button className="btn primary" onClick={() => add(root?.id)}>Add Task</button>
        {root?.name && <LinkToTask task={root} />}
      </div>
    </div>
  );
};
