'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorAIPage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Saya Dokter AI AgroHub 🌱 Ada yang bisa saya bantu?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  // 🔐 ambil token dari localStorage
  useEffect(() => {
    const t = localStorage.getItem('token');

    if (!t) {
      router.push('/login');
      return;
    }

    setToken(t);
  }, [router]);

  const askAI = async () => {
    if (!question.trim() || !token) return;

    const userQuestion = question;

    setMessages(prev => [
      ...prev,
      { role: 'user', content: userQuestion }
    ]);

    setLoading(true);
    setQuestion('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/consult`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: userQuestion,
            crop: '',
          }),
        }
      );

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            data?.data?.diagnosis ||
            'Maaf, tidak ada jawaban tersedia.',
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Terjadi kesalahan saat menghubungi AI.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        🤖 Dokter AI Pertanian
      </h1>

      {/* CHAT BOX */}
      <div className="bg-white rounded-2xl border h-[420px] overflow-y-auto p-4 space-y-3">

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[75%] ${
                msg.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500">
            Dokter AI sedang mengetik...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="flex gap-2 mt-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askAI()}
          placeholder="Tanya penyakit tanaman..."
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="bg-green-600 text-white px-6 rounded-xl hover:bg-green-700 disabled:opacity-50"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}