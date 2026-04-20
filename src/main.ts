import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

async function filterAvailableRemotes(remotes: Record<string, string>) {
  const available: Record<string, string> = {};

  for (const [key, url] of Object.entries(remotes)) {
    try {
      await import(/* @vite-ignore */ url);
      available[key] = url;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.warn('Remote no disponible: ', key);
    }
  }

  return available;
}

async function buildManifest() {
  try {
    const remotesConfig: Record<string, string> = {
      'mf-agreement-inquiry': `${environment.mfAgreementInquiry}/remoteEntry.json`,
      'mf-transaction-inquiry': `${environment.mfTransactionInquiry}/remoteEntry.json`,
      'mf-collection-download': `${environment.mfCollectionDownload}/remoteEntry.json`,
      'mf-invoice-upload': `${environment.mfInvoiceUpload}/remoteEntry.json`,
      'mf-file-tracking': `${environment.mfFileTracking}/remoteEntry.json`,
    };

    if (window.location.hostname === 'localhost') {
      return await filterAvailableRemotes(remotesConfig);
    }

    return remotesConfig;
  } catch (error) {
    console.warn('Error construyendo manifest, fallback vacio: ', error);
    return {};
  }
}

(async () => {
  try {
    const manifest = await buildManifest();

    console.log('Remotes activos: ', manifest);

    const manifestBlob = new Blob([JSON.stringify(manifest)], {
      type: 'application/json',
    });

    const manifestUrl = URL.createObjectURL(manifestBlob);

    await initFederation(manifestUrl);

    await import('./bootstrap');
  } catch (error) {
    console.error('Error inicializando federation: ', error);

    await import('./bootstrap');
  }
})();