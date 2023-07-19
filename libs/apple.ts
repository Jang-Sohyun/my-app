const CLIENT_ID = 'com.artddle.service.prod';
const REDIRECT_URI = encodeURIComponent(
  `${process.env.NEXT_PUBLIC_HOST}/api/connect/apple/redirect`
  // `https://cab68651fd5c.jp.ngrok.io/api/connect/apple/redirect`
);
export const initiateSignIn = () => {
  window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code%20id_token&state=%5BSTATE%5D&scope=name%20email&nonce=%5BNONCE%5D&response_mode=form_post&m=12&v=1.5.3`;
};
