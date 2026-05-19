import type {
  CatProfile,
  Challenge,
  DiaryEntry,
  FeedPost,
  LeaderboardEntry,
  LostCase,
  NotificationItem,
  SightingReport,
} from '@/types/domain';

export const images = {
  neko: require('@/assets/images/neko-mascot.jpg'),
  miu: require('@/assets/images/cat-miu.jpg'),
  beo: require('@/assets/images/cat-beo.jpg'),
  street: require('@/assets/images/cat-street.jpg'),
  huy: require('@/assets/images/avatar-huy.jpg'),
  silhouette: require('@/assets/images/cat-silhouette.jpg'),
};

export const cats: CatProfile[] = [
  {
    id: 'cat-miu',
    name: 'Miu',
    breed: 'Mèo ta',
    age: 2,
    gender: 'female',
    avatar: images.miu,
    maturity: 72,
    traits: ['Lông vàng nâu', 'Sọc tabby', 'Mắt xanh'],
  },
  {
    id: 'cat-beo',
    name: 'Béo',
    breed: 'British Shorthair',
    age: 3,
    gender: 'male',
    avatar: images.beo,
    maturity: 91,
    isLost: true,
    traits: ['Lông xám trắng', 'Mặt tròn', 'Đuôi ngắn'],
  },
];

export const feedPosts: FeedPost[] = [
  {
    id: 'post-1',
    catName: 'Miu',
    ownerName: 'Lan Nguyen',
    image: images.miu,
    caption: 'Boss vừa thắng challenge ngáp ngủ.',
    likes: 128,
    createdAt: '8 phút trước',
  },
  {
    id: 'post-2',
    catName: 'Bông',
    ownerName: 'Huy Nguyen',
    image: images.street,
    caption: 'Đi tuần ở ban công.',
    likes: 84,
    createdAt: '22 phút trước',
  },
];

export const todayChallenge: Challenge = {
  id: 'challenge-yawn',
  title: 'Boss ngáp ngủ',
  prompt: 'Căn dáng mèo theo silhouette rồi chụp trực tiếp.',
  silhouette: images.silhouette,
};

export const diaryEntries: DiaryEntry[] = [
  {
    id: 'diary-1',
    image: images.miu,
    caption: 'Lại ngủ nướng',
    author: 'Tuấn',
    createdAt: '2 phút trước',
  },
  {
    id: 'diary-2',
    image: images.street,
    caption: 'Canh cửa sổ',
    author: 'Mai',
    createdAt: 'Hôm qua',
  },
];

export const lostCases: LostCase[] = [
  {
    id: 'lost-beo',
    cat: cats[1],
    lastSeen: 'Cầu Rồng, Đà Nẵng',
    distanceMeters: 320,
    reportedAt: '14:32 hôm nay',
    notifiedCount: 412,
    status: 'active',
  },
];

export const sightings: SightingReport[] = [
  {
    id: 'sighting-1',
    lostCaseId: 'lost-beo',
    photo: images.street,
    confidence: 89,
    locationLabel: '47 Hoàng Sa, Đà Nẵng',
    status: 'pending',
    reporterName: 'Huy Nguyen',
  },
];

export const notifications: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'lost',
    title: 'Mèo lạc gần bạn',
    body: 'Béo đang mất tích cách bạn 320m. Bấm để mở Radar.',
    createdAt: '2 phút trước',
    unread: true,
  },
  {
    id: 'n-2',
    type: 'challenge',
    title: 'Challenge hôm nay',
    body: 'Boss ngáp ngủ. Chụp ngay để giữ streak.',
    createdAt: '1 giờ trước',
  },
  {
    id: 'n-3',
    type: 'reward',
    title: 'Bạn đạt #3 Daily Challenge',
    body: '+20 sao đã được cộng vào hồ sơ.',
    createdAt: 'Hôm qua',
  },
];

export const leaderboard: LeaderboardEntry[] = [
  {id: 'l-1', rank: 1, name: 'Huy N.', avatar: images.huy, stars: 220, streak: 6},
  {id: 'l-2', rank: 2, name: 'Lan N.', avatar: images.miu, stars: 194, streak: 8, isCurrentUser: true},
  {id: 'l-3', rank: 3, name: 'Mai T.', avatar: images.street, stars: 180, streak: 4},
  {id: 'l-4', rank: 4, name: 'Trang Ops', avatar: images.neko, stars: 145, streak: 3},
];
