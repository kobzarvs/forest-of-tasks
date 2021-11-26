import {ITodoListIndex, TodoItem} from './api';
import React from 'react';
import {TaskNode} from './task-node';


const countAllChildren = (task: TodoItem, tasks: ITodoListIndex) => {
  return Object.values(tasks).reduce((acc, subTask) => {
    if (subTask.parent === task.id) {
      const {completed, total} = countAllChildren(subTask, tasks);
      acc.total += total;
      acc.completed += completed;
    }
    return acc;
  }, {completed: task.completed ? 1 : 0, total: 1});
};

export const TodoTree = ({tasks, root, onChange, selected}: {
  selected?: TodoItem;
  onChange: (task: TodoItem) => void;
  tasks: ITodoListIndex;
  root?: TodoItem;
}) => {
  const taskList = Object.values(tasks).filter(task => task.parent === root?.id);

  if (taskList.length === 0) return null;

  return (
    <div className="task-tree">
      {taskList.map(task => {
        return (
          <TaskNode key={task.id}
                    task={task}
                    info={countAllChildren(task, tasks)}
                    onChange={onChange}
                    selected={selected}
          >
            <TodoTree tasks={tasks} root={task} onChange={onChange} selected={selected}/>
          </TaskNode>
        );
      })}
    </div>
  );
};
