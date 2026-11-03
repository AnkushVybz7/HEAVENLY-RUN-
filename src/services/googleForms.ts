import { getCachedAccessToken } from './firebase';

export interface GoogleFormItem {
  id: string;
  name: string;
  webViewLink?: string;
  responderUri?: string;
  modifiedTime?: string;
}

/**
 * List Google Forms accessible with current OAuth token via Google Drive API
 */
export async function listGoogleForms(): Promise<GoogleFormItem[]> {
  const token = getCachedAccessToken();
  if (!token) return [];

  try {
    const q = encodeURIComponent("mimeType='application/vnd.google-apps.form' and trashed=false");
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,webViewLink,modifiedTime)&pageSize=15`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.warn('Google Drive files fetch failed with status:', response.status);
      return [];
    }

    const data = await response.json();
    return data.files || [];
  } catch (err) {
    console.warn('Error listing Google Forms:', err);
    return [];
  }
}

/**
 * Create a new official HEAVENLY-RUN Google Form using Google Forms API v1
 */
export async function createHeavenlyRunForm(title: string): Promise<{ formId: string; responderUri: string } | null> {
  const token = getCachedAccessToken();
  if (!token) return null;

  try {
    const response = await fetch('https://forms.googleapis.com/v1/forms', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        info: {
          title: title || 'HEAVENLY-RUN ENERGY — Community Feedback & First 50 Register',
          documentTitle: 'HEAVENLY-RUN Survey',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Forms API returned ${response.status}`);
    }

    const data = await response.json();
    return {
      formId: data.formId,
      responderUri: data.responderUri,
    };
  } catch (err) {
    console.error('Failed to create Google Form:', err);
    throw err;
  }
}
