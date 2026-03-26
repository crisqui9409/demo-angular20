import { initFederation } from '@angular-architects/native-federation';

const manifest = { 
'mf-agreement-inquiry': 'http://localhost:4201/remoteEntry.json', 
}; 

const manifestBlob = new Blob([JSON.stringify(manifest)], { 
type: 'application/json', 
}); 

const manifestUrl = URL.createObjectURL(manifestBlob); 

initFederation(manifestUrl)
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
