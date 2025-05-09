import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/chat')({
  component: ChatComponent,
})

function ChatComponent() {
  return <div className="p-2">Chat with AI Page</div>
} 