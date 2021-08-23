// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const EndPoints = {
  baseIP: 'http://192.168.32.173',
  baseIPProd: 'http://ec2-54-67-93-104.us-west-1.compute.amazonaws.com',
  userDataPort: '5080',
  googleUserDataPort: '5088'
}
export const environment = Object.freeze({
  production: false,
  userDataIP: `${EndPoints.baseIP}`,
  baseURL: `${EndPoints.baseIP}:${EndPoints.userDataPort}/v1`,
  avatarLocation: '/v1/dot-user-details/images/avatar/',
  fileLocation: `${EndPoints.baseIP}:${EndPoints.userDataPort}/v1/dot-files/get_file/`,
  googleUserDataPort: '5088',
  googleClientId: '762815222195-5gjne2mraskul3c62moarffach7csgf4.apps.googleusercontent.com',
  // googleXIP : '.xip.io',
  joinAuthJoinCode: `${EndPoints.baseIP}:${EndPoints.googleUserDataPort}/joincode_auth`,
  signUp: `${EndPoints.baseIP}:${EndPoints.googleUserDataPort}/sign_up`,
  signWithGoogle: `${EndPoints.baseIP}:${EndPoints.googleUserDataPort}/google_auth`,
  oAuthHeader: 'MkhUNmlYanVjVVJMbFlKVDJSMlgyTFZkOklJS3ZnZ1R3V0phTUdiWDl0cERjNGF4WUZXRVlCOFlBczM3akxPYnBPdGpONDNjZQ==',
});



