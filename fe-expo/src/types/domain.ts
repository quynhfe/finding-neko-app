export type User = {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: string;
};

export type CatProfile = {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  avatar: number;
  maturity: number;
  isLost?: boolean;
  traits: string[];
};

export type FeedPost = {
  id: string;
  catName: string;
  ownerName: string;
  image: number;
  caption: string;
  likes: number;
  createdAt: string;
};

export type Challenge = {
  id: string;
  title: string;
  prompt: string;
  silhouette: number;
};

export type DiaryEntry = {
  id: string;
  image: number;
  caption: string;
  author: string;
  createdAt: string;
};

export type LostCase = {
  id: string;
  cat: CatProfile;
  lastSeen: string;
  distanceMeters: number;
  reportedAt: string;
  notifiedCount: number;
  status: 'active' | 'found';
};

export type SightingReport = {
  id: string;
  lostCaseId: string;
  photo: number;
  confidence: number;
  locationLabel: string;
  status: 'pending' | 'confirmed' | 'rejected';
  reporterName: string;
};

export type NotificationItem = {
  id: string;
  type: 'lost' | 'like' | 'challenge' | 'system' | 'reward';
  title: string;
  body: string;
  createdAt: string;
  unread?: boolean;
};

export type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  avatar: number;
  stars: number;
  streak: number;
  isCurrentUser?: boolean;
};
