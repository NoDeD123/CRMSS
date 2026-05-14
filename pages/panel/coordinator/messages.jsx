import React, { useState, useEffect } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MessageSquare, Send, UserX, Clock, MessageCirclePlus, Search, ArrowRight } from 'lucide-react';

export default function CoordinatorMessages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);

  const [contactedBeneficiaries, setContactedBeneficiaries] = useState([]);
  const [nonContactedBeneficiaries, setNonContactedBeneficiaries] = useState([]);

  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/coordinator/messages');
      const json = await res.json();
      if (res.ok && json.data) {
        setContactedBeneficiaries(json.data.contactedBeneficiaries || []);
        setNonContactedBeneficiaries(json.data.nonContactedBeneficiaries || []);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const openChat = async (user) => {
    setActiveChatUser(user);
    setChatMessages([]);
    setChatOpen(true);

    try {
      const res = await fetch(`/api/coordinator/messages/${user.id}`);
      const json = await res.json();
      if (res.ok && json.data) {
        setChatMessages(json.data);
      }

      // Update local unread count since we opened the chat
      setContactedBeneficiaries(prev =>
        prev.map(b => b.id === user.id ? { ...b, unread: 0 } : b)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatUser) return;

    setSending(true);
    try {
      const res = await fetch(`/api/coordinator/messages/${activeChatUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      });
      const json = await res.json();

      if (res.ok && json.data) {
        setChatMessages(prev => [...prev, json.data]);
        setNewMessage('');
        fetchContacts(); // Refresh snippet in background
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <PanelLayout role="coordinator">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-purple-500" /> Centrum wiadomości
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Zarządzaj komunikacją ze swoimi podopiecznymi</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          </div>
          <Input
            type="text"
            placeholder="Szukaj beneficjenta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-10">

        {/* Aktywne Konwersacje */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <MessageCirclePlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Aktywne konwersacje</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactedBeneficiaries.map((user) => (
              <Card
                key={user.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-t-0 border-x-0 border-b-4 border-b-transparent hover:border-b-blue-500"
                onClick={() => openChat(user)}
              >
                <CardContent className="p-6 relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{user.name}</h3>
                      <p className="text-xs font-mono text-gray-500">{user.unique_id}</p>
                    </div>
                    {user.unread > 0 ? (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-0.5 rounded-full animate-in zoom-in duration-300">
                        {user.unread} nowe
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400 border-gray-200">
                        Przeczytane
                      </Badge>
                    )}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate italic">
                      "{user.snippet}"
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Ostatnia akt: {new Date(user.lastMsg).toLocaleDateString()}</span>
                    <span className="text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Otwórz czat <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {contactedBeneficiaries.length === 0 && !loading && (
              <p className="text-gray-500 col-span-full">Brak aktywnych konwersacji.</p>
            )}
          </div>
        </section>

        {/* Brak Kontaktów */}
        <section className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <UserX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Podopieczni bez kontaktu</h2>
            <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-700">{nonContactedBeneficiaries.length}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nonContactedBeneficiaries.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer group flex items-center justify-between"
                onClick={() => openChat(user)}
              >
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 transition-colors">{user.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{user.unique_id}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                  <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                </div>
              </div>
            ))}
            {nonContactedBeneficiaries.length === 0 && !loading && (
              <p className="text-gray-500 col-span-full">Wszyscy beneficjenci nawiązali kontakt.</p>
            )}
          </div>
        </section>
      </div>

      {/* Modal / Dialog Czatu */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-2xl bg-gray-50 dark:bg-gray-900 p-0 gap-0 overflow-hidden border-gray-200 dark:border-gray-800">
          {activeChatUser && (
            <>
              {/* Header Czatu */}
              <div className="bg-white dark:bg-gray-950 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {activeChatUser.name.charAt(0)}
                  </div>
                  <div>
                    <DialogTitle className="text-lg text-gray-900 dark:text-white leading-none">{activeChatUser.name}</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 font-mono mt-1">ID: {activeChatUser.unique_id}</DialogDescription>
                  </div>
                </div>
              </div>

              {/* Okno Rozmowy */}
              <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/50 relative flex flex-col">
                {/* Wstępna pusta informacja dla niekontakujących się */}
                {chatMessages.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 opacity-70">
                    <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                    <p>Brak historii konwersacji z tym podopiecznym.</p>
                    <p className="text-sm">Napisz pierwszą wiadomość poniżej.</p>
                  </div>
                ) : (
                  chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${msg.isFromMe ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <span className={`text-[10px] mt-2 block font-medium ${msg.isFromMe ? 'text-purple-200' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pole Input */}
              <div className="bg-white dark:bg-gray-950 p-4 border-t border-gray-200 dark:border-gray-800 flex gap-3 items-center">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Napisz wiadomość do podopiecznego..."
                  className="flex-1 bg-gray-100 dark:bg-gray-900 border-transparent focus-visible:ring-purple-500 h-12 rounded-xl"
                />
                <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 w-12 p-0 flex items-center justify-center flex-shrink-0 shadow-md transition-transform hover:scale-105 active:scale-95">
                  <Send className="h-5 w-5 ml-1" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </PanelLayout>
  );
}
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'pl', ['common'])),
    },
  };
}
