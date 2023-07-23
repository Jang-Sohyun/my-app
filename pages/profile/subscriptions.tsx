import { useState, useEffect } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Typography,
  Stack,
} from '@mui/material';
import Text from '@mui/material/Typography';
import ScreenBox from '../../components/ScreenBox';
import BasicAppBar from '../../components/common/BasicAppBar';
import SubTabs from '../../components/common/SubTabs';
import { subTabsInSubscriptionManagement } from '../../constants/subTabs';
import { useRouter } from 'next/router';
import { apis } from '../../apis/index';
import { useContext as useConfirm } from '../../contexts/confirm';
import { useDdleContext } from '../../contexts/Ddle';
import Loader from '../../components/Loader';

interface FollowItem {
  id?: number | null;
  artistId?: number | null;
  targetId: number;
  nickname: string;
  avatarUrl: string;
  subscribed: boolean;
}
const SubscriptionManagement = (props: any) => {
  const router = useRouter();
  const curTab = router.query.tab || 'subscribers';
  const { user } = useDdleContext();
  const [, confirm] = useConfirm();

  const [loading, setLoading] = useState(false);
  const [entireFollows, setEntireFollows] = useState<FollowItem[]>([]);
  const [entireFollowedBy, setEntireFollowedBy] = useState<FollowItem[]>([]);
  useEffect(() => {
    if (user) {
      (async () => {
        setLoading(true);
        if (curTab === 'subscribers') {
          try {
            const items: FollowItem[] = [];

            let page = 1;
            let pageCount = 1;
            do {
              const { data, meta } = await apis.follow.getList({
                query: {
                  populate: [
                    'user',
                    'user.avatar',
                    'follow_target',
                    'follow_target.avatar',
                    'follow_target.artist',
                    'follow_target.artist.avatar',
                  ],
                  sort: ['createdAt:desc'],
                  filters: {
                    user: {
                      id: {
                        $eq: user?.id,
                      },
                    },
                  },
                  pagination: {
                    page,
                  },
                },
              });
              pageCount = meta.pagination.pageCount;
              for (const item of data) {
                const followTarget = item.attributes.follow_target.data;
                const artist = followTarget.attributes.artist?.data;

                items.push({
                  id: item.id,
                  targetId: followTarget.id,
                  nickname: artist
                    ? artist.attributes.nickname
                    : followTarget.attributes.nickname,
                  avatarUrl: artist
                    ? artist.attributes.avatar.data?.attributes.url
                    : followTarget.attributes.avatar.data?.attributes.url,
                  subscribed: true,
                  artistId: artist?.id,
                });
              }
            } while (page++ < pageCount);
            setEntireFollows(items);
          } catch (e) {
            alert(e.message);
          } finally {
            setLoading(false);
          }
        } else {
          try {
            const items: FollowItem[] = [];

            let page = 1;
            let pageCount = 1;
            do {
              const { data, meta } = await apis.follow.getList({
                query: {
                  populate: [
                    'user',
                    'user.avatar',
                    'user.artist',
                    'user.artist.avatar',
                    'follow_target',
                  ],
                  sort: ['createdAt:desc'],
                  filters: {
                    follow_target: {
                      id: { $eq: user?.id },
                    },
                  },
                  pagination: {
                    page,
                  },
                },
              });
              pageCount = meta.pagination.pageCount;
              const follows = await Promise.all(
                data.map(async (item: any) => {
                  const { data } = await apis.follow.getList({
                    query: {
                      filters: {
                        follow_target: {
                          id: { $eq: item.attributes.user.data.id },
                        },
                      },
                      pagination: {
                        pageSize: 1,
                      },
                    },
                  });
                  const isFollowed = data.length > 0;
                  return {
                    isFollowed,
                  };
                })
              );
              for (const idx in data) {
                const item = data[idx];
                const isFollowed = follows[idx].isFollowed;

                const followee = item.attributes.user.data;
                const artist = followee.attributes.artist?.data;

                items.push({
                  id: item.id,
                  targetId: followee.id,
                  nickname: artist
                    ? artist.attributes.nickname
                    : followee?.attributes.nickname,
                  avatarUrl: artist
                    ? artist.attributes.avatar.data?.attributes.url
                    : followee.attributes.avatar.data?.attributes.url,
                  subscribed: isFollowed,
                  artistId: followee?.attributes.artist.data?.id,
                });
              }
            } while (page++ < pageCount);
            setEntireFollowedBy(items);
          } catch (e) {
            console.error(e);
            alert(e.message);
          } finally {
            setLoading(false);
          }
        }
      })();
    }
  }, [user, curTab]);

  const itemsToRender =
    curTab === 'subscribers' ? entireFollows : entireFollowedBy;
  const setItems =
    curTab === 'subscribers' ? setEntireFollows : setEntireFollowedBy;
  return (
    <ScreenBox>
      <BasicAppBar title="구독 관리" />

      <SubTabs
        tabs={subTabsInSubscriptionManagement}
        initialTab={curTab}
        onChangeTab={(_, tab) => {
          router.replace({
            pathname: router.pathname,
            query: {
              ...router.query,
              tab,
            },
          });
        }}
        sx={{
          '& .MuiTabs-indicator': {
            transform: 'scaleX(0.5)',
          },
        }}
      />

      <List sx={styles.list}>
        {loading ? (
          <Loader />
        ) : itemsToRender.length === 0 ? (
          <Stack sx={{ width: '100%', py: 12 }} alignItems="center">
            <Typography sx={{ color: (theme) => theme.palette.grey[400] }}>
              구독 데이터가 없습니다.
            </Typography>
          </Stack>
        ) : (
          itemsToRender.map((subscriber, index) => (
            <ListItem
              key={subscriber.id}
              secondaryAction={
                <Button
                  variant={subscriber.subscribed ? 'contained' : 'outlined'}
                  sx={[
                    {
                      height: '30px',
                      borderRadius: '20px',
                    },
                    subscriber.subscribed
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
                    if (subscriber.subscribed) {
                      confirm
                        .open({
                          title: `${subscriber.nickname}님을 구독 취소합니까?`,
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
                            if (subscriber.id) {
                              await apis.follow.remove(subscriber.id);
                              setItems((items) => {
                                const newItems = [...items];
                                newItems[index].subscribed = false;
                                return newItems;
                              });
                            }
                          }
                        });
                    } else {
                      await apis.follow.create({
                        follow_target: subscriber.targetId,
                        user: user.id,
                      });
                      setItems((items) => {
                        const newItems = [...items];
                        newItems[index].subscribed = true;
                        return newItems;
                      });
                    }
                  }}
                >
                  {subscriber.subscribed ? '구독 중' : '구독하기'}
                </Button>
              }
              disablePadding
            >
              <ListItemButton
                onClick={(e) => {
                  if (subscriber.artistId) {
                    router.push(`/artist/${subscriber.artistId}`);
                  } else {
                    router.push(`/profile/${subscriber.targetId}`);
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={styles.avatarRoot} src={subscriber.avatarUrl} />
                </ListItemAvatar>
                <Text ml={1}>{subscriber.nickname}</Text>
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </ScreenBox>
  );
};

const styles = {
  list: {
    width: '100%',
    // maxWidth: 360,
    bgcolor: 'background.paper',
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
  newArtists: {
    width: '84%',
    overflowX: 'auto',
  },
  artistName: {
    fontSize: '14px',
    marginTop: '5px',
  },
};

export default SubscriptionManagement;
