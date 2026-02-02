/**
 * API Service for Campus Media
 * Handles all AJAX requests to the .NET backend API
 */

// URL to backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Add auth token if available
  const token = sessionStorage.getItem("authToken");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============================================
// AUTH API
// ============================================

/**
 * Login user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, token: string}>}
 */
export async function login(email, password) {
  const response = await fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Store token for subsequent requests
  if (response.token) {
    sessionStorage.setItem("authToken", response.token);
  }

  return response;
}

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise<{user: object, token: string}>}
 */
export async function register(userData) {
  const response = await fetchApi("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  // Store token for subsequent requests
  if (response.token) {
    sessionStorage.setItem("authToken", response.token);
  }

  return response;
}

/**
 * Logout user - clears session
 */
export async function logout() {
  try {
    await fetchApi("/auth/logout", { method: "POST" });
  } catch (error) {
    // Ignore logout errors
  } finally {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("currentUser");
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<object|null>}
 */
export async function getCurrentUser() {
  try {
    const response = await fetchApi("/auth/me");
    return response;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user is authenticated (has valid session)
 * @returns {Promise<boolean>}
 */
export async function checkAuthStatus() {
  try {
    await fetchApi("/auth/status");
    return true;
  } catch {
    return false;
  }
}

// ============================================
// STUDENTS API
// ============================================

/**
 * Get all students
 * @returns {Promise<Array>}
 */
export async function getStudents() {
  return await fetchApi("/students");
}

/**
 * Get a student by ID
 * @param {number} id
 * @returns {Promise<object>}
 */
export async function getStudentById(id) {
  return await fetchApi(`/students/${id}`);
}

/**
 * Create a new student
 * @param {object} studentData
 * @returns {Promise<object>}
 */
export async function createStudent(studentData) {
  return await fetchApi("/students", {
    method: "POST",
    body: JSON.stringify(studentData),
  });
}

/**
 * Update a student
 * @param {number} id
 * @param {object} updates
 * @returns {Promise<object>}
 */
export async function updateStudent(id, updates) {
  return await fetchApi(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a student
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteStudent(id) {
  return await fetchApi(`/students/${id}`, {
    method: "DELETE",
  });
}

// ============================================
// POSTS API
// ============================================

/**
 * Get posts for the feed (user's posts + friends' posts)
 * @returns {Promise<Array>}
 */
export async function getFeedPosts() {
  return await fetchApi("/posts/feed");
}

/**
 * Get posts for a specific user
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export async function getUserPosts(userId) {
  return await fetchApi(`/posts/user/${userId}`);
}

/**
 * Create a new post
 * @param {object} postData - { caption, image }
 * @returns {Promise<object>}
 */
export async function createPost(postData) {
  return await fetchApi("/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
}

/**
 * Delete a post
 * @param {number} postId
 * @returns {Promise<void>}
 */
export async function deletePost(postId) {
  return await fetchApi(`/posts/${postId}`, {
    method: "DELETE",
  });
}

/**
 * Like a post
 * @param {number} postId
 * @returns {Promise<object>}
 */
export async function likePost(postId) {
  return await fetchApi(`/posts/${postId}/like`, {
    method: "POST",
  });
}

/**
 * Unlike a post
 * @param {number} postId
 * @returns {Promise<object>}
 */
export async function unlikePost(postId) {
  return await fetchApi(`/posts/${postId}/unlike`, {
    method: "POST",
  });
}

// ============================================
// FRIENDS API
// ============================================

/**
 * Get friend suggestions for current user
 * @returns {Promise<Array>}
 */
export async function getSuggestions() {
  return await fetchApi("/friends/suggestions");
}

/**
 * Add a friend
 * @param {number} friendId
 * @returns {Promise<object>}
 */
export async function addFriend(friendId) {
  return await fetchApi(`/friends/${friendId}`, {
    method: "POST",
  });
}

/**
 * Remove a friend
 * @param {number} friendId
 * @returns {Promise<void>}
 */
export async function removeFriend(friendId) {
  return await fetchApi(`/friends/${friendId}`, {
    method: "DELETE",
  });
}

/**
 * Remove from suggestions (dismiss)
 * @param {number} userId
 * @returns {Promise<void>}
 */
export async function dismissSuggestion(userId) {
  return await fetchApi(`/friends/suggestions/${userId}`, {
    method: "DELETE",
  });
}

/**
 * Get friends list for current user
 * @returns {Promise<Array>}
 */
export async function getFriends() {
  return await fetchApi("/friends");
}

// ============================================
// FRIEND REQUESTS API
// ============================================

/**
 * Send a friend request
 * @param {number} receiverId
 * @returns {Promise<object>}
 */
export async function sendFriendRequest(receiverId) {
  return await fetchApi(`/friendrequest/${receiverId}`, {
    method: "POST",
  });
}

/**
 * Get pending friend requests (received)
 * @returns {Promise<Array>}
 */
export async function getPendingFriendRequests() {
  return await fetchApi("/friendrequest/pending");
}

/**
 * Get sent friend requests
 * @returns {Promise<Array>}
 */
export async function getSentFriendRequests() {
  return await fetchApi("/friendrequest/sent");
}

/**
 * Get friend request status with another user
 * @param {number} otherUserId
 * @returns {Promise<object>} - { status: "friends" | "sent" | "received" | null }
 */
export async function getFriendRequestStatus(otherUserId) {
  return await fetchApi(`/friendrequest/status/${otherUserId}`);
}

/**
 * Accept a friend request
 * @param {number} requestId
 * @returns {Promise<object>}
 */
export async function acceptFriendRequest(requestId) {
  return await fetchApi(`/friendrequest/${requestId}/accept`, {
    method: "POST",
  });
}

/**
 * Reject a friend request
 * @param {number} requestId
 * @returns {Promise<object>}
 */
export async function rejectFriendRequest(requestId) {
  return await fetchApi(`/friendrequest/${requestId}/reject`, {
    method: "POST",
  });
}

/**
 * Cancel a sent friend request
 * @param {number} requestId
 * @returns {Promise<object>}
 */
export async function cancelFriendRequest(requestId) {
  return await fetchApi(`/friendrequest/${requestId}`, {
    method: "DELETE",
  });
}

// ============================================
// STORIES API
// ============================================

/**
 * Get stories for the feed
 * @returns {Promise<Array>}
 */
export async function getStories() {
  return await fetchApi("/stories");
}

/**
 * Mark story as viewed
 * @param {number} storyId
 * @returns {Promise<void>}
 */
export async function markStoryViewed(storyId) {
  return await fetchApi(`/stories/${storyId}/view`, {
    method: "POST",
  });
}

// ============================================
// UNIVERSITIES API
// ============================================

/**
 * Get all universities
 * @returns {Promise<Array>}
 */
export async function getUniversities() {
  return await fetchApi("/universities");
}

/**
 * Get university by ID
 * @param {number} id
 * @returns {Promise<object>}
 */
export async function getUniversityById(id) {
  return await fetchApi(`/universities/${id}`);
}

/**
 * Get universities ranked by rating
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getTopUniversities(limit = 5) {
  return await fetchApi(`/universities/top?limit=${limit}`);
}

// ============================================
// PEDAGOGUES API
// ============================================

/**
 * Get all pedagogues/professors
 * @returns {Promise<Array>}
 */
export async function getPedagogues() {
  return await fetchApi("/pedagogues");
}

/**
 * Get top rated pedagogues
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getTopPedagogues(limit = 5) {
  return await fetchApi(`/pedagogues/top?limit=${limit}`);
}

/**
 * Search pedagogues by name, course, or research area
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchPedagogues(query) {
  return await fetchApi(`/pedagogues/search?q=${encodeURIComponent(query)}`);
}

/**
 * Find matching professors for student
 * @param {object} filters - { university, courses }
 * @returns {Promise<Array>}
 */
export async function findMatchingProfessors(filters) {
  return await fetchApi("/pedagogues/match", {
    method: "POST",
    body: JSON.stringify(filters),
  });
}

// ============================================
// REVIEWS API
// ============================================

/**
 * Get all reviews
 * @returns {Promise<Array>}
 */
export async function getReviews() {
  return await fetchApi("/reviews");
}

/**
 * Get reviews for a university
 * @param {number} universityId
 * @returns {Promise<Array>}
 */
export async function getUniversityReviews(universityId) {
  return await fetchApi(`/reviews/university/${universityId}`);
}

/**
 * Get reviews for a pedagogue
 * @param {number} pedagogueId
 * @returns {Promise<Array>}
 */
export async function getPedagogueReviews(pedagogueId) {
  return await fetchApi(`/reviews/pedagogue/${pedagogueId}`);
}

/**
 * Create a review
 * @param {object} reviewData - { targetType, targetId, score, comment }
 * @returns {Promise<object>}
 */
export async function createReview(reviewData) {
  return await fetchApi("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

/**
 * Update a review
 * @param {string} reviewId
 * @param {object} updates
 * @returns {Promise<object>}
 */
export async function updateReview(reviewId, updates) {
  return await fetchApi(`/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a review
 * @param {string} reviewId
 * @returns {Promise<void>}
 */
export async function deleteReview(reviewId) {
  return await fetchApi(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

/**
 * Get reviews by current user
 * @returns {Promise<Array>}
 */
export async function getMyReviews() {
  return await fetchApi("/reviews/me");
}

// ============================================
// PROGRAMS API
// ============================================

/**
 * Get matching programs for a student
 * @param {object} filters - { department, type }
 * @returns {Promise<Array>}
 */
export async function getMatchingPrograms(filters) {
  const params = new URLSearchParams();
  if (filters.department) params.append("department", filters.department);
  if (filters.type) params.append("type", filters.type);
  return await fetchApi(`/programs/match?${params.toString()}`);
}

/**
 * Get all program types
 * @returns {Promise<Array>}
 */
export async function getProgramTypes() {
  return await fetchApi("/programs/types");
}

// ============================================
// SEARCH API
// ============================================

/**
 * Global search across users, universities, programs
 * @param {string} query
 * @returns {Promise<object>} - { users, universities, programs }
 */
export async function globalSearch(query) {
  return await fetchApi(`/search?q=${encodeURIComponent(query)}`);
}

// ============================================
// CHART DATA API
// ============================================

/**
 * Get chart data for universities by department
 * @param {string} programType - filter by program type (optional)
 * @returns {Promise<object>}
 */
export async function getUniversityChartData(programType = "All") {
  const params =
    programType !== "All" ? `?type=${encodeURIComponent(programType)}` : "";
  return await fetchApi(`/charts/universities-by-department${params}`);
}
// ============================================
// USER PROFILE API
// ============================================

/**
 * Get user profile by ID
 * @param {number} userId
 * @returns {Promise<object>}
 */
export async function getUserProfile(userId) {
  return await fetchApi(`/UserProfile/${userId}`);
}

/**
 * Update user bio
 * @param {number} userId
 * @param {string} bio - The new bio text
 * @returns {Promise<object>}
 */
export async function updateUserBio(userId, bio) {
  return await fetchApi(`/UserProfile/bio/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ bio: bio }), // Wrapped in an object with 'bio' property
  });
}

/**
 * Update user about section
 * @param {number} userId
 * @param {string} about - The new about text
 * @returns {Promise<object>}
 */
export async function updateUserAbout(userId, about) {
  return await fetchApi(`/UserProfile/about/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ about: about }), // Wrapped in an object with 'about' property
  });
}

// ============================================
// CONVERSATIONS & MESSAGES API
// ============================================

/**
 * Get conversations for the current user (logged-in)
 * @returns {Promise<Array>} List of { conversationId, otherUser: { id, name, profileImage }, lastMessage, lastMessageTime, unreadCount }
 */
export async function getConversations() {
  return await fetchApi("/conversation");
}

/**
 * Get message history between current user and another user
 * @param {number} otherUserId - ID of the other user in the conversation
 * @returns {Promise<Array>} List of messages with senderName, senderProfileImage, content, timeSent, etc.
 */
export async function getMessageHistory(otherUserId) {
  return await fetchApi(`/message/history?otherUserId=${otherUserId}`);
}

/**
 * Send a message to a user
 * @param {number} receiverId - ID of the recipient
 * @param {string} content - Message text
 * @returns {Promise<object>} Created message
 */
export async function sendMessage(receiverId, content) {
  return await fetchApi("/message/send", {
    method: "POST",
    body: JSON.stringify({ receiverId, content }),
  });
}

/**
 * Mark messages from a sender as read (current user is receiver)
 * @param {number} senderId - ID of the user who sent the messages
 * @returns {Promise<void>}
 */
export async function markMessagesRead(senderId) {
  return await fetchApi(`/message/mark-read?senderId=${senderId}`, {
    method: "POST",
  });
}

// ============================================
// PROFILE POST API
// ============================================

/**
 * Create a new profile post
 * @param {number} userId
 * @param {object} postData - Post content
 * @returns {Promise<object>}
 */
export async function createProfilePost(userId, postData) {
  console.log("📤 Creating profile post for userId:", userId);
  console.log("📦 Post data being sent:", postData);
  console.log("🌐 Full URL:", `${API_BASE_URL}/ProfilePost/${userId}`);

  return await fetchApi(`/ProfilePost/${userId}`, {
    method: "POST",
    body: JSON.stringify(postData),
  });
}

/**
 * Add a comment to a post
 * @param {object} commentData - { postId, userName, userSurname, commentText }
 * @returns {Promise<object>}
 */
export async function addComment(commentData) {
  console.log("🔍 addComment called with:", commentData);
  console.log("🌐 Full URL will be:", `${API_BASE_URL}/ProfilePost/comment`);
  console.log(
    "📦 Body will be:",
    JSON.stringify({
      postId: commentData.postId,
      userName: commentData.userName,
      userSurname: commentData.userSurname,
      commentText: commentData.commentText,
    }),
  );

  return await fetchApi("/ProfilePost/comment", {
    method: "POST",
    body: JSON.stringify({
      postId: commentData.postId,
      userName: commentData.userName,
      userSurname: commentData.userSurname,
      commentText: commentData.commentText,
    }),
  });
}

/**
 * Get all posts for a user
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export async function getProfilePosts(userId) {
  return await fetchApi(`/ProfilePost/posts/${userId}`);
}

/**
 * Delete a comment
 * @param {number} commentId
 * @returns {Promise<void>}
 */
export async function deleteComment(commentId) {
  return await fetchApi(`/ProfilePost/comment/${commentId}`, {
    method: "DELETE",
  });
}

// ============================================
// EXPORT DEFAULT API OBJECT
// ============================================

const api = {
  // Auth
  login,
  register,
  logout,
  getCurrentUser,
  checkAuthStatus,

  // Students
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,

  // Posts
  getFeedPosts,
  getUserPosts,
  createPost,
  deletePost,
  likePost,
  unlikePost,

  // Friends
  getSuggestions,
  addFriend,
  removeFriend,
  dismissSuggestion,
  getFriends,

  // Friend Requests
  sendFriendRequest,
  getPendingFriendRequests,
  getSentFriendRequests,
  getFriendRequestStatus,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,

  // Stories
  getStories,
  markStoryViewed,

  // Universities
  getUniversities,
  getUniversityById,
  getTopUniversities,

  // Pedagogues
  getPedagogues,
  getTopPedagogues,
  searchPedagogues,
  findMatchingProfessors,

  // Reviews
  getReviews,
  getUniversityReviews,
  getPedagogueReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,

  // Programs
  getMatchingPrograms,
  getProgramTypes,

  // Search
  globalSearch,

  // Charts
  getUniversityChartData,

  // User Profile
  getUserProfile,
  updateUserBio,
  updateUserAbout,

  // Profile Posts
  createProfilePost,
  addComment,
  deleteComment,
  getProfilePosts,

  // Conversations & Messages
  getConversations,
  getMessageHistory,
  sendMessage,
  markMessagesRead,
};

export default api;
