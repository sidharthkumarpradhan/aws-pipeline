import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider
  } from 'angular5-social-login';
  
  export function getAuthServiceConfigs() {
    let config = new AuthServiceConfig([
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('762815222195-5gjne2mraskul3c62moarffach7csgf4.apps.googleusercontent.com')
      }
    ]);
  
    return config;
  }