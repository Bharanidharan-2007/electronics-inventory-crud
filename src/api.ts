import axios from 'axios';
import { Component, ComponentInput } from './types';

// Axios instance configured to point to the proxy/backend
const api = axios.create({
  baseURL: '/api',
});

/**
 * Fetch all components, optionally filtered by category
 */
export const getComponents = async (category?: string): Promise<Component[]> => {
  const url = category ? `/components?category=${encodeURIComponent(category)}` : '/components';
  const response = await api.get(url);
  return response.data;
};

/**
 * Create a new component
 */
export const createComponent = async (data: ComponentInput): Promise<Component> => {
  const response = await api.post('/components', data);
  return response.data;
};

export const updateComponent = async (id: number, data: ComponentInput): Promise<Component> => {
  const response = await api.put(`/components/${id}`, data);
  return response.data;
};

export const deleteComponent = async (id: number): Promise<void> => {
  await api.delete(`/components/${id}`);
};
