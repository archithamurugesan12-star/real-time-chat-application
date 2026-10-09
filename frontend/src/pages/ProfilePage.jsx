import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Sparkles, FileText, ArrowLeft, Save, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Avatar from '../components/common/Avatar';
import AvatarPickerModal from '../components/profile/AvatarPickerModal';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    await updateProfile({
      name: data.name.trim(),
      bio: data.bio.trim(),
      avatar: selectedAvatar,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          to="/chat"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Messages</span>
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
          {/* Card Banner */}
          <div className="h-32 bg-gradient-to-r from-brand-600 via-brand-700 to-accent relative" />

          {/* Profile Details Header */}
          <div className="px-6 sm:px-8 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-14 mb-6 gap-4">
              <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                <Avatar
                  src={selectedAvatar || user?.avatar}
                  name={user?.name}
                  size="2xl"
                  className="ring-4 ring-white shadow-xl"
                />
                <button
                  type="button"
                  className="absolute bottom-1 right-1 p-2 bg-brand-600 text-white rounded-full shadow-md hover:bg-brand-700 transition-colors"
                  title="Change avatar"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                    {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Display name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters' },
                    })}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Email Address (Verified)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed select-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Email cannot be changed after registration.
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Status / Bio
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <textarea
                    rows={3}
                    placeholder="Tell others a little about yourself..."
                    {...register('bio', {
                      maxLength: { value: 160, message: 'Maximum 160 characters' },
                    })}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                {errors.bio && (
                  <p className="text-xs text-rose-600 mt-1">{errors.bio.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={selectedAvatar}
        onSelectAvatar={setSelectedAvatar}
      />
    </div>
  );
};

export default ProfilePage;
