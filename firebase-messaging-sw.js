// Importar Firebase (versión compat, compatible con Service Worker)
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAHaEs-Fc8r66nno_wSYuJKaBur06OM8Qw",
  authDomain: "pwa-20223tn0791.firebaseapp.com",
  projectId: "pwa-20223tn0791",
  storageBucket: "pwa-20223tn0791.firebasestorage.app",
  messagingSenderId: "947707252105",
  appId: "1:947707252105:web:4f0fdf40b9fd6e85902558"
};

// Inicializar Firebase en el SW
firebase.initializeApp(firebaseConfig);

// Inicializar el servicio de mensajería
const messaging = firebase.messaging();

// Recibir mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('📨 Mensaje recibido en segundo plano:', payload);

  const notificationTitle = payload.notification?.title || "Notificación";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "192.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('./'));
});
