import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * 1. Geolocation Native Service
 */
export async function getCurrentLocationCoordinates(): Promise<{ lat: number; lon: number }> {
  if (isNativePlatform()) {
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        const requested = await Geolocation.requestPermissions();
        if (requested.location !== 'granted') {
          throw new Error('Location permission denied');
        }
      }
      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      return {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
    } catch (e) {
      console.warn('[Native Geolocation] Native fetch failed, falling back to Web API:', e);
    }
  }

  // Web API fallback
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by this device.'));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

/**
 * 2. Push Notifications Native Service
 */
export async function initPushNotifications(
  onTokenReceived?: (token: string) => void,
  onNotificationReceived?: (notification: PushNotificationSchema) => void
): Promise<void> {
  if (!isNativePlatform()) {
    console.log('[Push Notifications] Running in Web environment — Push notifications ready via ServiceWorker/FCM.');
    return;
  }

  try {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.warn('[Push Notifications] Permission not granted.');
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('📲 [Push Notifications] FCM Native Device Token:', token.value);
      if (onTokenReceived) onTokenReceived(token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('[Push Notifications] Registration error:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('[Push Notifications] Received push in foreground:', notification);
      if (onNotificationReceived) onNotificationReceived(notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      console.log('[Push Notifications] Action performed on notification:', action);
    });
  } catch (err) {
    console.warn('[Push Notifications] Native Push init error:', err);
  }
}

/**
 * 3. Local Notifications Native Service
 */
export async function scheduleLocalNotification(title: string, body: string, id = Math.floor(Math.random() * 100000)): Promise<void> {
  if (isNativePlatform()) {
    try {
      await LocalNotifications.requestPermissions();
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            schedule: { at: new Date(Date.now() + 100) },
            sound: 'default',
            actionTypeId: '',
            extra: null,
          },
        ],
      });
      return;
    } catch (e) {
      console.warn('[Local Notifications] Native schedule failed:', e);
    }
  }

  // Web fallback using Notification API if allowed
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/logo.png' });
  }
}

/**
 * 4. Camera Native Service
 */
export async function capturePhotoFromCamera(): Promise<string | null> {
  if (isNativePlatform()) {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        quality: 85,
        allowEditing: false,
      });
      return photo.dataUrl || null;
    } catch (e) {
      console.warn('[Camera] Native capture canceled or failed:', e);
      return null;
    }
  }

  // Web input fallback (handled via file input in CitizenReportPage)
  return null;
}

/**
 * 5. Status Bar & Splash Screen Theming
 */
export async function syncNativeStatusBarTheme(isDark: boolean): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    await StatusBar.setStyle({
      style: isDark ? Style.Dark : Style.Light,
    });
    await StatusBar.setBackgroundColor({
      color: isDark ? '#0E0E11' : '#F8F9FA',
    });
  } catch (e) {
    // Ignore in unsupported environments
  }
}

export async function hideNativeSplashScreen(): Promise<void> {
  if (!isNativePlatform()) return;
  try {
    await SplashScreen.hide();
  } catch (e) {}
}

/**
 * 6. Hardware Back Button Listener for Android
 */
export function setupHardwareBackButton(onBack: () => void): () => void {
  if (!isNativePlatform()) return () => {};

  const listenerPromise = CapApp.addListener('backButton', () => {
    onBack();
  });

  return () => {
    listenerPromise.then((handler) => handler.remove()).catch(() => {});
  };
}
