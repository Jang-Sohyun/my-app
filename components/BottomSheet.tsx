import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

export default function SwipeableTemporaryDrawer({
  open,
  onOpen,
  onClose,
  children,
  sx,
}: {
  open: boolean;
  onOpen?: () => void;
  onClose: () => void;
  children: any;
}) {
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      if (open) {
        onOpen?.();
      } else {
        onClose();
      }
    };

  return (
    <SwipeableDrawer
      disableSwipeToOpen
      anchor={'bottom'}
      sx={{
        '& .MuiPaper-root': {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden',
          maxHeight: '80%',
        },
        ...sx,
      }}
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <Puller />

      <Box
        sx={{ paddingTop: 1, width: 'auto' }}
        // role="presentation"
        // onClick={toggleDrawer(false)}
        // onKeyDown={toggleDrawer(false)}
      >
        {children}
      </Box>
    </SwipeableDrawer>
  );
}
