import { Artwork } from '../types/index';

/* 
API 연동전 API 응답 데이터로 가정한 mock 데이터입니다.
(백엔드 연동 후에는 추후 삭제 예정)
*/

// 초기 게시글 목록 데이터 샘플
export const initalPosts = [
  {
    id: '1',
    createdAt: '2022.3.13',
    title: '개인전 D-12 작업으로 불태우는 중!',
    thumbnail:
      ' https://images.unsplash.com/photo-1601887389937-0b02c26b602c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
    description:
      '빛은 모네의 인생 주제였습니다. 빛을 어디에서 어떻게 보고 그릴 수 있는지만을 평생 고민한 사람이라고 할 수 있죠. \r\n센 강 위에 작은 배를 띄어놓고 해가 뜨고 질 떄까지 수면위에 나타나는 빛을 그렸다고합니다. 참 낭만적이죠? \r\n낭만적인 연구는 여기서 끝나지 않습니다. 이 문장은 마지막 문장입니다.',
    commentCount: 10,
    likeCount: 15000,
    author: {
      id: 'nkj123',
      name: 'Nike Jordan',
      profile: 'https://faces-img.xcdn.link/image-lorem-face-6244.jpg',
    },
  },
  {
    id: '2',
    createdAt: '2022.3.13',
    title: '개인전 D-12 작업으로 불태우는 중!',
    thumbnail:
      ' https://images.unsplash.com/photo-1601887389937-0b02c26b602c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
    description:
      '빛은 모네의 인생 주제였습니다. 빛을 어디에서 어떻게 보고 그릴 수 있는지만을 평생 고민한 사람이라고 할 수 있죠. \r\n센 강 위에 작은 배를 띄어놓고 해가 뜨고 질 떄까지 수면위에 나타나는 빛을 그렸다고합니다. 참 낭만적이죠? \r\n낭만적인 연구는 여기서 끝나지 않습니다. 이 문장은 마지막 문장입니다.',
    commentCount: 10,
    likeCount: 2753222,
    author: {
      id: 'nkj123',
      name: 'Nike Jordan',
      profile: 'https://faces-img.xcdn.link/image-lorem-face-6244.jpg',
    },
  },
  {
    id: '3',
    createdAt: '2022.3.13',
    title: '개인전 D-12 작업으로 불태우는 중!',
    thumbnail:
      ' https://images.unsplash.com/photo-1601887389937-0b02c26b602c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
    description:
      '빛은 모네의 인생 주제였습니다. 빛을 어디에서 어떻게 보고 그릴 수 있는지만을 평생 고민한 사람이라고 할 수 있죠. \r\n센 강 위에 작은 배를 띄어놓고 해가 뜨고 질 떄까지 수면위에 나타나는 빛을 그렸다고합니다. 참 낭만적이죠? \r\n낭만적인 연구는 여기서 끝나지 않습니다. 이 문장은 마지막 문장입니다.',
    commentCount: 10,
    likeCount: 325200,
    author: {
      id: 'nkj123',
      name: 'Nike Jordan',
      profile: 'https://faces-img.xcdn.link/image-lorem-face-6244.jpg',
    },
  },
  {
    id: '4',
    createdAt: '2022.3.13',
    title: '개인전 D-12 작업으로 불태우는 중!',
    thumbnail:
      ' https://images.unsplash.com/photo-1601887389937-0b02c26b602c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
    description:
      '빛은 모네의 인생 주제였습니다. 빛을 어디에서 어떻게 보고 그릴 수 있는지만을 평생 고민한 사람이라고 할 수 있죠. \r\n센 강 위에 작은 배를 띄어놓고 해가 뜨고 질 떄까지 수면위에 나타나는 빛을 그렸다고합니다. 참 낭만적이죠? \r\n낭만적인 연구는 여기서 끝나지 않습니다. 이 문장은 마지막 문장입니다.',
    commentCount: 10,
    likeCount: 32,
    author: {
      id: 'nkj123',
      name: 'Nike Jordan',
      profile: 'https://faces-img.xcdn.link/image-lorem-face-6244.jpg',
    },
  },
  {
    id: '5',
    createdAt: '2022.3.13',
    title: '개인전 D-12 작업으로 불태우는 중!',
    thumbnail:
      ' https://images.unsplash.com/photo-1601887389937-0b02c26b602c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
    description:
      '빛은 모네의 인생 주제였습니다. 빛을 어디에서 어떻게 보고 그릴 수 있는지만을 평생 고민한 사람이라고 할 수 있죠. \r\n센 강 위에 작은 배를 띄어놓고 해가 뜨고 질 떄까지 수면위에 나타나는 빛을 그렸다고합니다. 참 낭만적이죠? \r\n낭만적인 연구는 여기서 끝나지 않습니다. 이 문장은 마지막 문장입니다.',
    commentCount: 10,
    likeCount: 200,
    author: {
      id: 'nkj123',
      name: 'Nike Jordan',
      profile: 'https://faces-img.xcdn.link/image-lorem-face-6244.jpg',
    },
  },
];

export const artistsMock = [
  {
    name: '서채하',
    image: '/images/mock1.png',
  },
  {
    name: '이연지',
    image: '/images/mock2.png',
  },
  {
    name: '김채린',
    image: '/images/mock3.png',
  },
];
// 초기 작품 목록 데이터 샘플
export const initalArtWorks: Artwork[] = [
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    creator: '레오나르도 다빈치',
    type: 'picture',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f',
    creator: '레오나르도 다빈치',
    title: 'Snacks',
    type: 'picture',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    creator: '레오나르도 다빈치',
    title: 'Mushrooms',
    type: 'picture',
  },
  {
    img: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383',
    creator: '레오나르도 다빈치',
    title: 'Tower',
    type: 'craft',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    creator: '레오나르도 다빈치',
    title: 'Sea star',
    type: 'craft',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    creator: '레오나르도 다빈치',
    title: 'Honey',
    type: 'recommend',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    creator: '레오나르도 다빈치',
    title: 'Basketball',
    type: 'recommend',
  },
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    creator: '레오나르도 다빈치',
    title: 'Breakfast',
    type: 'recommend',
  },
  {
    img: 'https://images.unsplash.com/photo-1627328715728-7bcc1b5db87d',
    creator: '레오나르도 다빈치',
    title: 'Tree',
    type: 'edition',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    creator: '레오나르도 다빈치',
    title: 'Burger',
    type: 'edition',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    creator: '레오나르도 다빈치',
    title: 'Camera',
    type: 'edition',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    creator: '레오나르도 다빈치',
    title: 'Coffee',
    type: 'drawing',
  },
  {
    img: 'https://images.unsplash.com/photo-1627000086207-76eabf23aa2e',
    creator: '레오나르도 다빈치',
    title: 'Camping Car',
    type: 'drawing',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    creator: '레오나르도 다빈치',
    title: 'Hats',
    type: 'life',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    creator: '레오나르도 다빈치',
    title: 'Tomato basil',
    type: 'life',
  },
  {
    img: 'https://images.unsplash.com/photo-1488229297570-58520851e868?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    creator: '레오나르도 다빈치',
    title: 'New Hope',
    type: 'digital',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    creator: '레오나르도 다빈치',
    title: 'Bike',
    type: 'life',
  },
  {
    img: 'https://images.unsplash.com/photo-1569309338532-a0c01062acc8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    creator: '레오나르도 다빈치',
    title: 'Uncle',
    type: 'draw',
  },
  {
    img: 'https://images.unsplash.com/photo-1491245338813-c6832976196e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    creator: '레오나르도 다빈치',
    title: 'Flower',
    type: 'draw',
  },
  {
    img: 'https://images.unsplash.com/photo-1549887534-1541e9326642?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80',
    creator: '레오나르도 다빈치',
    title: 'Greece',
    type: 'sculpture',
  },
];

// 리뷰 목록 데이터 샘플
export const initialReviews = [
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    creator: '레오나르도 다빈치',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f',
    creator: '레오나르도 다빈치',
    title: 'Snacks',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    creator: '레오나르도 다빈치',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383',
    creator: '레오나르도 다빈치',
    title: 'Tower',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    creator: '레오나르도 다빈치',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    creator: '레오나르도 다빈치',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    creator: '레오나르도 다빈치',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    creator: '레오나르도 다빈치',
    title: 'Breakfast',
  },
];

// 공지사항 목록 데이터 샘플
export const noticeLists = [
  {
    id: 2,
    title: '[여름 휴가 안내]',
    description: `안녕하세요. 여름휴가로 인해 입점문의와 시스템문의와 관련한 고객센터가 아래 기간동안 휴무를 가집니다. 

    *21.08.07~15일

    이 기간동안 미리 입점문의와 시스템문의를 해주시길 바랍니다. 감사합니다. `,
    createAt: '2021.08.01',
  },
  {
    id: 1,
    title: '[서비스 점검]',
    description: `더 나은 서비스를 위해 금일 오후 11시부터 오전 10시까지 시스템점검을 안내드립니다. 
      해당 시간동안 원활한 서비스가 진행되지 못하는 점 양해부탁드립니다. 
      
        *점검일시: 07.01 오후 11~ 07.02 오전 10시`,
    createAt: '2021.07.01',
  },
];

// FAQ 목록 데이터 샘플
export const initalFaqLists = [
  {
    id: '1',
    relatedType: '주문/결제',
    title: `입금했는데 입금 확인이 되지 않아요.`,
    description: `입금을 했는데 입금 확인이 되지 않으셨나요?

발급 받은 가상계좌로 정상적으로 입금하신 경우, 최대 5분 내로 자동 입금 확인 처리됩니다. 아래 내용을 참고해 주세요.  
1. 주문 금액과 입금 금액이 동일하지 않으면 입금이 불가합니다. 
2.입금자명에 상관 없이 입금한 가상계좌가 부여된 고객님의 주문 내역에 입금 확인이 진행됩니다. 
- (구)ATM기기로 입금이 불가합니다. 계좌이체 또는 은행 창구를 통해 입금 부탁드립니다. 
- 입금 확인이 되기 전에 주문을 취소할 경우, 입금하셨던 금액은 고객님의 회원 정보에 등록된 환불 계좌로 자동 환불됩니다. 
- 입금 전 주문을 취소하고 발급 받은 가상계좌로 입금을 시도할 경우, 입금이 불가합니다. 주문을 원하실 경우, 재주문 후 새로 발급 받은 가상계좌로 입금 부탁드립니다.  
관련하여 궁금한 사항은, 뜰 고객지원센터로 문의 바랍니다. 감사합니다.
    `,
    isOpened: true,
    isFirstInTypeGroup: true, // 리스트에서 그룹별 분리표시를 위한 유형 그룹내에 첫번째 항목 여부
  },
  {
    id: '2',
    relatedType: '주문/결제',
    title: `입금 확인 전에 주문을 취소했는데, 환불이 되지 않아요.`,
    description: `고객님께서 입금 후 입금 확인이 되기 전 취소를 하셨다면, 주문하셨을 때 등록하신 환불계좌로 영업일 기준 2일이내 환불이 진행될 예정입니다.

관련하여 궁금한 사항은 뜰 고객지원센터로 문의 바랍니다. 감사합니다.`,
    isOpened: false,
    isFirstInTypeGroup: false, // 리스트에서 그룹별 분리표시를 위한 유형 그룹내에 첫번째 항목 여부
  },
  {
    id: '3',
    relatedType: '주문/결제',
    title: `입금자 명을 바꾸고 싶어요.`,
    description: `무통장 입금 결제방식은 가상 계좌로만 이용이 가능합니다.
가상 계좌는 입금자명이 상이하더라도 '입금 금액'과 '주문 금액'이 일치하다면 정상 입금 확인 가능한 점 참고 부탁드립니다. 
※ '입금 금액'과 '주문 금액'이 다를 경우, 입금이 되지 않습니다.
감사합니다.
    `,
    isOpened: false,
    isFirstInTypeGroup: false, // 리스트에서 그룹별 분리표시를 위한 유형 그룹내에 첫번째 항목 여부
  },

  {
    id: '4',
    relatedType: '환불',
    title: `교환/반품 절차가 궁금해요`,
    description: `받아보신 작품은 각 판매 작가님의 교환/환불 절차에 따라 달라질 수 있습니다.

교환/반품을 원하시면 아래의 절차를 확인해주세요.

1. 처음 포장되었던 상태 그대로 복원해 주세요.
2. 고객센터나 [주문내역]에서 교환 문의를 해주세요..
3. 반품 배송 방법은 작가님과 상의하시고 합의한 방법으로 보내세요.
    
    `,
    isOpened: false,
    isFirstInTypeGroup: true, // 리스트에서 그룹별 분리표시를 위한 유형 그룹내에 첫번째 항목 여부
  },
  {
    id: '5',
    relatedType: '환불',
    title: `반품 접수를 했는데 며칠째 회수가 안됩니다.`,
    description: `앱을 통한 반품 접수 시, 공휴일과 일요일을 제외한 ~2일이내 택배 기사님께서 방문하실 예정이지만 택배 업체의 사정으로 택배 회수가 지연될 수 있어요.
위에 안내드린 기간이 경과되었으나 아직도 회수가 되지 않았다면, 뜰 고객지원센터로 다시 한번 문의 부탁드려요.
    `,
    isOpened: false,
    isFirstInTypeGroup: false, // 리스트에서 그룹별 분리표시를 위한 유형 그룹내에 첫번째 항목 여부
  },
  {
    id: '6',
    relatedType: '환불',
    title: `교환/반품 배송비는 얼마인가요?`,
    description: `교환 : 기본지역 3000원 / 제주,도서산간: 8,500원
전체반품 : 기본지역 : 5,500원 / 제주,도서산간:12,000원
*불량,오배송일 경우 별도 배송비가 발생하지 않습니다. 
    `,
    isOpened: false,
    isFirstInTypeGroup: false, // 리스트에서 그룹별 분리표시를 위한 유형 그룹내에 첫번째 항목 여부
  },
];

// 문의 내역 목록 데이터 샘플
export const initalQnaLists = [
  {
    id: '1',
    status: '진행중',
    title: `결제시스템이 계속 오류가 납니다. 빨리 해결해주세요`,
    createdAt: '2021.09.01',
    answered: '답변 작성 대기중입니다.',
    isOpened: false,
  },
  {
    id: '2',
    status: '답변완료',
    title: `로그인 실행이 계속 튕기는데 이유가 뭘까요? 이것때문에
    옥션 참여를 못하고 있는데요`,
    createdAt: '2021.09.01',
    answered: `안녕하세요 고객님.
    예술을 향유하는 첫걸음 뜰입니다.
    2022.08.01 24:00 ~ 7:00까지 업데이트가 진행되어 이용에 제
    약이 있었습니다. 현재는 복구한 상태이니 불편을 드려 정말 죄
    송합니다. 만약 지속적인 로그인 실행이 어려우시다면 번거로
    우 시겠지만 art.ddle@gmail.com으로 문의 주시면 확인 후
    안내드리겠습니다.
    접속이 안되는 영역과 접속이 되지 않는 화면을 영상으로 첨부
    하여 함께 문의하여 주시면 보다 정확한 안내가 가능할 것같아
    문의하실때 참고부탁드리겠습니다.`,
    isOpened: false,
  },
];

// 알림화면내 푸시 내역 리스트
export const pushLists = [
  {
    id: '1',
    type: 'notice',
    message:
      '💌 한은 작가에게 ‘공기의 흐름’ 의 3줄 큐레이팅 후기를 남겨보세요!',
    createdTimeAgo: '2주전',
  },
  {
    id: '2',
    type: 'congrat',
    message:
      '최우림님, 축하합니다🥳 ‘홀릭컬렉터’로 올라갔어요. 지금 확인해보세요!',
    createdTimeAgo: '3주전',
  },
  {
    id: '3',
    type: 'auction',
    message: '<바닷가에서 본 풍경>이 옥션에 올라왔습니다. 옥션에 참여해보세요!',
    createdTimeAgo: '3주전',
  },
];

// 장바구니 작가별 구매 항목 목록리스트
// export const products = [];

export const products = [
  {
    id: '1',
    productType: '도예',
    productName: '땅콩보관함 set',
    productImg:
      'https://images.unsplash.com/photo-1624934619772-93eb71ad3d64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    price: 129000,
    quantity: 1,
    provider: {
      id: 'chgok',
      name: '차곡스튜디오',
    },
  },
  {
    id: '2',
    productType: '도예',
    productName: '팔각머그컵',
    productImg:
      'https://images.unsplash.com/photo-1624934619772-93eb71ad3d64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    price: 100000,
    quantity: 2,
    provider: {
      id: 'chgok',
      name: '차곡스튜디오',
    },
  },
  {
    id: '3',
    productType: '도예',
    productName: '삼각머그컵',
    productImg:
      'https://images.unsplash.com/photo-1624934619772-93eb71ad3d64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    price: 300000,
    quantity: 10,
    provider: {
      id: 'chgok',
      name: '차곡스튜디오',
    },
  },
  {
    id: '4',
    productType: '조형',
    productName: '펜타곤',
    productImg:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/The_Pentagon_January_2008.jpg/275px-The_Pentagon_January_2008.jpg',
    price: 1200,
    quantity: 1,
    provider: {
      id: 'dod',
      name: '미 국방성',
    },
  },
];
