import React, { useState, useEffect, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Search, CircuitBoard } from 'lucide-react';
import { Component, ComponentInput } from './types';
import * as api from './api';
import { ComponentList } from './components/ComponentList';
import { ComponentFormModal } from './components/ComponentFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export default function App() {
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | undefined>();

  // Fetch components on load
  const loadComponents = async () => {
    setIsLoading(true);
    try {
      // Passing filterCategory to backend if requested, but doing client side filtering is also fine
      // Since requirements said "support ?category= filter query param", we can use it, but 
      // search bar also means we might just want to fetch all and filter locally for search.
      // Let's fetch all and filter locally for simplicity and fast search.
      const data = await api.getComponents();
      setComponents(data);
    } catch (error: any) {
      toast.error('Failed to load components: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComponents();
  }, []);

  // Derived state
  const categories = useMemo(() => {
    const cats = new Set(components.map(c => c.category));
    return Array.from(cats).sort();
  }, [components]);

  const filteredComponents = useMemo(() => {
    return components.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory ? c.category === filterCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [components, searchQuery, filterCategory]);

  // Handlers
  const handleAdd = () => {
    setSelectedComponent(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (component: Component) => {
    setSelectedComponent(component);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (component: Component) => {
    setSelectedComponent(component);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: ComponentInput) => {
    try {
      if (selectedComponent) {
        await api.updateComponent(selectedComponent.id, data);
        toast.success('Component updated successfully');
      } else {
        await api.createComponent(data);
        toast.success('Component created successfully');
      }
      loadComponents();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'An error occurred');
      throw error; // Rethrow to keep modal open if there's an error
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedComponent) return;
    try {
      await api.deleteComponent(selectedComponent.id);
      toast.success('Component deleted successfully');
      loadComponents();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'An error occurred');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <CircuitBoard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Electronics Inventory</h1>
              <p className="text-sm text-gray-500">Manage your components and stock</p>
            </div>
          </div>
          
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm font-medium"
          >
            <Plus size={18} />
            Add Component
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search components or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-gray-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ComponentList 
            components={filteredComponents}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        )}
      </main>

      <ComponentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedComponent}
      />
      
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        componentName={selectedComponent?.name || ''}
      />
    </div>
  );
}
