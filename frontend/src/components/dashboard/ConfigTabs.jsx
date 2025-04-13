import React from 'react';

export const Tabs = ({ children, activeTab, onChange }) => {
  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;
            
            const isActive = activeTab === child.props.id;
            
            return (
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => onChange(child.props.id)}
              >
                {child.props.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="pt-4">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          if (child.props.id !== activeTab) return null;
          return child;
        })}
      </div>
    </div>
  );
};

export const Tab = ({ children, id, label }) => {
  return <div className="tab-content">{children}</div>;
};
