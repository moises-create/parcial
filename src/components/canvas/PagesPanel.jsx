import React, { useState } from "react";
import { Plus, X } from "react-feather";

const PagesPanel = ({
  pages,
  activePage,
  onChangePage,
  onAddPage,
  onRemovePage,
}) => {
  const [newPageName, setNewPageName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPage = () => {
    if (newPageName.trim()) {
      onAddPage(newPageName);
      setNewPageName("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="border-b p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-sm">Pages</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
        >
          <Plus size={18} />
        </button>
      </div>

      {showAddForm && (
        <div className="flex mb-3 gap-1">
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Page name"
            className="flex-1 p-2 border rounded text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleAddPage()}
          />
          <button
            onClick={handleAddPage}
            className="bg-blue-600 text-white px-3 rounded text-sm hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      )}

      <div className="space-y-1">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              page.id === activePage
                ? "bg-blue-50 text-blue-700"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onChangePage(page.id)}
          >
            <span className="truncate text-sm">{page.title}</span>
            {pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemovePage(page.id);
                }}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PagesPanel);
