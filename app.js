// Importamos las funciones necesarias del SDK de Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAsKtVn__KbM1BhBRtNEgz5qRkyGKfcKcI",
  authDomain: "pwa-i20223tn132.firebaseapp.com",
  projectId: "pwa-i20223tn132",
  storageBucket: "pwa-i20223tn132.firebasestorage.app",
  messagingSenderId: "740907690280",
  appId: "1:740907690280:web:bb5f46f2343d3165eec81d"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Utilidades para manipular el DOM
const $ = (sel) => document.querySelector(sel);
const log = (m) => ($("#log").textContent += (($("#log").textContent === "—" ? "" : "\n") + m));

// Mostramos el estado inicial del permiso de notificaciones
$("#perm").textContent = Notification.permission;

// Registramos el Service Worker
let swReg;
if ("serviceWorker" in navigator) {
  swReg = await navigator.serviceWorker.register("./firebase-messaging-sw.js");
  console.log("Service Worker registrado:", swReg.scope);
}

// Verificamos compatibilidad con FCM
const supported = await isSupported();
let messaging = null;

if (supported) {
  messaging = getMessaging(app);
  console.log("FCM soportado y listo.");
} else {
  log("Este navegador no soporta FCM en la Web.");
}

// Clave pública VAPID obtenida desde Firebase Console → Cloud Messaging
const VAPID_KEY = "BJaD29-4Kw168XOFnxJ5EiNTaVfcnckRi44S-XEtcb73Ee6cw6U9rr3cJLazzXSHLg72ruWiMGe5pFF7cQBWOFQ";

// Función para pedir permiso al usuario y obtener token FCM
async function requestPermissionAndGetToken() {
  try {
    const permission = await Notification.requestPermission();
    $("#perm").textContent = permission;

    if (permission !== "granted") {
      log("Permiso denegado por el usuario.");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    if (token) {
      $("#token").textContent = token;
      log("Token obtenido. Usa este token en Firebase Console → Cloud Messaging → Send test message.");
      console.log("Token:", token);
    } else {
      log("No se pudo obtener el token.");
    }
  } catch (err) {
    console.error("Error al obtener token:", err);
    log("Error al obtener token: " + err.message);
  }
}

// Escuchar mensajes cuando la app está en primer plano
if (messaging) {
  onMessage(messaging, (payload) => {
    log("Mensaje recibido en primer plano:\n" + JSON.stringify(payload, null, 2));
    console.log("Mensaje recibido en primer plano:", payload);
  });
}

// Vinculamos el botón para habilitar notificaciones
$("#btn-permission").addEventListener("click", requestPermissionAndGetToken);
