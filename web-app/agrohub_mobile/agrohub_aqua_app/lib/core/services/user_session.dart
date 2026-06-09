// ==========================================================
// AGROHUB USER SESSION
// lib/core/services/user_session.dart
// ==========================================================

class UserSession {
  static int? userId;
  static String? fullName;
  static String? username;
  static String? email;
  static String? avatar;
  static String? membershipType;
  static String? membershipCode;

  static void setUser(Map<String, dynamic> user) {
    userId = user['id'];
    fullName = user['full_name'];
    username = user['username'];
    email = user['email'];
    avatar = user['avatar'];
    membershipType = user['membership_type'];
    membershipCode = user['membership_code'];
  }

  static void clear() {
    userId = null;
    fullName = null;
    username = null;
    email = null;
    avatar = null;
    membershipType = null;
    membershipCode = null;
  }
}