export enum StoreKey {
  LastNotification = 'LastNotification',
  NotiPromptInMain = 'NotiPromptInMain',
  AnonymousUserToken = 'AnonymousUserToken',
  Locale = 'Locale',
  LocaleTexts = 'LocaleTexts',
  OnboardingShown = 'OnboardingShown',
  NextPathAfterSignIn = 'NextPathAfterSignIn',
  ParticipationData = 'ParticipationData',
  Jwt = 'Jwt',
}

export type JoinStep = 'service_agreement' | 'sms_auth' | 'member_join';

export type Artwork = {
  img: string;
  creator: string;
  title: string;
  type: string;
};

export type Artist = {
  id: string;
  name: string;
  profile?: string;
};

export type Post = {
  id: string;
  title: string;
  thumbnail?: string;
  description: string;
  commentCount: number;
  likeCount: number;
  author: Artist;
  createdAt?: string;
};

export type SubMenuType = {
  label: string;
  pageName: string;
  onClickPageMove: () => void;
};

export type SubMenuListType = {
  subHeaderText: string;
  menus: SubMenuType[];
  onClickPageMove: () => void;
};

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  profile: string;
  activitySummary: {
    orderCount: number; // 주문 개수
    collectCount: number; // 컬렉팅 개수
    favoriteCount: number; // 찜 개수
  };
  createdAt: string;
  signedUp: boolean;
  agreeMarketing: boolean;
  agreeShareMarketing: boolean;
  phone: string;
  artist: any;
  nickname: string;
  avatar: Avatar | null;
};
export interface Recipient {
  receiver: string;
  mobile: string;
  address: string;
  memo: string;
  user: User;
}

// const avatar: Avatar = {
//   id: 1,
//   name: 'logo.png',
//   alternativeText: null,
//   caption: null,
//   width: 512,
//   height: 512,
//   formats: {
//     small: {
//       ext: '.png',
//       url: 'https://ddle-static.s3.ap-northeast-2.amazonaws.com/small_logo_def60aac40.png',
//       hash: 'small_logo_def60aac40',
//       mime: 'image/png',
//       name: 'small_logo.png',
//       path: null,
//       size: 10.3,
//       width: 500,
//       height: 500,
//     },
//     thumbnail: {
//       ext: '.png',
//       url: 'https://ddle-static.s3.ap-northeast-2.amazonaws.com/thumbnail_logo_def60aac40.png',
//       hash: 'thumbnail_logo_def60aac40',
//       mime: 'image/png',
//       name: 'thumbnail_logo.png',
//       path: null,
//       size: 2.11,
//       width: 156,
//       height: 156,
//     },
//   },
//   hash: 'logo_def60aac40',
//   ext: '.png',
//   mime: 'image/png',
//   size: 3.07,
//   url: 'https://ddle-static.s3.ap-northeast-2.amazonaws.com/logo_def60aac40.png',
//   previewUrl: null,
//   provider: 'aws-s3',
//   provider_metadata: null,
//   createdAt: '2023-01-30T15:51:01.182Z',
//   updatedAt: '2023-01-30T15:51:01.182Z',
// };

interface Avatar {
  id: number;
  url: string;
}

// 프로필 메뉴내 세부 화면
export type profileScene =
  | 'profile_main'
  | 'profile_detail'
  | 'my_note'
  | 'subscrpition_management'
  | 'review'
  | 'inquiry_history'
  | 'notice'
  | 'faq'
  | 'order_history'
  | 'collecting'
  | 'favorite';

// 메뉴 화면내 서브탭
export type subTab = {
  id: string;
  label: string;
};
