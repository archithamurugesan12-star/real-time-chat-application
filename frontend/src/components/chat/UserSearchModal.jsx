import React, { useState, useEffect } from 'react';
import { Search, X, UserPlus, MessageSquare, Loader2, Sparkles, UserX } from 'lucide-react';
import userService from '../../services/userService';
import { useDebounce } from '../../hooks/useDebounce';
import { useSocket } from '../../context/SocketContext';
import { useChat } from '../../context/ChatContext';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';

export const UserSearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { checkIsOnline } = useSocket();
  const { startConversationWithUser } = useChat();

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await userService.searchUsers(debouncedSearch);
        if (data.success) {
          setResults(data.users || []);
        }
      } catch (error) {
        console.error('Failed to search users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch, isOpen]);

  if (!isOpen) return null;

  const handleSelectUser = async (user) => {
    await startConversationWithUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-100 text-brand-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Find & Chat with Users</h3>
              <p className="text-xs text-slate-500">Search by name or email address</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 min-h-[220px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <p className="text-sm font-medium">Searching for users...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item) => {
                const isOnline = checkIsOnline(item._id) || item.isOnline;
                return (
                  <div
                    key={item._id}
                    onClick={() => handleSelectUser(item)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={item.avatar}
                        name={item.name}
                        size="md"
                        isOnline={isOnline}
                        showStatus={true}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-slate-800 group-hover:text-brand-600 transition-colors truncate">
                            {item.name}
                          </h4>
                          <StatusBadge isOnline={isOnline} showLabel={false} />
                        </div>
                        <p className="text-xs text-slate-400 truncate">{item.email}</p>
                        {item.bio && (
                          <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                            "{item.bio}"
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <UserX className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="font-semibold text-slate-700 text-sm">No matching users found</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                {searchTerm
                  ? `No user found for "${searchTerm}". Try another keyword or email.`
                  : 'No other users registered yet. Invite someone to join ConnectHub!'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
