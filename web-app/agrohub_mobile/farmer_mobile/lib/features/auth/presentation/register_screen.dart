import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  final _name = TextEditingController();
  final _email = TextEditingController();
  final _phone = TextEditingController();
  final _nik = TextEditingController();
  final _address = TextEditingController();
  final _password = TextEditingController();

  String farmType = "crop";
  bool agree = false;
  bool loading = false;

  File? ktpImage;
  File? selfieImage;

  Future<void> pickImage(bool isKtp) async {
    final picker = ImagePicker();

    final file = await picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 75,
    );

    if (file == null) return;

    setState(() {
      if (isKtp) {
        ktpImage = File(file.path);
      } else {
        selfieImage = File(file.path);
      }
    });
  }

  Future<void> submit() async {
    if (!_formKey.currentState!.validate()) return;

    if (ktpImage == null || selfieImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Upload KTP & Selfie wajib"),
        ),
      );
      return;
    }

    if (!agree) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Setujui syarat & ketentuan"),
        ),
      );
      return;
    }

    setState(() {
      loading = true;
    });

    try {
      await Future.delayed(
        const Duration(seconds: 2),
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Registrasi berhasil"),
        ),
      );

      Navigator.pop(context);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
        ),
      );
    }

    setState(() {
      loading = false;
    });
  }

  Widget uploadCard(
    String title,
    File? image,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      child: Container(
        height: 140,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: Colors.grey.shade300,
          ),
        ),
        child: image == null
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.upload),
                    const SizedBox(height: 8),
                    Text(title),
                  ],
                ),
              )
            : ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.file(
                  image,
                  fit: BoxFit.cover,
                  width: double.infinity,
                ),
              ),
      ),
    );
  }

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _phone.dispose();
    _nik.dispose();
    _address.dispose();
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xffF6F8F4),
      appBar: AppBar(
        title: const Text("Registrasi Petani"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            children: [

              const LinearProgressIndicator(
                value: 0.25,
              ),

              const SizedBox(height: 20),

              TextFormField(
                controller: _name,
                decoration: const InputDecoration(
                  labelText: "Nama Lengkap",
                ),
                validator: (v) =>
                    v!.isEmpty ? "Wajib diisi" : null,
              ),

              const SizedBox(height: 12),

              TextFormField(
                controller: _email,
                decoration: const InputDecoration(
                  labelText: "Email",
                ),
              ),

              const SizedBox(height: 12),

              TextFormField(
                controller: _phone,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: "No HP",
                ),
              ),

              const SizedBox(height: 12),

              TextFormField(
                controller: _nik,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: "NIK",
                ),
                validator: (v) {
                  if (v == null || v.length != 16) {
                    return "NIK harus 16 digit";
                  }
                  return null;
                },
              ),

              const SizedBox(height: 12),

              DropdownButtonFormField(
                value: farmType,
                items: const [
                  DropdownMenuItem(
                    value: "crop",
                    child: Text("Tanaman"),
                  ),
                  DropdownMenuItem(
                    value: "livestock",
                    child: Text("Peternakan"),
                  ),
                  DropdownMenuItem(
                    value: "fishery",
                    child: Text("Perikanan"),
                  ),
                ],
                onChanged: (v) {
                  setState(() {
                    farmType = v.toString();
                  });
                },
              ),

              const SizedBox(height: 12),

              TextFormField(
                controller: _address,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: "Alamat",
                ),
              ),

              const SizedBox(height: 20),

              uploadCard(
                "Upload KTP",
                ktpImage,
                () => pickImage(true),
              ),

              const SizedBox(height: 14),

              uploadCard(
                "Upload Selfie",
                selfieImage,
                () => pickImage(false),
              ),

              const SizedBox(height: 16),

              TextFormField(
                controller: _password,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: "Password",
                ),
              ),

              CheckboxListTile(
                value: agree,
                onChanged: (v) {
                  setState(() {
                    agree = v ?? false;
                  });
                },
                title: const Text(
                  "Saya setuju syarat & ketentuan",
                ),
              ),

              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: loading ? null : submit,
                  child: loading
                      ? const CircularProgressIndicator()
                      : const Text(
                          "Daftar & Verifikasi KYC",
                        ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}