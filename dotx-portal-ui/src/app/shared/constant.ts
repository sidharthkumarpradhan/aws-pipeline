export const PAGE_SIZE = 10;
export const MOBILE_PAGE_SIZE = 5;
export const CONTENT_TYPE = {
    APPLICATION_JSON: 'application/json',
    APPLICATION_TEXT: 'text/plain',
    APPLICATION_HTML: 'text/html',
    APPLICATION_XML: 'application/xml',
    APPLICATION_PDF: 'application/pdf',
    APPLICATION_IIF: 'text/iif',
    APPLICATION_URL_ENCODED: 'application/x-www-form-urlencoded',
    IMAGE_JPEG: 'image/jpeg',
    IMAGE_GIF: 'image/gif',
    IMAGE_PNG: 'image/png'
  };
export const RECORDS_PER_PAGE = 10;
export const AUTHORIZED_GRANT_TYPES = {
    PASSWORD: 'password',
    AUTHORIZATION_CODE: 'authorization_code',
    REFRESH_TOKEN: 'refresh_token',
    IMPLICIT: 'implicit'
};
export const ERROR_MESSAGE = {
  DAILY_DOT_DATE_FORMAT: 'Please enter date format as yyyy-mm-dd 00:00:00',
  RECORD_DELETED: 'Record deleted successfully',
  RECORD_UPDATED: 'Record updated successfully',
  RECORD_ADDED: 'Record added successfully',
  USER_CREATED: 'User created successfully',
  FIELDS_REQUIRED: 'Please enter all required fields',
  VALID_FILE: 'Please select a valid csv file and submit',
  FILE_UPLOADED: 'File has been uploaded successfully',
};

export const ICON_AVATAR = {
  femaleAvatars: ['avatar-girl-1.png', 'avatar-girl-2.png', 'avatar-girl-3.png', 'avatar-girl-4.png',
  'avatar-girl-5.png', 'avatar-girl-6.png', 'avatar-girl-7.png', 'avatar-girl-8.png',
  'avatar-girl-9.png', 'avatar-girl-10.png', 'avatar-girl-11.png', 'avatar-girl-12.png'],
  maleAvatars: ['avatar-boy-1.png', 'avatar-boy-2.png', 'avatar-boy-3.png', 'avatar-boy-4.png',
  'avatar-boy-5.png', 'avatar-boy-6.png', 'avatar-boy-7.png', 'avatar-boy-8.png',
  'avatar-boy-9.png', 'avatar-boy-10.png', 'avatar-boy-11.png', 'avatar-boy-12.png'],
  otherAvatars: ['avatar-boy-1.png', 'avatar-boy-2.png', 'avatar-boy-3.png', 'avatar-boy-4.png',
  'avatar-boy-5.png', 'avatar-boy-6.png', 'friend-0.png', 'friend-1.png',
  'friend-2.png', 'friend-3.png', 'friend-4.png', 'friend-5.png']
};

export const HTTP_ERROR_MESSAGE = [
  'Email already exist',
];

export const SUCCESS_MESSAGE = {
  RECORD_DELETED: 'Deleted successfully',
  RECORD_UPDATED: 'Updated successfully',
  RECORD_ADDED: 'Added successfully',
  DATA_ADDED: 'Data added successfully',
  FIELDS_REQUIRED: 'Please enter all required fields'
};
export const ADMIN_ERROR_MESSAGES = {
  DAILY_DOT_DATE_FORMAT: '{"date_of_publish":["Not a valid datetime."],"record_date":["Not a valid datetime."]}',
}
export const languages = [
  {
    displayname: 'US English',
    fieldName: 'en'
  },
  {
    displayname: 'Pilipino',
    fieldName: 'fil'
  },
  {
    displayname: 'తెలుగు',
    fieldName: 'te'
  },
  {
    displayname: 'हिन्दी',
    fieldName: 'hi'
  },
];
