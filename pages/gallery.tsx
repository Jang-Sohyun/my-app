import { useMemo } from 'react';
import Text from '@mui/material/Typography';
import {
  Stack,
  Button,
  ListItem,
  ListItemButton,
  Avatar,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import AvatarProfile from '../components/AvatarProfile';
import ScreenBox from '../components/ScreenBox';
import CategorySelect from '../components/common/CategorySelect';
import TopHeader from '../components/common/TopHeader';
import { useRouter } from 'next/router';
import { useDdleContext } from '../contexts/Ddle';
import { useContext as useConfirm } from '../contexts/confirm';
import { CATEGORIES } from '../constants/artistTags';
import { apis } from '../apis';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../components/Loader';
import Link from 'next/link';
import { useSnackbar } from 'notistack';

const Gallery = () => {
  const router = useRouter();
  const selectedTab = Number(router.query.tab || 0);
  const { user, requestLogin } = useDdleContext();
  const [, confirm] = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const create = apis.follow.useCreate();
  const remove = apis.follow.useRemove();

  const categories = ['전체', ...CATEGORIES];
  const selectedCategoryFilter = categories[selectedTab];
  const result = apis.artist.useGetInfiniteList({
    query: {
      populate: ['user', 'user.avatar', 'avatar', 'images'],
      sort: ['createdAt:DESC'],
      filters: {
        user: {
          id: {
            $notNull: true,
          },
        },
        categories: {
          $containsi:
            selectedCategoryFilter === '전체'
              ? undefined
              : selectedCategoryFilter,
        },
      },
    },
  });
  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [result]);
  const threeDayBefore = useMemo(
    () => dayjs().subtract(30, 'days').toISOString(),
    []
  );

  const { data: newArtists } = apis.artist.useGetList({
    query: {
      populate: ['user', 'user.avatar', 'avatar', 'images'],
      sort: ['createdAt:desc'],
      filters: {
        createdAt: {
          $gt: threeDayBefore,
        },
        user: {
          id: {
            $notNull: true,
          },
        },
        categories: {
          $containsi:
            selectedCategoryFilter === '전체' ? '' : selectedCategoryFilter,
        },
      },
    },
  });
  return (
    <>
      <ScreenBox footer>
        <TopHeader
          showSearch={true}
          showNotification={false}
          showLogo={false}
          title="작가 리스트"
        />

        <Box sx={{ overflow: 'hidden', width: '100%' }}>
          <CategorySelect
            size="small"
            tabs={categories}
            selectedTab={selectedTab}
            onChange={(idx) => {
              router.replace({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  tab: idx,
                },
              });
            }}
          />
        </Box>

        {/* FIXME : 신규 입점작가 영역은 항상 표시되는것인지 스펙 확인 후 조건에 맞게 렌더 되도록 수정 예정 */}
        {newArtists?.data && newArtists.data.length > 0 ? (
          <>
            <Text sx={styles.newArtistTitle}>신규 입점작가</Text>

            <Stack direction="row" spacing={3} sx={styles.newArtists}>
              {newArtists.data?.map(({ id, attributes }) => (
                <Stack key={id} justifyContent="center" alignItems="center">
                  <Link href={`/artist/${id}`}>
                    <Avatar
                      src={attributes.url}
                      // name={attributes.name}
                      sx={styles.avatarProfile}
                    />
                  </Link>
                  <Text align="center" noWrap style={styles.artistName}>
                    {attributes.nickname}
                  </Text>
                </Stack>
              ))}
            </Stack>
            <Divider variant="middle" sx={styles.divider} />
          </>
        ) : null}
        {result.isLoading ? (
          <Loader sx={{ py: 6 }} />
        ) : items.length === 0 ? (
          <Stack sx={{ width: '100%', py: 12 }} alignItems="center">
            <Typography sx={{ color: (theme) => theme.palette.grey[400] }}>
              작가 정보가 없습니다.
            </Typography>
          </Stack>
        ) : (
          <Stack
            sx={{
              width: '100%',
              maxWidth: 360,
              backgroundColor: 'background.paper',
            }}
          >
            <InfiniteScroll
              dataLength={items?.length || 0} //This is important field to render the next data
              next={result.fetchNextPage}
              hasMore={result.hasNextPage}
              loader={<h4>로딩 중</h4>}
            >
              {/* // sx={{  }} */}

              {items.map(({ id, attributes }) => {
                const userIdOfArtist = attributes.user.data?.id;
                return (
                  <ListItem
                    key={id}
                    secondaryAction={
                      <Button
                        variant={
                          attributes.isFollowed ? 'contained' : 'outlined'
                        }
                        sx={[
                          {
                            width: '90px',
                            height: '30px',
                            borderRadius: '20px',
                          },
                          attributes.isFollowed
                            ? {
                                borderColor: 'transparent',
                                color: '#000',
                                backgroundColor: '#EFF0F1 !important',
                                boxShadow: 'none',
                              }
                            : {
                                borderColor: '#444',
                                boxShadow: 'none',
                                color: '#444',
                              },
                        ]}
                        onClick={async () => {
                          if (user) {
                            if (user?.id === userIdOfArtist) {
                              alert('본인은 구독할 수 없습니다.');
                            } else if (!create.isLoading && !remove.isLoading) {
                              if (attributes.isFollowed) {
                                confirm
                                  .open({
                                    title: '구독을 취소합니까?',
                                    buttons: [
                                      {
                                        label: '아니요',
                                      },
                                      {
                                        label: '네',
                                        isDanger: true,
                                      },
                                    ],
                                  })
                                  .then(async (confirm) => {
                                    if (confirm === '네') {
                                      await remove.mutateAsync(
                                        attributes.followedData.id
                                      );
                                      result.refetch();
                                    }
                                  });
                              } else {
                                if (user) {
                                  await create.mutateAsync({
                                    user: user.id,
                                    follow_target: userIdOfArtist,
                                  });
                                  result.refetch();
                                  enqueueSnackbar('구독이 완료되었습니다.');
                                }
                              }
                            }
                          } else {
                            requestLogin();
                          }
                        }}
                      >
                        {attributes.isFollowed ? '구독 중' : '구독하기'}
                      </Button>
                    }
                    disablePadding
                  >
                    <ListItemButton
                      disableRipple
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/artist/${id}`);
                      }}
                    >
                      <AvatarProfile
                        avatarSx={styles.avatarRoot}
                        avatar={attributes.avatar.data?.attributes.url}
                        name={attributes.nickname}
                        nameSx={{
                          fontSize: '1rem',
                          marginLeft: '8px !important',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </InfiniteScroll>
          </Stack>
        )}
      </ScreenBox>
    </>
  );
};

const styles = {
  newArtistTitle: {
    width: '84%',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '10px',
  },
  divider: {
    width: '84%',
    marginTop: '6px',
    marginBottom: '3px',
  },
  avatarRoot: {
    width: '50px',
    height: '50px',
    borderRadius: '25px',
    border: '1px solid #ddd',
  },
  subscribeButton: {
    borderColor: '#444',
    borderRadius: '20px',
    height: '30px',
    color: '#444',
  },
  avatarProfile: {
    width: '50px',
    height: '50px',
    boxShadow: 'rgb(100 100 111 / 20%) 0px 2px 7px 0px',
  },
  newArtists: {
    width: '84%',
    overflowX: 'auto',
    mb: 1.5,
  },
  artistName: {
    fontSize: '14px',
    marginTop: '5px',
  },
};

export default Gallery;
