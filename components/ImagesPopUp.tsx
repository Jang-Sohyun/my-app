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
import { formatCount } from '../libs/utils';
import { LikeIcon } from '../components/svgIcons';
import * as StaticUrls from '../constants/staticUrls';
import VerifiedIcon from '@mui/icons-material/Verified';
import { apis } from '../apis';
import dayjs from 'dayjs';
import SwipeableViews from 'react-swipeable-views';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ open, onClose, items }) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (open) {
      setIdx(0);
    }
  }, [open]);

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
        {items.map((item) => (
          <Box key={item}>
            <img src={item} style={{ width: '100%' }} />
          </Box>
        ))}
      </SwipeableViews>
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
