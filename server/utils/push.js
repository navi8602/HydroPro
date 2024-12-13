// server/utils/push.js
export async function sendPushNotification(pushToken, notification) {
  if (!pushToken) return;

  try {
    // Интеграция с сервисом push-уведомлений (например, Firebase)
    console.log('Sending push notification:', notification);
  } catch (error) {
    console.error('Push notification failed:', error);
  }
}
