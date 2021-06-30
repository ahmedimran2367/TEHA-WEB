export const environment = {
  production: true,
  VirtualDirectoryPath: "/TEHA", // It is always start with '/'
  baseUrl: 'https://tehaapi.azurewebsites.net',
  ProjectURL: 'https://mwciatest.mwcia.org/TEHA/',
  InternalIP: '192.138.165.20',
  HubUrl: 'https://domain/TEHAAPI/NotifyHub/',

  InternalIPPath() {
    return 'http://' + this.InternalIP + '/TEHAAPI/api/';
  }
};

