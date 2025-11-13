// Importar Firebase (versión compat, compatible con Service Worker)
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAsKtVn__KbM1BhBRtNEgz5qRkyGKfcKcI",
  authDomain: "pwa-i20223tn132.firebaseapp.com",
  projectId: "pwa-i20223tn132",
  storageBucket: "pwa-i20223tn132.firebasestorage.app",
  messagingSenderId: "740907690280",
  appId: "1:740907690280:web:bb5f46f2343d3165eec81d"
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
