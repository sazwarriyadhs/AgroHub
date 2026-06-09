'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Package, Heart, Truck, CheckCircle, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'order' | 'wishlist' | 'shipping' | 'promo';
  isRead: boolean;
  date: string;
  link?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Pesanan Diproses",
      message: "Pesanan #AGRO-1234 sedang diproses",
      type: "order",
      isRead: false,
      date: "2026-05-25",
      link: "/orders/1234"
    },
    {
      id: 2,
      title: "Produk Wishlist Diskon",
      message: "Pupuk Organik Premium sedang diskon 20%",
      type: "wishlist",
      isRead: false,
      date: "2026-05-24",
      link: "/products/1"
    },
    {
      id: 3,
      title: "Pengiriman Dikirim",
      message: "Paket Anda sedang dalam perjalanan",
      type: "shipping",
      isRead: true,
      date: "2026-05-23",
      link: "/orders/1234"
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'order': return <Package className="w-5 h-5 text-blue-500" />;
      case 'wishlist': return <Heart className="w-5 h-5 text-red-500" />;
      case 'shipping': return <Truck className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-green-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container-custom py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold">Notifikasi</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} baru
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-green-600 hover:underline text-sm"
          >
            Tandai semua sudah dibaca
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada notifikasi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`border rounded-xl p-4 transition ${
                notif.isRead ? 'bg-white' : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getIcon(notif.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{notif.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notif.date}</p>
                    </div>
                    <div className="flex gap-2">
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-xs text-green-600 hover:underline"
                        >
                          Tandai dibaca
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {notif.link && (
                    <Link href={notif.link}>
                      <button className="mt-3 text-sm text-green-600 hover:underline">
                        Lihat Detail →
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
