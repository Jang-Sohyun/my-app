/* eslint-disable */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const path = require('path');
const configEnv = require('./env/config');

// production / development 환경 변수 설정
const dotEnvResult = configEnv();

if (dotEnvResult.error) {
  throw dotEnvResult.error;
}

const {
  HOST,
  BACKEND_API,
  NEXTAUTH_URL,
  SECRET,
  PORT,
  APP_ENV,
  TOSS_CLIENT_ID,
  TOSS_CLIENT_SECRET,
  TOSS_M_ID,
  SERVER_API_KEY,
  GOOGLE_CLIENT_ID,
  GIT_COMMIT,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_ACCOUNT_SUBACCOUNT_SID,
  GA_MEASUREMENT_ID,
  KAKAO_CLIENT_ID,
  KAKAO_REST_KEY,
  KAKAO_REST_SECRET,
} = process.env;
const DEFAULT_PORT = 3000;
module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const env = {
    HOST: HOST,
    PORT: PORT || DEFAULT_PORT,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_ACCOUNT_SUBACCOUNT_SID,
    TOSS_CLIENT_SECRET,
    SERVER_API_KEY,
    KAKAO_REST_KEY,
    KAKAO_REST_SECRET,
    // next에서 서버, 클라이언트 동일하게 환경변수를 사용하려면 NEXT_PUBLIC_ prefix 필요
    NEXT_PUBLIC_HOST: HOST,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_APP_ENV: APP_ENV,
    NEXT_PUBLIC_GIT_COMMIT: GIT_COMMIT,
    NEXT_PUBLIC_BACKEND_API: BACKEND_API,
    NEXT_PUBLIC_TOSS_CLIENT_ID: TOSS_CLIENT_ID,
    NEXT_PUBLIC_TOSS_M_ID: TOSS_M_ID,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: GA_MEASUREMENT_ID,
    NEXT_PUBLIC_KAKAO_CLIENT_ID: KAKAO_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
  };

  if (HOST.includes('https://')) {
    env.IS_SSL = true;
  }

  return {
    images: {
      domains: ['static.getraffle.io'],
    },
    env,
    generateBuildId: async () => {
      console.log('BUILD_ID', GIT_COMMIT);
      return GIT_COMMIT || '123456789';
    },
    // i18n: {
    //   locales: ['en', 'ko'],
    //   defaultLocale: 'en',
    // },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
  };
};
