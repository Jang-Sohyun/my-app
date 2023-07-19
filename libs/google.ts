export const initiateSignIn = async () => {
  const config = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    scope: 'profile email', // You can update your scope here
  };
  config.callback = '';
  const client = window.google.accounts.oauth2.initTokenClient(config);
  const tokenResponse = await new Promise((resolve, reject) => {
    try {
      client.callback = (resp) => {
        if (resp.error !== undefined) {
          reject(resp);
        }

        resolve(resp);
      };
      client.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      console.error(err);
    }
  });

  window.location.href = `/api/connect/google/redirect?token=${tokenResponse.access_token}`;
};
