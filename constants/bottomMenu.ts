import * as newStaticUrls from '../constants/staticUrls';

// 회원 로그인시 하단 메뉴
export const bottomMenuWithLogin = [
  {
    title: '홈',
    url: '/',
    iconImg: {
      active: newStaticUrls.Menu.IconHomeActive,
      deactive: newStaticUrls.Menu.IconHome,
    },
  },
  {
    title: '갤러리',
    url: '/gallery',
    iconImg: {
      active: newStaticUrls.Menu.IconGalleryActive,
      deactive: newStaticUrls.Menu.IconGallery,
    },
  },
  {
    title: '커뮤니티',
    url: '/community',
    iconImg: {
      active: newStaticUrls.Menu.IconMessageActive,
      deactive: newStaticUrls.Menu.IconMessage,
    },
  },
  {
    title: '프로필',
    url: '/profile',
    iconImg: {
      active: newStaticUrls.Menu.IconProfileActive,
      deactive: newStaticUrls.Menu.IconProfile,
    },
  },
];
