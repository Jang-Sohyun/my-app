import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import Text from '@mui/material/Typography';
import Image from '../components/Image';
import {
  Stack,
  Box,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import ScreenBox from '../components/ScreenBox';
import GalleryList from '../components/common/GalleryList';
import * as newStaticUrls from '../constants/staticUrls';
import TopHeader from '../components/common/TopHeader';
import { HOME_CATEGORIES } from '../constants/category';
import { useDdleContext } from '../contexts/Ddle';
import { apis } from '../apis/index';
import dayjs from 'dayjs';
import Link from 'next/link';

const useScrollHistory = () => {
  useEffect(() => {
    const scrollKey = 'scroll[/]';
    const prevScroll = window.sessionStorage.getItem(scrollKey);
    if (prevScroll) {
      const { scrollY } = JSON.parse(prevScroll);
      window.scrollTo(0, scrollY);
    }

    const handleScroll = () => {
      window.sessionStorage.setItem(
        scrollKey,
        JSON.stringify({
          scrollY: window.scrollY,
        })
      );
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

const Home = () => {
  const router = useRouter();

  const selectedCategoryTab = Number(router.query.tab) || 0;
  const categories = ['추천', ...HOME_CATEGORIES];

  const { user } = useDdleContext();
  useScrollHistory();

  const yesterday = useMemo(() => {
    return dayjs().subtract(1, 'day').toISOString();
  }, []);

  const tagFilter =
    selectedCategoryTab === 0 ? null : categories[selectedCategoryTab];
  const { data: artistNoteCount } = apis.artistNote.useGetCount({
    query: {
      filters: {
        createdAt: {
          $gte: yesterday,
        },
      },
    },
  });

  // 탭 변경시 해당하는 카테고리의 아이템만 state에 넣는다.
  const onChangeCategoryHandler = (tabIndex: number) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        tab: tabIndex,
      },
    });
  };

  const result = apis.product.useGetInfiniteList({
    query: {
      populate: ['images', 'artist', 'thumbnails'],
      sort: ['score:DESC', 'createdAt:DESC'],
      filters: tagFilter
        ? {
            tags: {
              $containsi: tagFilter,
            },
            display: {
              $eq: true,
            },
          }
        : {
            display: {
              $eq: true,
            },
          },
    },
  });
  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [result]);

  return (
    <>
      <ScreenBox footer>
        {/* 상단 메뉴 */}
        <TopHeader showNotification={false} />

        {/* 안내 문구 및 CTA 버튼 */}
        <Box sx={styles.notificationMsg} mt={8} mb={4}>
          {user ? `${user?.nickname}님` : null}
          <Stack direction="row" spacing="1" alignItems="baseline">
            <Link href="/community">
              <Text variant="h4" component="h2" sx={styles.artistNoteCount}>
                {artistNoteCount || 0}개의 작가노트
              </Text>
            </Link>
            가
          </Stack>
          올라왔어요
        </Box>

        <Box
          sx={styles.unreadMessageBox}
          onClick={() => {
            router.push('community');
          }}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <Image
                  objectFit="cover"
                  width="48px"
                  height="48px"
                  src={newStaticUrls.Icons.UnreadMessages}
                  alt="Notice"
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="작가노트 확인하러 가기"
              secondary="작가님과 댓글로 소통해보세요!"
            />
          </ListItem>
        </Box>

        {/* 작품 목록 그리드 */}
        <GalleryList
          isLikeable
          title="취향저격 작품을 찾아보세요"
          items={items}
          loading={result.isLoading}
          selectedTab={selectedCategoryTab}
          tabs={categories}
          onChangeCategory={onChangeCategoryHandler}
          fetchNextPage={result.fetchNextPage}
          hasNextPage={result.hasNextPage}
        />
      </ScreenBox>
    </>
  );
};

const styles = {
  topBarWrapper: {
    width: '84%',
    padding: '20px 0px',
  },
  notificationIcon: {
    marginLeft: 'auto !important',
  },
  notificationMsg: {
    width: '84%',
    textAlign: 'left',
    fontSize: '24px',
  },
  artistNoteCount: {
    fontWeight: 'bold',
    textDecoration: 'rgb(239,240,241) underline',
    textDecorationThickness: '6px',
  },
  unreadMessageBox: {
    width: '84%',
    backgroundColor: 'rgb(239,240,241)',
    borderRadius: '20px',
  },
  logoImage: {
    marginTop: '2px',
  },
};

export default Home;
