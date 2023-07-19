import { useState, useEffect, useMemo } from 'react';
import ScreenBox from 'components/ScreenBox';
import GalleryList from 'components/common/GalleryList';
import {
  Stack,
  IconButton,
  Avatar,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { handleUrl } from 'libs/url';
import BasicAppBar from 'components/common/BasicAppBar';
import PostTimeLine from 'components/common/PostTimeLine';
import { initalArtWorks } from 'constants/mockData';
import Alert from 'components/Alert';
import { ShareIcon, MessageIcon, LikeIcon } from 'components/svgIcons';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Backdrop from '@mui/material/Backdrop';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import useConfirmDialog from 'libs/useConfirmDialog';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';
import { apis } from 'apis/index';
import { useDdleContext } from 'contexts/Ddle';
import * as onboardings from 'libs/onboardings';
import share from 'libs/share';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#000',
    boxShadow: theme.shadows[1],
    fontSize: 13,
    whiteSpace: 'pre',
    width: '100%',
    marginLeft: '20px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    backgroundColor: theme.palette.common.white,
    color: '#000',
    fontSize: 13,
  },
}));
const Title = (props: any) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ width: '100%', px: 4, mb: '20px' }}
      role="button"
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      <Typography sx={{ fontWeight: 'bold', flex: 1, fontSize: 15 }}>
        {props.label}
      </Typography>
      {props.onClick ? (
        props.Icon ? (
          <props.Icon sx={{ color: (theme) => theme.palette.grey[400] }} />
        ) : (
          <KeyboardArrowRightIcon
            sx={{ color: (theme) => theme.palette.grey[400] }}
          />
        )
      ) : null}
    </Stack>
  );
};
const tooltipStr = `프로필을 클릭하여 작가님을 구독해보세요!\n작가님의 최신 소식과 근황을 빠르게 알려드립니다 :)`;
const ArtistProfile = ({ artist }: any) => {
  const router = useRouter();

  const { user } = useDdleContext();
  const artistId = router.query.id;
  const tab = router.query.tab || '0';
  const [profileNotiOpen, setProfileNotiOpen] = useState(false);
  const confirmDialog = useConfirmDialog();

  const handleProfileNotiClose = () => {
    if (profileNotiOpen) {
      setProfileNotiOpen(false);
      setTimeout(() => {
        confirmDialog
          .open({
            title: `${artist.attributes.nickname}님과 같은 예술작가를\n더 찾아보고 구독신청을 하세요!`,
            body: `예술취향이 더 다채로워 질거예요👀`,
            buttons: {
              cancel: '다음에 할게요',
              confirm: '작가 보러가기',
            },
          })
          .then((confirm) => {
            if (confirm) {
              router.push('/gallery');
            }
          });
      }, 2000);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      const done = onboardings.isDone('FollowArtist');
      if (!done) {
        setProfileNotiOpen(true);
        onboardings.done('FollowArtist');
      }
    }, 1000);
  }, []);

  const handleProfileNotiOpen = () => {
    setProfileNotiOpen(true);
  };
  const isMe = user && artist.attributes?.user.data?.id === user?.id;

  const { follow, isFollowed } = apis.follow.useFollow(
    artist.attributes?.user.data?.id
  );

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
        artist: {
          id: {
            $eq: artistId,
          },
        },
        removed: {
          $ne: true,
        },
      },
    },
  });

  const [openIntro, setOpenIntro] = useState(false);
  const [openRule, setOpenRule] = useState(false);
  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [result]);

  if (!artist) return null;

  return (
    <ScreenBox
      sx={{
        backgroundImage: `url(${artist.attributes.background.data.attributes.url})`,
        paddingBottom: 0,
        marginBottom: '36px',
      }}
    >
      <BasicAppBar
        title={artist.attributes.nickname}
        rightComponent={
          <Stack direction="row" sx={{ position: 'absolute', right: 12 }}>
            <IconButton
              onClick={() => {
                share({
                  url: `${window.location.origin}/artist/${artistId}`,
                });
              }}
            >
              <ShareIcon style={{ stroke: '#fff' }} />
            </IconButton>
            <IconButton onClick={() => {}}>
              <MessageIcon style={{ stroke: '#fff' }} />
            </IconButton>
          </Stack>
        }
        sx={{ backgroundColor: 'transparent', color: 'white' }}
      />
      <ClickAwayListener
        onClickAway={() => {
          handleProfileNotiClose();
        }}
      >
        <Box
          sx={{
            zIndex: profileNotiOpen ? 10001 : 0,
            height: '160px',
            position: 'relative',
            width: '100%',
          }}
          onClick={handleProfileNotiClose}
        >
          <Avatar
            sx={{
              width: '95px',
              height: '95px',
              position: 'absolute',
              left: '20px',
              bottom: '-32px',
              boxShadow: 'rgb(0 0 0 / 24%) 0px 3px 8px',
            }}
            src={artist.attributes.avatar.data?.attributes.url}
          />
          <LightTooltip
            open={profileNotiOpen}
            onClose={handleProfileNotiClose}
            onOpen={handleProfileNotiOpen}
            title={tooltipStr}
          >
            <IconButton
              sx={{
                position: 'absolute',
                left: '90px',
                bottom: '-32px',
                background: 'white',
                width: '28px',
                height: '28px',
                boxShadow: 'rgb(0 0 0 / 24%) 0px 3px 8px',
                ':active, :hover': {
                  background: 'white',
                },
              }}
              onClick={() => {
                if (isMe) {
                  alert('본인은 좋아요를 할 수 없습니다.');
                } else if (artistId) follow(artistId);
              }}
            >
              <LikeIcon isLiked={isFollowed} style={{ width: '14px' }} />
            </IconButton>
          </LightTooltip>
        </Box>
      </ClickAwayListener>
      <Box
        sx={{
          backgroundColor: '#F7F7F7',
          flex: 1,
          width: '100%',
          height: '100%',
          borderTop: '1px solid rgb(236, 236, 236)',
          paddingTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // justifyContent: 'center',
        }}
      >
        <Tabs
          centered
          value={tab}
          sx={{
            width: '80%',
            paddingBottom: '24px',

            '& .MuiTabs-indicator': {
              // display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              display: 'none',
            },
            '& .MuiTabs-indicatorSpan': {
              maxWidth: 72,
              width: '100%',
              backgroundColor: 'rgb(65, 65, 65)',
            },
            '& .Mui-selected': {
              fontWeight: 'bold',
              color: '#000',
            },
          }}
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
          onChange={(_, newV) => {
            router.replace(handleUrl().set('tab', newV).path());
          }}
        >
          <Tab
            disableRipple
            sx={{ width: '33.3333%' }}
            label="작가노트"
            value="0"
          />
          <Tab
            disableRipple
            sx={{ width: '33.3333%' }}
            label="판매작품"
            value="1"
          />
          <Tab
            disableRipple
            sx={{ width: '33.3333%' }}
            label="작가정보"
            value="2"
          />
        </Tabs>
        {tab === '0' ? (
          <PostTimeLine
            items={items}
            hasNextPage={result.hasNextPage}
            fetchNextPage={result.fetchNextPage}
            loading={result.isLoading}
            refetch={result.refetch}
            detailMode={true}
          />
        ) : tab === '1' ? (
          <Stack
            sx={{
              width: '100%',
              // px: 4,
            }}
          >
            <Title
              label="3줄 큐레이팅"
              onClick={() => {
                router.push(`/artist/${router.query.id}/curatings`);
              }}
            />
            {/* <NoSsr>
              <SwipeableView
                containerStyle={{
                  width: '85%',
                }}
                style={{ paddingLeft: '30px' }}
              >
                <CuratingCard />
                <CuratingCard />
                <CuratingCard />
                <CuratingCard />
              </SwipeableView>
            </NoSsr> */}
            <Stack sx={{ pt: '54px' }}>
              <Title label="판매작품" />
              <Box
                sx={{ px: '12px', display: 'flex', justifyContent: 'center' }}
              >
                <GalleryList
                  items={initalArtWorks}
                  hasCategoryTab={false}
                  isLikeable={false}
                  showMeta
                />
              </Box>
            </Stack>
          </Stack>
        ) : tab === '2' ? (
          <Stack
            sx={{
              width: '100%',
              // px: 4,
            }}
          >
            <Title
              label="소개"
              onClick={() => {
                setOpenIntro((p) => !p);
              }}
              Icon={openIntro ? KeyboardArrowUpIcon : KeyboardArrowDownIcon}
            />
            <Typography
              sx={{
                pb: 2,
                fontSize: 12,
                px: 4,
              }}
            >
              {artist.attributes.oneLiner}
            </Typography>
            <Stack
              direction="row"
              sx={{
                px: 4,
                maxWidth: '100%',
                overflow: 'auto',
              }}
              spacing={2}
            >
              {artist.attributes.styles?.split(',').map((label) => (
                <Chip
                  key={label}
                  sx={{
                    padding: '6px 22px',
                    '& .MuiChip-label': {
                      paddingLeft: 0,
                      paddingRight: 0,
                      color: 'rgb(121, 121, 121)',
                    },
                  }}
                  label={label}
                />
              ))}
            </Stack>
            <Collapse in={openIntro}>
              <Stack
                sx={{
                  pt: 3,
                }}
              >
                <Title label="이력" />
                <Typography
                  sx={{
                    pb: 2,
                    fontSize: 12,
                    whiteSpace: 'pre',
                    px: 4,
                  }}
                >
                  {artist.attributes.schools?.split(',').join('\n\n')}
                </Typography>
                <br />
                <Typography
                  sx={{
                    pb: 2,
                    fontSize: 12,
                    whiteSpace: 'pre',
                    px: 4,
                  }}
                >
                  {artist.attributes.histories?.split(',').join('\n\n')}
                </Typography>
              </Stack>
            </Collapse>
            <Divider sx={{ my: 3 }} />
            <Title
              label="규정"
              onClick={() => {
                setOpenRule((p) => !p);
              }}
              Icon={openRule ? KeyboardArrowUpIcon : KeyboardArrowDownIcon}
            />
            <Typography
              sx={{
                pb: 2,
                px: 4,
                fontSize: 12,
              }}
            >
              {artist.attributes.rule}
              {/* {`저의 작업물은 수작업으로 페인팅작업을 하다보니 붓결이 일정하지 않을 수 있습니다. 화면과 다르다는 이유로 환불이 되지 않으니 이점 유의 하여 구매해주시면 감사하겠습니다.🤟`} */}
            </Typography>
            <Collapse in={openRule}>
              <Stack>
                <Divider sx={{ my: 3 }} />

                <Title label="배송관련" />
                <Typography
                  sx={{
                    pb: 2,
                    fontSize: 12,
                    whiteSpace: 'pre',
                    px: 4,
                  }}
                >
                  {artist.attributes.deliveryRule}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Title label="교환 / 환불" />
                <Typography
                  sx={{
                    pb: 6,
                    fontSize: 12,
                    whiteSpace: 'pre',
                    px: 4,
                  }}
                >
                  {artist.attributes.refundRule}
                </Typography>
              </Stack>
            </Collapse>
          </Stack>
        ) : null}
      </Box>
      <Backdrop open={profileNotiOpen} sx={{ zIndex: 1000 }} />
      <Alert
        open={confirmDialog.isOpen}
        onClose={() => {
          confirmDialog.onClose();
        }}
        title={confirmDialog.data?.title}
        subTitle={confirmDialog.data?.body}
        buttons={[
          {
            label: confirmDialog.data?.buttons.cancel,
            onClick: () => {
              confirmDialog.onClose();
            },
          },
          confirmDialog.data?.buttons.confirm
            ? {
                label: confirmDialog.data?.buttons.confirm,
                isDanger: true,
                onClick: () => {
                  confirmDialog.onConfirm(true);
                },
              }
            : null,
        ]}
      />
    </ScreenBox>
  );
};

export async function getServerSideProps(context) {
  try {
    const artistId = context.params.id;
    const { data: artist } = await apis.artist.get(Number(artistId), {
      query: {
        populate: ['user', 'products', 'artist_notes', 'background', 'avatar'],
        filters: {
          user: {
            id: {
              $notNull: true,
            },
          },
        },
      },
    });
    return {
      // Passed to the page component as props
      props: { artist },
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

export default ArtistProfile;
