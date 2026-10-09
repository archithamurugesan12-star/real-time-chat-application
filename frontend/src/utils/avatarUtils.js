export const PRESET_AVATARS = [
  { id: '1', name: 'Cyber Hero', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alpha' },
  { id: '2', name: 'Matrix Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Matrix' },
  { id: '3', name: 'Sparky', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky' },
  { id: '4', name: 'Nova', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nova' },
  { id: '5', name: 'Pixel Fox', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix' },
  { id: '6', name: 'Vibe King', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver' },
  { id: '7', name: 'Aura', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bella' },
  { id: '8', name: 'Mystic', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna' },
  { id: '9', name: 'Echo', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Echo' },
  { id: '10', name: 'Cosmo', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Cosmo' },
  { id: '11', name: 'Zephyr', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Zephyr' },
  { id: '12', name: 'Blaze', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Blaze' },
];

export const getFallbackAvatar = (name = 'User') => {
  const seed = encodeURIComponent(name.trim() || 'User');
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
};

export const getInitials = (name = '') => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
