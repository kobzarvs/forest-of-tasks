import React from 'react';
import {TodoItem} from './api';


export const LinkToTask = ({className, task, label}: { className?: string; task: TodoItem, label?: string }) => (
  <a className={`link-to-parent ${className}`}
     href={`#${task.id}`}
     onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
       e.stopPropagation();
       e.preventDefault();
       const taskContainer = document.getElementById(e.currentTarget.getAttribute('href')?.slice(1) || '') as HTMLElement;
       if (taskContainer) {
         taskContainer.scrollIntoView({behavior: 'smooth'});
         const form = taskContainer.querySelector('.task-form') as HTMLDivElement;
         setTimeout(() => {
           form.setAttribute('data-flash', '');
         }, 50);
         setTimeout(() => {
           form.removeAttribute('data-flash');
         }, 1000);
       }
     }}
  >
     ↑ {label || task.name}
  </a>
);
