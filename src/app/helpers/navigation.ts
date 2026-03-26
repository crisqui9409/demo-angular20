//Helper creado para que al hacer test se use window.open y cuando se ejecuta normal se use window.location.href

function isTestEnv(): boolean {
  // Detectar ambiente de test y evitar hacer reloads
  return typeof window !== 'undefined' && ('__karma__' in window || window.location.href.includes('karma'));
}

export const Navigation = {
  redirectToUrl(url: string): void {
    if (isTestEnv()) {
      return;
    } else {
      window.location.href = url;
    }
  },

  reloadPage(): void {
    if (isTestEnv()) {
      return;
    } else {
      window.location.reload();
    }
  },

  assign(url: string): void {
    if (isTestEnv()) {
      return;
    } else {
      window.location.assign(url);
    }
  },
};
