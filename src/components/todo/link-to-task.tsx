import React from 'react';
import {TodoItem} from './api';


export const LinkToTask = ({className, task}: { className?: string; task: TodoItem }) => (
  <a className={`link-to-parent ${className}`}
     href={`#${task.id}`}
     onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
       e.stopPropagation();
       e.preventDefault();
       document.getElementById(e.currentTarget.getAttribute('href')?.slice(1) || '')?.scrollIntoView({
         behavior: 'smooth'
       });
     }}
  >
    ↑ {task.name}
  </a>
);
