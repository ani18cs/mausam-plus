import { SupportedLanguage, getLocalizedTemplate } from '@mausam/shared-types';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  category: 'heat' | 'rain' | 'delta' | 'cyclone' | 'general';
}

export interface SendNotificationRequest {
  userId?: string;
  fcmToken?: string;
  language?: SupportedLanguage;
  type: 'heat_alert' | 'rain_alert' | 'what_changed' | 'cyclone_alert';
  variables: Record<string, string | number>;
}

/**
 * Server-side notification generator resolving templates in user's preferred language
 */
export function buildLocalizedNotification(
  type: SendNotificationRequest['type'],
  language: SupportedLanguage = 'en',
  variables: Record<string, string | number> = {}
): NotificationPayload {
  const lang: SupportedLanguage = language === 'hi' || language === 'kn' ? language : 'en';

  const titleKey = `notifications.${type}_title`;
  const bodyKey = `notifications.${type}_body`;

  const title = getLocalizedTemplate(lang, titleKey, variables);
  const body = getLocalizedTemplate(lang, bodyKey, variables);

  let category: NotificationPayload['category'] = 'general';
  if (type === 'heat_alert') category = 'heat';
  else if (type === 'rain_alert') category = 'rain';
  else if (type === 'what_changed') category = 'delta';
  else if (type === 'cyclone_alert') category = 'cyclone';

  return {
    title,
    body,
    category,
    data: {
      notificationType: type,
      language: lang,
      sentAt: new Date().toISOString(),
    },
  };
}

/**
 * Sends notification via FCM if credentials available, or returns payload with audit receipt
 */
export async function dispatchPushNotification(
  req: SendNotificationRequest
): Promise<{ success: boolean; payload: NotificationPayload; deliveryMode: 'fcm_cloud' | 'local_dispatch' }> {
  const payload = buildLocalizedNotification(req.type, req.language, req.variables);

  // If FCM Server Key or Firebase Admin is configured:
  const fcmServerKey = process.env.FCM_SERVER_KEY;
  if (fcmServerKey && req.fcmToken) {
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${fcmServerKey}`,
        },
        body: JSON.stringify({
          to: req.fcmToken,
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: payload.data,
        }),
      });

      if (response.ok) {
        console.log(`📲 [FCM Push] Sent push notification [${req.type}] in ${req.language || 'en'} to token: ${req.fcmToken.slice(0, 12)}...`);
        return { success: true, payload, deliveryMode: 'fcm_cloud' };
      }
    } catch (e) {
      console.warn('[FCM Push] FCM dispatch failed, providing local notification payload:', e);
    }
  }

  console.log(`🔔 [Notification Generated] Lang: ${req.language || 'en'} | Title: "${payload.title}" | Body: "${payload.body}"`);
  return { success: true, payload, deliveryMode: 'local_dispatch' };
}
