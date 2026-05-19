import {
  cats,
  diaryEntries,
  feedPosts,
  leaderboard,
  lostCases,
  notifications,
  sightings,
  todayChallenge,
} from './mockData';

const wait = async (ms = 250) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));

export const mockApi = {
  async getCats() {
    await wait();
    return cats;
  },
  async getFeed() {
    await wait();
    return feedPosts;
  },
  async getTodayChallenge() {
    await wait();
    return todayChallenge;
  },
  async scoreChallenge() {
    await wait(600);
    return {score: 92, label: 'Tuyệt cú mèo'};
  },
  async getDiary() {
    await wait();
    return diaryEntries;
  },
  async getLostCasesNearby() {
    await wait();
    return lostCases;
  },
  async analyzeSighting() {
    await wait(800);
    return sightings[0];
  },
  async getNotifications() {
    await wait();
    return notifications;
  },
  async getLeaderboard() {
    await wait();
    return leaderboard;
  },
};
