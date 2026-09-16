import React, { useState, useEffect } from 'react';
import { Component, ComponentInput } from '../types';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ComponentInput) => Promise<void>;
  initialData?: Component;
}

export function ComponentFormModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<ComponentInput>({
    name: '',
    category: '',
    quantity: 0,
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        quantity: initialData.quantity,
        location: initialData.location
      });
    } else {
      setFormData({ name: '', category: '', quantity: 0, location: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Component' : 'Add Component'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. 10k Resistor"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Resistor, Capacitor, IC"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Shelf A2"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-2 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
