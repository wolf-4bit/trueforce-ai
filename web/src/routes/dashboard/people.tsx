import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/people')({
  component: PeopleComponent,
})

function PeopleComponent() {
  return <div className="p-2">People Page</div>
} 