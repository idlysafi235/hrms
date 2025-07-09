import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';

const ActionMenu = ({ actionTypes, onEdit }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative inline-block text-left">

      <button
        onClick={() => setShowActions((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <MoreVertical className="w-5 h-5 text-white-600" />
      </button>

      {showActions && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 flex gap-1 flex-col"
          style={{ padding: '10px' }}
        >
          {actionTypes.map((ele, index) => (
            <button
              key={index}
              onClick={() => {
                if (ele.name == 'Edit') {
                  onEdit();
                }
                if (ele.action !== '') {
                  ele.action();
                  console.log('Called Action');
                }
                setShowActions(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-t-none first:rounded-t-xl last:rounded-b-xl"
            >
              {ele.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
