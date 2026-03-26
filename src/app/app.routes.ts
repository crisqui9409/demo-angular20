import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'wps/portal/portal-recaudadores-banco/web',
    pathMatch: 'full',
  },


   /**
   * Consulta de convenios
   */
  {
    path: 'wps/myportal/portal-recaudadores-banco/web/opciones-perfil/consulta-convenios',
    // canActivate: [authGuard],
    loadChildren: () => loadRemoteModule('mf-agreement-inquiry', './routes').then((m) => m.routes),
  },

];
