
export const EndPoints = {
  baseIP:'https://dev.dotx.co.in',  
  userDataPort: 'api',
  googleUserDataPort: '5088'
}
export const environment = Object.freeze({
  production: true,
  userDataIP: `${EndPoints.baseIP}`,
  baseURL: `${EndPoints.baseIP}/${EndPoints.userDataPort}/v1`,
  avatarLocation: '/v1/dot-user-details/images/avatar/',
  fileLocation: `${EndPoints.baseIP}/${EndPoints.userDataPort}/v1/dot-files/get_file/`,
  googleUserDataPort: 'auth',
  googleClientId: '1091261426815-s0idfhsskt99g76ra5igek0al63p1lf7.apps.googleusercontent.com',
  // googleXIP : '.xip.io',
  joinAuthJoinCode : `${EndPoints.baseIP}/auth/joincode_auth`,
  signUp: `${EndPoints.baseIP}/auth/sign_up`,
  signWithGoogle : `${EndPoints.baseIP}/auth/google_auth`,
  oAuthHeader: 'MkhUNmlYanVjVVJMbFlKVDJSMlgyTFZkOklJS3ZnZ1R3V0phTUdiWDl0cERjNGF4WUZXRVlCOFlBczM3akxPYnBPdGpONDNjZQ==',
});
