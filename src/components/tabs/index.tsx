import React, {ReactNode} from 'react';


export const Tab = ({id, label, children}: {
  id: string;
  label: string;
  children: ReactNode | JSX.Element | JSX.Element[];
}) => {
  return null;
};


export const Tabs = ({selected, children, onChange}: {
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
          );
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
