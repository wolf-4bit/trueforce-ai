import { createFileRoute } from '@tanstack/react-router'
import ReportsComponent from '../../pages/dashboard/reports'    

export const Route = createFileRoute('/dashboard/reports')({
    component: ReportsComponent,
})