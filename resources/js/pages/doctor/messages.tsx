import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Search, Send } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Messages', href: '/doctor/messages' },
];

export default function AdminMessages({ users, messages, selectedUserId, search, authUserId }) {
  const [searchValue, setSearchValue] = useState(search || '');
  const [selectedUser, setSelectedUser] = useState(selectedUserId || '');
  const { data, setData, post, reset } = useForm({
    receiver_id: selectedUser || '',
    body: '',
  });

  // Scroll to bottom on new messages
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedUser]);

  function handleSearch(e) {
    e.preventDefault();
    router.get(route('doctor.messages.index'), { search: searchValue });
  }

  function handleSelectUser(userId) {
    setSelectedUser(userId);
    setData('receiver_id', userId);
    router.get(route('doctor.messages.index'), { user: userId, search: searchValue });
  }

  function handleSend(e) {
    e.preventDefault();
    if (!data.body.trim()) return;
    post(route('doctor.messages.send'), {
      preserveScroll: true,
      onSuccess: () => reset('body'),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Messages" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="relative min-h-[70vh] flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-blue-950 overflow-hidden flex flex-col md:flex-row">
          <PlaceholderPattern className="absolute inset-0 size-full stroke-blue-100/30 dark:stroke-blue-900/30 pointer-events-none" />
          {/* Sidebar */}
          <aside className="z-10 relative w-full md:w-80 bg-white/90 dark:bg-blue-950/80 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col">
            <form onSubmit={handleSearch} className="px-4 py-3 flex gap-2 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-blue-950/90">
              <Input
                placeholder="Search users..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="flex-1 bg-blue-50/40 dark:bg-blue-950/80"
                autoComplete="off"
              />
              <Button type="submit" size="icon" variant="ghost" className="rounded-full text-blue-600 dark:text-blue-200">
                <Search className="h-5 w-5" />
              </Button>
            </form>
            <div className="flex-1 overflow-y-auto">
              {users.length === 0 && (
                <div className="text-center text-blue-300 p-4">No users found.</div>
              )}
              {users.map(user => (
                <button
                  key={user.id}
                  type="button"
                  className={cn(
                    "w-full text-left px-4 py-3 border-gray-200 dark:border-gray-800 transition-all",
                    selectedUser == user.id
                      ? "bg-blue-50 dark:bg-blue-900/70 font-semibold border-l-2 border-blue-500"
                      : "hover:bg-blue-50/60 dark:hover:bg-blue-950"
                  )}
                  onClick={() => handleSelectUser(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center text-lg font-bold text-blue-700 dark:text-blue-100 uppercase shadow">
                      {user.name?.[0]}
                    </div>
                    <div className="flex-1">
                      <div className="truncate">{user.name}</div>
                      <div className="text-xs text-blue-700/70 dark:text-blue-200 truncate">{user.email}</div>
                      <div className="text-xs text-blue-400 dark:text-blue-400 capitalize">{user.role}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>
          {/* Main Chat */}
          <main className="relative flex-1 flex flex-col bg-white/90 dark:bg-blue-950/60 min-h-[40vh]">
            {selectedUser ? (
              <>
                <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 bg-blue-50/70 dark:bg-blue-950/80 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center text-lg font-bold text-blue-700 dark:text-blue-100 uppercase shadow">
                    {users.find(u => u.id == selectedUser)?.name?.[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-base text-blue-900 dark:text-blue-50">
                      {users.find(u => u.id == selectedUser)?.name || 'Conversation'}
                    </div>
                    <div className="text-xs text-blue-700/70 dark:text-blue-200">{users.find(u => u.id == selectedUser)?.email}</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gradient-to-b from-white via-blue-50/60 to-white dark:from-blue-950/40 dark:to-blue-950/70">
                  {messages.length === 0 && (
                    <div className="text-center text-blue-200 mt-10">No messages yet.</div>
                  )}
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[90%] md:max-w-[65%] rounded-2xl px-4 py-2 shadow-sm mb-2 break-words border border-gray-200 dark:border-gray-800",
                        message.sender_id === authUserId
                          ? "ml-auto bg-blue-100 text-blue-900 text-right"
                          : "mr-auto bg-white dark:bg-blue-900/80 text-blue-900 dark:text-blue-100"
                      )}
                    >
                      <div className="text-sm">{message.body}</div>
                      <div className="text-xs text-blue-800/60 dark:text-blue-300/60 mt-1">
                        {new Date(message.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form
                  onSubmit={handleSend}
                  className="border-t border-gray-200 dark:border-gray-800 flex gap-2 p-4 bg-white/95 dark:bg-blue-950/90"
                >
                  <Textarea
                    value={data.body}
                    onChange={e => setData('body', e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 resize-none rounded-xl bg-blue-50/60 dark:bg-blue-950/80 border border-gray-200 dark:border-gray-800"
                    rows={1}
                    required
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!data.body.trim()}
                    className="rounded-full h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-blue-200 text-lg">
                Select a user to start messaging.
              </div>
            )}
          </main>
        </div>
      </div>
    </AppLayout>
  );
}

