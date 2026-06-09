class User {
  final int id;
  final String name;
  final String email;
  final String userType;
  final String? token;
  final int? walletBalance;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.userType,
    this.token,
    this.walletBalance,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      userType: json['user_type'] ?? 'seller',
      token: json['token'],
      walletBalance: json['wallet_balance'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'user_type': userType,
      'token': token,
      'wallet_balance': walletBalance,
    };
  }
}



