import React, { useState } from 'react';
import { X, Check, Link as LinkIcon, Sparkles } from 'lucide-react';
import { PRESET_AVATARS } from '../../utils/avatarUtils';
import Avatar from '../common/Avatar';

export const AvatarPickerModal = ({ isOpen, onClose, currentAvatar, onSelectAvatar }) => {
  const [selected, setSelected] = useState(currentAvatar || PRESET_AVATARS[0].url);
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    onSelectAvatar(selected);
    onClose();
  };

  const handleCustomApply = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setSelected(customUrl.trim());
      onSelectAvatar(customUrl.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-800">Choose an Avatar</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Current Selection Preview */}
          <div className="flex flex-col items-center justify-center py-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Avatar src={selected} name="Selected" size="xl" />
            <span className="text-xs text-slate-500 font-medium mt-2">Active Avatar Preview</span>
          </div>

          {/* Preset Avatars Grid */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Preset Avatars
            </label>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = selected === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelected(preset.url)}
                    className={`relative p-2 rounded-xl transition-all flex flex-col items-center gap-1.5 group ${
                      isSelected
                        ? 'bg-brand-50 ring-2 ring-brand-600 shadow-sm'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <Avatar src={preset.url} name={preset.name} size="md" />
                    <span className="text-[10px] text-slate-600 font-medium truncate w-full text-center">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Avatar URL Input */}
          <form onSubmit={handleCustomApply} className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Or Use Custom Image URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={!customUrl.trim()}
                className="px-3 py-2 text-xs font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
              >
                Use URL
              </button>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            Select Avatar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarPickerModal;
