import { createFileRoute, Outlet } from '@tanstack/react-router';
import Dashboard from '../pages/dashboard'; // Corrected import path

export const Route = createFileRoute('/dashboard')({
  component: Dashboard, // Use the imported Dashboard component
}); 