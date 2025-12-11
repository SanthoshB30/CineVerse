/**
 * CineVerse Avatar Configuration
 */

// Main avatars - simplified to only show 7 avatars
export const AVATARS = [
  {
    id: 'avatar_1',
    name: 'Avatar 1',
    imagePath: '/assets/avatars/avatar-1.png',
  },
  {
    id: 'avatar_2',
    name: 'Avatar 2',
    imagePath: '/assets/avatars/avatar-2.png',
  },
  {
    id: 'avatar_3',
    name: 'Avatar 3',
    imagePath: '/assets/avatars/avatar-3.png',
  },
  {
    id: 'avatar_4',
    name: 'Avatar 4',
    imagePath: '/assets/avatars/avatar-4.png',
  },
  {
    id: 'avatar_5',
    name: 'Avatar 5',
    imagePath: '/assets/avatars/avatar-5.png',
  },
  {
    id: 'avatar_6',
    name: 'Avatar 6',
    imagePath: '/assets/avatars/avatar-6.png',
  },
  {
    id: 'avatar_7',
    name: 'Avatar 7',
    imagePath: '/assets/avatars/avatar-7.png',
  }
];

export const DEFAULT_AVATAR = AVATARS[0];

export const getAvatarById = (id) => {
  return AVATARS.find(avatar => avatar.id === id) || DEFAULT_AVATAR;
};

export default {
  AVATARS,
  DEFAULT_AVATAR,
  getAvatarById
};
