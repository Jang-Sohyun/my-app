export const appleSignIn = () => {
  if (typeof window !== 'undefined' && window.__WEBVIEW_CONFIG__) {
    window.__WEBVIEW_CONFIG__.appleSignIn();
  } else {
    alert('웹뷰가 없습니다.');
  }
};
export const googleSignIn = () => {
  if (typeof window !== 'undefined' && window.__WEBVIEW_CONFIG__) {
    window.__WEBVIEW_CONFIG__.googleSignIn();
  } else {
    alert('웹뷰가 없습니다.');
  }
};
export const isWebView = () => {
  return typeof window !== 'undefined' && window.__WEBVIEW_CONFIG__;
};
export const getKakaoSignInPopUp = () => {
  return (
    typeof window !== 'undefined' && window.__WEBVIEW_CONFIG__?.kakaoSignInPopUp
  );
};
export const init = () => {
  if (typeof window !== 'undefined' && window.__WEBVIEW_CONFIG__?.init) {
    window.__WEBVIEW_CONFIG__.init();
  }
};
