import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useMessageStore } from '@/stores/messageStore';
import { messagesApi } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDateTime, getRelativeTime } from '@/lib/utils';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function MessagesPage() {
  const { requestId } = useParams<{ requestId?: string }>();
  const { user } = useAuthStore();
  const { conversations, fetchMessages, sendMessage } = useMessageStore();
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = requestId ? conversations.get(requestId) || [] : [];

  useEffect(() => {
    if (requestId) {
      fetchMessages(requestId);
    }
  }, [requestId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !requestId || !user) return;

    setSending(true);
    try {
      const recipientId = messages[0]?.senderId === user.id 
        ? messages[0]?.recipientId 
        : messages[0]?.senderId;
      
      if (recipientId) {
        await sendMessage(requestId, messageText, user.id, recipientId);
        setMessageText('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!requestId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <Card>
          <p className="text-gray-600">Select a conversation to view messages</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link to="/dashboard/messages" className="text-primary-600 hover:text-primary-700 text-sm">
          ← Back to conversations
        </Link>
      </div>

      <Card className="flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwn ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-2`}>
                  {!isOwn && (
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {message.sender?.name || 'Unknown'}
                    </p>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                    {getRelativeTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!messageText.trim() || sending}>
              <PaperAirplaneIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}



