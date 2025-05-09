import { createFileRoute } from '@tanstack/react-router'
import EvidenceManagementPage from '../../pages/dashboard/evidence-management'

export const Route = createFileRoute('/dashboard/evidence-management')({
  component: EvidenceManagementPage,
}) 