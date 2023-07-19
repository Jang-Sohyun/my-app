import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Avatar, Box, Stack } from '@mui/material';
import { formatCount } from 'libs/utils';
import { LikeIcon } from 'components/svgIcons';
import * as StaticUrls from 'constants/staticUrls';
import VerifiedIcon from '@mui/icons-material/Verified';
import { apis } from 'apis';
import dayjs from 'dayjs';
import SwipeableViews from 'react-swipeable-views';
import Link from 'next/link';
import share from 'libs/share';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  open,
  onClose,
  item,
  onClickComment,
  initialIndex,
}: any) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (open && typeof initialIndex !== 'undefined') {
      setIdx(initialIndex);
    }
  }, [open]);
  const { count: commentCount } = apis.artistNoteComment.useComments({
    noteId: item.id,
    onlyCount: true,
  });
  const { isLiked, count: likeCount, like } = apis.likingNote.useLike(item.id);
  if (!item) return null;

  const artist = item?.attributes.artist.data;
  const writer = item?.attributes.user.data;
  const author = {
    name: artist ? artist.attributes.nickname : writer.attributes.nickname,
    profile: artist
      ? artist.attributes.avatar.data?.attributes.url
      : writer.attributes.avatar.data?.attributes.url,
  };
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: (theme) => theme.palette.grey[500],
        },
      }}
    >
      <AppBar
        elevation={0}
        sx={{ position: 'fixed', background: 'transparent' }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SwipeableViews
        enableMouseEvents
        index={idx}
        onChangeIndex={(i) => setIdx(i)}
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '100px',
        }}
        containerStyle={{
          alignItems: 'center',
        }}
      >
        {item.attributes.images.data.map((item) => (
          <Box key={item.id}>
            <img src={item.attributes.url} style={{ width: '100%' }} />
          </Box>
        ))}
      </SwipeableViews>
      {item && (
        <Stack
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'rgba(256, 256, 256, 0.9)',
            padding: '16px',
          }}
          spacing={1}
          direction="row"
        >
          <Link
            href={artist ? `/artist/${artist.id}` : `/profile/${writer.id}`}
          >
            <Avatar
              sx={{ width: '56px', height: '56px', opacity: 1 }}
              src={author.profile}
            />
          </Link>
          <Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>{author.name}</Typography>
              <Typography>
                {dayjs(item.attributes.createdAt).fromNow()}
              </Typography>
              {artist && (
                <VerifiedIcon
                  sx={{
                    width: '16px',
                    height: '16px',
                    color: 'rgb(76, 62, 255)',
                  }}
                />
              )}
            </Stack>
            <Typography>{item.title}</Typography>
            <Stack direction="row" spacing={3}>
              <IconButton
                aria-label="댓글"
                disableRipple
                onClick={() => {
                  onClickComment(item);
                }}
              >
                <img src={StaticUrls.Icons.Message} style={{ width: '24px' }} />
                <Typography sx={styles.commentCount}>
                  {formatCount(commentCount)}
                </Typography>
              </IconButton>
              <IconButton aria-label="좋아요" disableRipple onClick={like}>
                <LikeIcon
                  isLiked={isLiked}
                  sx={{ width: '20px', stroke: '#fff' }}
                />
                <Typography sx={styles.likeCount}>
                  {formatCount(likeCount)}
                </Typography>
              </IconButton>
              <IconButton
                aria-label="공유"
                sx={styles.btnShare}
                disableRipple
                onClick={() => {
                  share({ url: window.location.href });
                }}
              >
                <img src={StaticUrls.Icons.Share} style={{ width: '24px' }} />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Dialog>
  );
}

const styles = {
  timeline: {
    textAlign: 'left',
    marginBottom: '50px',
  },
  createAt: {
    fontSize: '13px',
    textAlign: 'center',
    color: '#fff',
  },
  card: {
    // maxWidth: 345,
    borderRadius: '8px',
    boxShadow: 'rgb(0 0 0 / 12%) 0px 3px 8px',
    marginLeft: '50px',
    mt: 1,
    // marginTop: '10px',
  },
  cardWithNoAvatar: {
    // maxWidth: 345,
    borderRadius: '8px',
    boxShadow: 'rgb(0 0 0 / 24%) 0px 3px 8px',
    marginTop: '10px',
  },
  noteTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginTop: '15px',
    marginBottom: '15px',
  },
  noteDescription: {
    color: '#fff',
    fontSize: 14,
  },
  noteThumnail: {
    borderRadius: '10px',
    marginTop: '12px',
  },
  moreDescription: {
    fontWeight: 700,
  },
  commentCount: {
    paddingLeft: '6px',
    fontSize: '13px',
  },
  likeCount: {
    paddingLeft: '6px',
    fontSize: '13px',
  },
  btnShare: {},
};
