import {TasksApi, TodoItem} from './api';
import React, {memo, useContext, useState} from 'react';
import {LinkToTask} from './link-to-task';

export enum TaskMode {
  block = 'block',
  list = 'list-item',
}

export const Task = memo(({task, parentTask, children, mode = TaskMode.list, num}: {
  num?: number;
  mode?: TaskMode;
  task?: TodoItem;
  parentTask?: TodoItem;
  children?: React.ReactChildren | React.ReactNode;
}) => {
  const [open, setOpen] = useState(mode === TaskMode.block);
  const {remove, update} = useContext(TasksApi);

  if (!task) return null;

  return (
    <details className="task"
             id={task.id}
             open={open}
    >
      <summary style={{display: mode || TaskMode.list}}
               onClick={(e) => {
                 mode !== TaskMode.block && setOpen(val => !val);
                 mode === TaskMode.list && e.preventDefault();
               }}
      >
        {task.name ? <strong>{task.name}</strong> : '<Noname Task>'}
        {num !== undefined && <span className="right">[{num}]</span>}
        {parentTask ? <LinkToTask className="right" task={parentTask} /> : null}
      </summary>

      <div className="task-form" data-mode={mode}>
        <label className="task-name-input">
          Name:
          <input type="text"
                 value={task.name}
                 onChange={e => update(task, {name: e.target.value})}
          />
        </label>
        <label className="task-description-input">
          Description:
          <textarea rows={3}
                    value={task.description}
                    onChange={e => update(task, {description: e.target.value})}
          />
        </label>
        <label className="task-completed-input">
          <input type="checkbox"
                 checked={task.completed}
                 onChange={e => update(task, {completed: e.target.checked})}
          />
          is completed
        </label>

        <button className="btn secondary" onClick={() => remove(task)}>
          Delete task
        </button>
      </div>

      {children}
    </details>
  );
});

Task.displayName = 'Task';
