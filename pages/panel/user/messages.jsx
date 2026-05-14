import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

function UserMessagesBody() {
  const { lng, tp } = useBeneficiaryPanelLocale();
  const dateLocale = lng === 'en' ? 'en-GB' : 'pl-PL';
  const [messages, setMessages] = useState([]);
  const [coordinator, setCoordinator] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchChat = async () => {
    try {
      const res = await fetch('/api/user/messages');
      const json = await res.json();
      if (res.ok && json.data) {
        setCoordinator(json.data.coordinator);
        setMessages(json.data.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !coordinator) return;

    setSending(true);
    try {
      const res = await fetch('/api/user/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, coordinatorId: coordinator.id }),
      });
      const json = await res.json();

      if (res.ok && json.data) {
        setMessages((prev) => [...prev, json.data]);
        setNewMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold">{tp('messagesPage.title')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
        <Card className="col-span-1 md:col-span-1 overflow-y-auto shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{tp('messagesPage.conversations')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {coordinator ? (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl cursor-pointer border-l-4 border-blue-500 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white">{tp('messagesPage.yourCoordinator')}</h3>
                <p className="text-xs text-gray-500 truncate font-mono mt-1">{coordinator.name}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">{tp('messagesPage.noCoordinator')}</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3 flex flex-col shadow-sm">
          <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-900/50">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>
                {coordinator
                  ? tp('messagesPage.chatWith', { name: coordinator.name })
                  : tp('messagesPage.pickConversation')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 dark:bg-gray-900/30">
              {loading ? (
                <div className="flex justify-center items-center h-full text-gray-400">{tp('messagesPage.loadingChat')}</div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-400 flex-col gap-2">
                  <MessageSquare className="h-10 w-10 opacity-20" />
                  <span>{tp('messagesPage.emptyChat')}</span>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${msg.isFromMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span
                        className={`text-[10px] mt-2 block font-medium ${msg.isFromMe ? 'text-blue-200 text-right' : 'text-gray-400 text-left'}`}
                      >
                        {new Date(msg.timestamp).toLocaleString(dateLocale)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t bg-white dark:bg-gray-950 flex gap-3 shrink-0">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!coordinator}
                placeholder={tp('messagesPage.placeholder')}
                className="flex-1 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-blue-500 rounded-xl"
              />
              <Button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim() || !coordinator}
                className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 shrink-0 shadow-sm transition-transform hover:scale-105 active:scale-95 p-0 flex items-center justify-center"
              >
                <Send className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function UserMessages() {
  return (
    <PanelLayout role="user">
      <UserMessagesBody />
    </PanelLayout>
  );
}
