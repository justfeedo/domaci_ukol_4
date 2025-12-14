/**
 * config aplikace
 * env settings s toggle pro mock
 */

// zjisteni jestli chceme mock nebo real api
export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// base url pro api server
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Mock user id pro auth
export const MOCK_AUTH_USER_ID = 'user-001';

//- simulace delay u mock api
export const MOCK_API_DELAY = 500;
