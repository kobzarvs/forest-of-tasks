import {TodoItem} from './api';
import React from 'react';


export const TaskNode = ({task, info, children, onChange, selected}: {
  selected?: TodoItem;
  onChange: (task: TodoItem) => void;
  task: TodoItem;
  info: {total: number; completed: number};
  children?: React.ReactChildren | React.ReactNode;
}) => {
  return (
    <details className="task-node" id={task.id.toString()}>
      <summary style={{display: info.total === 1 ? 'block' : 'list-item', whiteSpace: 'nowrap', width: '100%'}}
               onClick={(e) => {
                 onChange(task);
                 selected !== task && e.preventDefault();
               }}
               data-selected={selected?.id === task.id}
               data-completed={info.completed === info.total}
      >
        {task.name || '<Noname Task>'}
        <span className="subtask-counter" style={{marginLeft: '1em'}}>
          {info.completed}/{info.total}
        </span>
      </summary>

      {children}
    </details>
  );
};
