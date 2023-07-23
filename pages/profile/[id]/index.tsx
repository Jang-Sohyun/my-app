import { useEffect, useMemo, useState } from 'react';
import BottomMenu from '../../../components/common/BottomMenu';
import AvatarProfile from '../../../components/AvatarProfile';
import ScreenBox from '../../../components/ScreenBox';
import { Stack, Button } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { handleUrl } from '../../../libs/url';
import BasicAppBar from '../../../components/common/BasicAppBar';
import PostTimeLine from '../../../components/common/PostTimeLine';
import ReviewList from '../../../components/ReviewList';
import { useDdleContext } from '../../../contexts/Ddle';
import { apis } from '../../../apis';
import { useContext as useConfirm } from '../../../contexts/confirm';
import { useSnackbar } from 'notistack';

const Profile = ({ profile }: any) => {
  const router = useRouter();
  const tab = router.query.tab || '0';
  const { user } = useDdleContext();
  const [, confirm] = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const { follow, isFollowed } = apis.follow.useFollow(profile.id);
  const result = apis.artistNote.useGetInfiniteList({
    query: {
      populate: [
        'user',
        'user.avatar',
        'artist',
        'artist.avatar',
        'artist.user',
        'images',
        'product',
        'product.thumbnails',
      ],
      sort: ['createdAt:desc'],
      filters: {
        user: {
          id: {
            $eq: profile.id,
          },
        },
        removed: {
          $ne: true,
        },
      },
    },
  });
  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [result]);

  const isMe = profile.id === user?.id;

  const [checkedIfArtist, setCheckedIfArtist] = useState(false);
  useEffect(() => {
    if (!checkedIfArtist && profile.attributes?.artist.data) {
      router.replace(`/artist/${profile.attributes.artist.data.id}`);
    }
  }, [profile]);

  return (
    <ScreenBox>
      <BasicAppBar title="프로필" />

      <Stack
        direction="row"
        sx={{ width: '100%', px: 2, pt: 1 }}
        alignItems="center"
      >
        <AvatarProfile
          avatar={profile.avatar?.url}
          name={profile.nickname}
          subName="비기너 컬렉터"
          avatarSx={{
            width: '50px',
            height: '50px',
            borderRadius: '25px',
            border: '1px solid #ddd',
          }}
          nameSx={{
            fontSize: '1rem',
            marginLeft: '8px !important',
            lineHeight: 1.5,
          }}
          subNameSx={{
            fontSize: '0.8rem',
            marginLeft: '8px !important',
            color: 'rgb(121, 121, 121)',
            lineHeight: 1,
          }}
          sx={{ flex: 1 }}
        />
        {isMe ? null : (
          <Button
            variant={isFollowed ? 'contained' : 'outlined'}
            sx={[
              {
                height: '30px',
                borderRadius: '20px',
              },
              isFollowed
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
            onClick={() => {
              if (isFollowed) {
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
                      follow();
                    }
                  });
              } else {
                follow();
                enqueueSnackbar('구독이 완료되었습니다.');
              }
            }}
          >
            {isFollowed ? '구독 중' : '구독하기'}
          </Button>
        )}
      </Stack>
      <Tabs
        centered
        value={tab}
        sx={{
          width: '100%',

          '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          },
          '& .MuiTabs-indicatorSpan': {
            maxWidth: 72,
            width: '100%',
            backgroundColor: 'rgb(65, 65, 65)',
          },
          '& .Mui-selected': {
            fontWeight: 'bold',
          },
        }}
        TabIndicatorProps={{
          children: <span className="MuiTabs-indicatorSpan" />,
        }}
        onChange={(_, newV) => {
          router.replace(handleUrl().set('tab', newV).path());
        }}
      >
        <Tab disableRipple sx={{ width: '50%' }} label="노트" value="0" />
        <Tab disableRipple sx={{ width: '50%' }} label="감상평" value="1" />
      </Tabs>
      <Box
        sx={{
          backgroundColor: '#F7F7F7',
          flex: 1,
          width: '100%',
          height: '100%',
          borderTop: '1px solid rgb(236, 236, 236)',
          paddingTop: '30px',

          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {tab === '0' ? (
          <PostTimeLine
            items={items}
            hasNextPage={result.hasNextPage}
            fetchNextPage={result.fetchNextPage}
            loading={result.isLoading}
            refetch={result.refetch}
            detailMode
          />
        ) : tab === '1' ? (
          <ReviewList user={profile} />
        ) : null}
      </Box>
    </ScreenBox>
  );
};
export async function getServerSideProps(context) {
  try {
    const profileId = context.params.id;
    const profile = await apis.user.get(Number(profileId), {
      query: {
        populate: ['avatar', 'artist.avatar', 'artist.background'],
      },
    });
    return {
      props: { profile },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        error: e.message,
      },
    };
  }
}

export default Profile;
