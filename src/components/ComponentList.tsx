import React from 'react';
import { Component } from '../types';
import { Edit2, Trash2 } from 'lucide-react';

interface Props {
  components: Component[];
  onEdit: (component: Component) => void;
  onDelete: (component: Component) => void;
}

export function ComponentList({ components, onEdit, onDelete }: Props) {
  if (components.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
        <p className="text-gray-500">No components found. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-4 font-medium text-gray-600">ID</th>
            <th className="p-4 font-medium text-gray-600">Name</th>
            <th className="p-4 font-medium text-gray-600">Category</th>
            <th className="p-4 font-medium text-gray-600 text-right">Quantity</th>
            <th className="p-4 font-medium text-gray-600">Location</th>
            <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {components.map((comp) => (
            <tr key={comp.id} className="border-b hover:bg-gray-50/50 transition-colors">
              <td className="p-4 text-gray-500 text-sm">#{comp.id}</td>
              <td className="p-4 font-medium text-gray-900">{comp.name}</td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {comp.category}
                </span>
              </td>
              <td className="p-4 text-right font-medium">
                <span className={comp.quantity === 0 ? 'text-red-600' : 'text-gray-900'}>
                  {comp.quantity}
                </span>
              </td>
              <td className="p-4 text-gray-600">{comp.location}</td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(comp)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(comp)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
