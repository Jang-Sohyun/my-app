import copy from 'copy-text-to-clipboard';

export default ({ url }: { url: string }) => {
  if (typeof navigator !== 'undefined' && navigator.share) {
    navigator.share({ url });
  } else {
    copy(url);
    alert('URL이 클립보드에 복사되었습니다.');
  }
};
