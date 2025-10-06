import { socialApi as apiClient } from '../core/serviceClients';
import type { ApiResponse, User, PaginatedResponse, SearchParams } from '../../types/api';

export interface SocialStats {
  followersCount: number;
  followingCount: number;
  mutualFollowersCount: number;
  postsCount: number;
  likesReceived: number;
  commentsReceived: number;
  sharesReceived: number;
  profileViews: number;
  engagementRate: number;
}

export interface FollowRequest {
  id: string;
  requester: User;
  requestedAt: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface SocialActivity {
  id: string;
  type: 'follow' | 'unfollow' | 'like' | 'comment' | 'share' | 'mention';
  actor: User;
  target?: {
    type: 'user' | 'post' | 'comment';
    id: string;
    title?: string;
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Relationship {
  userId: string;
  isFollowing: boolean;
  isFollowedBy: boolean;
  isMutual: boolean;
  isBlocked: boolean;
  isBlockedBy: boolean;
  isMuted: boolean;
  followedAt?: string;
  blockedAt?: string;
  mutedAt?: string;
}

class SocialService {
  private readonly baseUrl = '/social';
  private readonly usersUrl = '/users';

  // Following System
  async followUser(
    userId: string,
    message?: string
  ): Promise<
    ApiResponse<{
      relationship: Relationship;
      message: string;
      requiresApproval?: boolean;
    }>
  > {
    return apiClient.post(`${this.usersUrl}/follow/${userId}`, { message });
  }

  async unfollowUser(userId: string): Promise<
    ApiResponse<{
      relationship: Relationship;
      message: string;
    }>
  > {
    return apiClient.post(`${this.usersUrl}/unfollow/${userId}`);
  }

  async getFollowers(
    userId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<User & { followedAt: string }>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.usersUrl}/followers/${userId}${queryString}`);
  }

  async getFollowing(
    userId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<User & { followedAt: string }>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.usersUrl}/following/${userId}${queryString}`);
  }

  async getMutualFollowers(
    userId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/mutual-followers/${userId}${queryString}`);
  }

  // Follow Requests (for private accounts)
  async getFollowRequests(
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<FollowRequest>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/follow-requests${queryString}`);
  }

  async getSentFollowRequests(
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<FollowRequest>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/follow-requests/sent${queryString}`);
  }

  async acceptFollowRequest(requestId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/follow-requests/${requestId}/accept`);
  }

  async rejectFollowRequest(requestId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/follow-requests/${requestId}/reject`);
  }

  async cancelFollowRequest(requestId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/follow-requests/${requestId}`);
  }

  // Relationship Management
  async getRelationship(userId: string): Promise<ApiResponse<Relationship>> {
    return apiClient.get<Relationship>(`${this.baseUrl}/relationship/${userId}`);
  }

  async getBulkRelationships(
    userIds: string[]
  ): Promise<ApiResponse<Record<string, Relationship>>> {
    return apiClient.post(`${this.baseUrl}/relationships/bulk`, { userIds });
  }

  // Blocking System
  async blockUser(
    userId: string,
    reason?: string
  ): Promise<
    ApiResponse<{
      relationship: Relationship;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/block/${userId}`, { reason });
  }

  async unblockUser(userId: string): Promise<
    ApiResponse<{
      relationship: Relationship;
      message: string;
    }>
  > {
    return apiClient.delete(`${this.baseUrl}/block/${userId}`);
  }

  async getBlockedUsers(
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<User & { blockedAt: string; reason?: string }>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/blocked${queryString}`);
  }

  // Muting System
  async muteUser(
    userId: string,
    duration?: string
  ): Promise<
    ApiResponse<{
      relationship: Relationship;
      message: string;
      expiresAt?: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/mute/${userId}`, { duration });
  }

  async unmuteUser(userId: string): Promise<
    ApiResponse<{
      relationship: Relationship;
      message: string;
    }>
  > {
    return apiClient.delete(`${this.baseUrl}/mute/${userId}`);
  }

  async getMutedUsers(
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<User & { mutedAt: string; expiresAt?: string }>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/muted${queryString}`);
  }

  // Social Statistics
  async getSocialStats(userId: string): Promise<ApiResponse<SocialStats>> {
    return apiClient.get<SocialStats>(`${this.baseUrl}/stats/${userId}`);
  }

  async getEngagementMetrics(
    userId: string,
    timeRange: '7d' | '30d' | '90d' = '30d'
  ): Promise<
    ApiResponse<{
      totalEngagement: number;
      likesReceived: number;
      commentsReceived: number;
      sharesReceived: number;
      mentionsReceived: number;
      profileViews: number;
      followerGrowth: Array<{ date: string; count: number }>;
      engagementTrends: Array<{ date: string; engagement: number }>;
    }>
  > {
    const queryString = apiClient.buildQueryString({ timeRange });
    return apiClient.get(`${this.baseUrl}/engagement/${userId}${queryString}`);
  }

  // Social Activity Feed
  async getSocialActivity(
    params: {
      type?: 'all' | 'follows' | 'likes' | 'comments' | 'shares';
      userId?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<SocialActivity>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<SocialActivity>>(
      `${this.baseUrl}/activity${queryString}`
    );
  }

  async getMyActivity(
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<SocialActivity>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<SocialActivity>>(
      `${this.baseUrl}/activity/me${queryString}`
    );
  }

  // User Discovery & Recommendations
  async getRecommendedUsers(
    params: {
      type?: 'similar' | 'popular' | 'new' | 'mutual_connections';
      limit?: number;
      excludeFollowing?: boolean;
    } = {}
  ): Promise<
    ApiResponse<
      Array<
        User & {
          reason: string;
          mutualConnections?: number;
          similarityScore?: number;
        }
      >
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/recommendations${queryString}`);
  }

  async getSuggestedFollows(
    params: {
      category?: 'trending' | 'verified' | 'local' | 'interests';
      limit?: number;
    } = {}
  ): Promise<
    ApiResponse<
      Array<
        User & {
          category: string;
          score: number;
        }
      >
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/suggestions${queryString}`);
  }

  async getPeopleYouMayKnow(params: SearchParams = {}): Promise<
    ApiResponse<
      PaginatedResponse<
        User & {
          mutualConnections: User[];
          connectionReason: string;
        }
      >
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/people-you-may-know${queryString}`);
  }

  // Social Graph Analysis
  async getNetworkAnalysis(userId: string): Promise<
    ApiResponse<{
      networkSize: number;
      clusteringCoefficient: number;
      centralityScore: number;
      influenceScore: number;
      communityDetection: Array<{
        id: string;
        name: string;
        members: User[];
        strength: number;
      }>;
      connectionStrength: Record<string, number>;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/network-analysis/${userId}`);
  }

  async getInfluencerMetrics(userId: string): Promise<
    ApiResponse<{
      influenceScore: number;
      reach: number;
      engagement: number;
      authenticity: number;
      niche: string[];
      audienceQuality: {
        realFollowers: number;
        engagementRate: number;
        audienceGrowthRate: number;
      };
      topContent: Array<{
        postId: string;
        engagement: number;
        reach: number;
      }>;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/influencer-metrics/${userId}`);
  }

  // Social Lists & Groups
  async createFollowList(data: {
    name: string;
    description?: string;
    isPrivate?: boolean;
    members?: string[];
  }): Promise<
    ApiResponse<{
      listId: string;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/lists`, data);
  }

  async getFollowLists(params: SearchParams = {}): Promise<
    ApiResponse<
      PaginatedResponse<{
        id: string;
        name: string;
        description?: string;
        memberCount: number;
        isPrivate: boolean;
        createdAt: string;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/lists${queryString}`);
  }

  async addToFollowList(
    listId: string,
    userIds: string[]
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/lists/${listId}/members`, { userIds });
  }

  async removeFromFollowList(
    listId: string,
    userIds: string[]
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/lists/${listId}/members`, { data: { userIds } });
  }

  // Social Interactions
  async getInteractionHistory(
    userId: string,
    params: {
      type?: 'likes' | 'comments' | 'shares' | 'mentions';
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/interactions/${userId}${queryString}`);
  }

  async getSharedConnections(userId: string): Promise<
    ApiResponse<{
      mutualFollowers: User[];
      mutualFollowing: User[];
      sharedInterests: string[];
      connectionStrength: number;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/shared-connections/${userId}`);
  }

  // Privacy & Safety
  async updatePrivacySettings(settings: {
    profileVisibility?: 'public' | 'followers' | 'private';
    followRequestsRequired?: boolean;
    showFollowersList?: boolean;
    showFollowingList?: boolean;
    allowTagging?: 'everyone' | 'followers' | 'none';
    allowMentions?: 'everyone' | 'followers' | 'none';
    showOnlineStatus?: boolean;
    showLastSeen?: boolean;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`${this.baseUrl}/privacy-settings`, settings);
  }

  async getPrivacySettings(): Promise<ApiResponse<any>> {
    return apiClient.get(`${this.baseUrl}/privacy-settings`);
  }

  async reportUser(
    userId: string,
    data: {
      reason:
        | 'spam'
        | 'harassment'
        | 'hate_speech'
        | 'fake_account'
        | 'inappropriate_content'
        | 'other';
      description?: string;
      evidence?: string[];
    }
  ): Promise<
    ApiResponse<{
      reportId: string;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/report/${userId}`, data);
  }

  // Social Verification
  async requestVerification(data: {
    type: 'identity' | 'business' | 'celebrity' | 'organization';
    documents: string[];
    reason: string;
    additionalInfo?: Record<string, any>;
  }): Promise<
    ApiResponse<{
      requestId: string;
      status: 'pending' | 'under_review' | 'approved' | 'rejected';
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/verification/request`, data);
  }

  async getVerificationStatus(): Promise<
    ApiResponse<{
      isVerified: boolean;
      verificationBadge?: string;
      requestStatus?: 'pending' | 'under_review' | 'approved' | 'rejected';
      submittedAt?: string;
      reviewedAt?: string;
      reason?: string;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/verification/status`);
  }

  // Social Events & Mentions
  async getMentions(
    params: {
      type?: 'posts' | 'comments' | 'all';
      status?: 'unread' | 'read' | 'all';
      page?: number;
      limit?: number;
    } = {}
  ): Promise<
    ApiResponse<
      PaginatedResponse<{
        id: string;
        type: 'post' | 'comment';
        content: string;
        author: User;
        mentionedAt: string;
        isRead: boolean;
        context: any;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/mentions${queryString}`);
  }

  async markMentionAsRead(mentionId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/mentions/${mentionId}/read`);
  }

  // Bulk Operations
  async bulkFollow(userIds: string[]): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ userId: string; error: string }>;
      requireApproval: string[];
    }>
  > {
    return apiClient.post(`${this.baseUrl}/bulk/follow`, { userIds });
  }

  async bulkUnfollow(userIds: string[]): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ userId: string; error: string }>;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/bulk/unfollow`, { userIds });
  }

  async bulkBlock(
    userIds: string[],
    reason?: string
  ): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ userId: string; error: string }>;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/bulk/block`, { userIds, reason });
  }

  // Social Analytics Export
  async exportSocialData(params: {
    type: 'followers' | 'following' | 'interactions' | 'analytics';
    format?: 'csv' | 'json';
    timeRange?: '30d' | '90d' | '1y' | 'all';
  }): Promise<
    ApiResponse<{
      downloadUrl: string;
      expiresAt: string;
      recordCount: number;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.post(`${this.baseUrl}/export${queryString}`);
  }

  // Real-time Social Updates
  async subscribeToSocialUpdates(
    callback: (update: { type: 'follow' | 'unfollow' | 'block' | 'mention'; data: any }) => void
  ): () => void {
    const ws = new WebSocket(
      `${apiClient.getInstance().defaults.baseURL?.replace('http', 'ws')}/social/live`
    );

    ws.onmessage = event => {
      try {
        const update = JSON.parse(event.data);
        callback(update);
      } catch (error) {}
    };

    return () => ws.close();
  }

  // Social Insights
  async getSocialInsights(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<
    ApiResponse<{
      followerGrowth: {
        current: number;
        change: number;
        trend: 'up' | 'down' | 'stable';
      };
      engagementMetrics: {
        totalEngagement: number;
        averageEngagement: number;
        engagementRate: number;
        topEngagingFollowers: User[];
      };
      contentPerformance: {
        topPosts: Array<{ id: string; engagement: number }>;
        bestPostingTimes: Array<{ hour: number; engagement: number }>;
        topHashtags: Array<{ tag: string; usage: number; engagement: number }>;
      };
      audienceInsights: {
        demographics: Record<string, number>;
        interests: Record<string, number>;
        activeHours: Record<string, number>;
        topLocations: Record<string, number>;
      };
    }>
  > {
    const queryString = apiClient.buildQueryString({ timeRange });
    return apiClient.get(`${this.baseUrl}/insights${queryString}`);
  }
}

export const socialService = new SocialService();
export default socialService;
