const axios = require('axios');

const Logger = require('./Logger');
const Config = require('./Config');
const Prefs = require('./Preferences');

const { PrefKeys } = Prefs;
const URLS = Config.ANGEL_URLS;

const TAG = 'AxiosInterceptor: ';
const unAuthenticatedRoutes = [URLS.login, URLS.test];
const API_TIMEOUT = 10000;

const getHeaders = async () => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-UserType': 'USER',
  'X-SourceID': 'WEB',
  'X-ClientLocalIP': await Prefs.get_pref(PrefKeys.KEY_CLIENT_LOCAL_IP, ''),
  'X-ClientPublicIP': await Prefs.get_pref(PrefKeys.KEY_CLIENT_PUBLIC_IP, ''),
  'X-MACAddress': await Prefs.get_pref(PrefKeys.KEY_MAC_ADDRESS, ''),
  'X-PrivateKey': await Prefs.get_pref(PrefKeys.KEY_ANGEL_API_KEY, ''),
});

axios.interceptors.request.use(async (config) => {
  const isTokenRequired = !unAuthenticatedRoutes.includes(config.url);
  Logger.logInfo(TAG, `isTokenRequired: ${isTokenRequired} ${config.url}`);

  const headers = await getHeaders();

  let newConfig = {
    ...config,
    headers: {
      ...headers,
    },
    timeout: API_TIMEOUT,
    timeoutErrorMessage: 'Your internet is slow.',
  };

  if (isTokenRequired) {
    const token = await Prefs.get_pref(PrefKeys.KEY_CURRENT_USER_TOKEN, '');
    if (token === '') {
      Logger.logError(TAG, 'auth token is empty - use angel user:select');
    }

    newConfig = {
      ...newConfig,
      headers: {
        ...newConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return newConfig;
});

axios.interceptors.response.use(
  async (res) => {
    const { data } = res;
    const { status, message, errorCode } = data;
    if (!status) Logger.logError(TAG, `${errorCode} - ${message} - ${res.config.url}`);
    return data;
  },

  (error) => {
    Logger.logError(TAG, error.message);
  },
);

const makeGetRequest = (URL) => axios.get(URL);
const makePostRequest = (URL, data) => axios.post(URL, data);
const makePutRequest = (URL, data) => axios.put(URL, data);

module.exports = {
  makeGetRequest,
  makePostRequest,
  makePutRequest,
};
