import { Router, Request, Response } from 'express';
import { dispatchPushNotification, buildLocalizedNotification } from '../services/notifications';
import { SupportedLanguage } from '@mausam/shared-types';

export const notificationsRouter = Router();

/**
 * POST /api/notifications/send
 * Triggers a localized notification in the user's stored language
 */
notificationsRouter.post('/send', async (req: Request, res: Response) => {
  try {
    const { userId, fcmToken, language = 'en', type, variables = {} } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Notification type is required' });
    }

    const result = await dispatchPushNotification({
      userId,
      fcmToken,
      language: language as SupportedLanguage,
      type,
      variables,
    });

    return res.json(result);
  } catch (err: any) {
    console.error('[Notifications Route Error]', err);
    return res.status(500).json({ error: 'Failed to generate notification', details: err?.message });
  }
});

/**
 * GET /api/notifications/preview?type=heat_alert&lang=kn&city=Bengaluru
 * Previews the localized template
 */
notificationsRouter.get('/preview', (req: Request, res: Response) => {
  const type = (req.query.type as any) || 'heat_alert';
  const lang = (req.query.lang as SupportedLanguage) || 'en';
  const variables = (req.query as Record<string, any>) || {};

  const payload = buildLocalizedNotification(type, lang, variables);
  return res.json(payload);
});
