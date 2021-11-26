import {API, ITodoListIndex, TasksApi, TodoItem} from './api';
import React, {useContext} from 'react';
import {LinkToTask} from './link-to-task';
import {Task} from './task';


export const TodoList = ({tasks, root}: {
  tasks: ITodoListIndex;
  root?: TodoItem;
}) => {
  const {add, remove} = useContext<API>(TasksApi);
  const taskList = Object.values(tasks).filter(task => task.parent === root?.id);

  return (
    <div className="task-list">
      {root && taskList.length !== 0 && (
        <header className="subtask-haader">
          Sub Task List ({taskList.length}) item(s)
        </header>
      )}

      {taskList.map((task, index) => (
        <Task key={task.id} task={task} parentTask={root} num={index + 1}>
          <TodoList tasks={tasks} root={task} />
        </Task>
      ))}

      <div className="task-footer">
        <div>
          {root && <LinkToTask task={root} label="Edit"/>}
        </div>
        <div className="task-actions-buttons">
          <button className="btn secondary" onClick={() => remove(root?.id)}>
            Delete task and all sub tasks
          </button>
          <button className="btn primary" onClick={() => add(root?.id)}>
            Add Sub Task
          </button>
        </div>
      </div>
    </div>
  );
};
