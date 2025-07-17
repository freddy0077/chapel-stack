import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MOCK_MESSAGES = [
  { from: 'Admin', message: 'Welcome to the Church!', time: '2025-07-14 09:00', self: false },
  { from: 'You', message: 'Thank you!', time: '2025-07-14 09:05', self: true },
  { from: 'Admin', message: 'We hope to see you at the next service.', time: '2025-07-14 09:10', self: false },
];

export default function ConversationView({ conversationId, onBack }: { conversationId: string, onBack: () => void }) {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Conversation</h1>
      <Card className="p-6 space-y-4">
        {MOCK_MESSAGES.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 shadow ${msg.self ? 'bg-violet-100 text-violet-900' : 'bg-gray-100 text-gray-700'}`}>
              <div className="font-semibold text-xs mb-1">{msg.from}</div>
              <div>{msg.message}</div>
              <div className="text-[10px] text-gray-400 mt-1">{msg.time}</div>
            </div>
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <input className="flex-1 border rounded px-2 py-1" placeholder="Type a reply..." />
          <Button variant="gradient">Send</Button>
        </div>
        <Button onClick={onBack}>Back</Button>
      </Card>
    </div>
  );
}
