// validators.dart
class Validators {
  static String? validateEmail(String? email) {
    if (email == null || email.isEmpty) {
      return 'Email tidak boleh kosong';
    }
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(email)) {
      return 'Email tidak valid';
    }
    return null;
  }
  
  static String? validatePassword(String? password) {
    if (password == null || password.isEmpty) {
      return 'Password tidak boleh kosong';
    }
    if (password.length < 6) {
      return 'Password minimal 6 karakter';
    }
    return null;
  }
  
  static String? validatePhoneNumber(String? phone) {
    if (phone == null || phone.isEmpty) {
      return 'Nomor telepon tidak boleh kosong';
    }
    final phoneRegex = RegExp(r'^[0-9]{10,13}$');
    if (!phoneRegex.hasMatch(phone)) {
      return 'Nomor telepon tidak valid';
    }
    return null;
  }
  
  static String? validatePrice(String? price) {
    if (price == null || price.isEmpty) {
      return 'Harga tidak boleh kosong';
    }
    final priceRegex = RegExp(r'^[0-9]+(\.[0-9]{1,2})?$');
    if (!priceRegex.hasMatch(price)) {
      return 'Harga tidak valid';
    }
    return null;
  }
  
  static String? validateStock(String? stock) {
    if (stock == null || stock.isEmpty) {
      return 'Stok tidak boleh kosong';
    }
    if (int.tryParse(stock) == null) {
      return 'Stok harus berupa angka';
    }
    if (int.parse(stock) < 0) {
      return 'Stok tidak boleh negatif';
    }
    return null;
  }
}
