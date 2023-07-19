import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { SearchIcon } from 'components/svgIcons';
import { useState, forwardRef } from 'react';
import { handleUrl } from 'libs/url';

type Props = {
  title?: string;
  onClickGoBack?: () => void | null;
};

// FIXME : 추후 공용 컴포넌트 확장을 고려하여,
// left component, center title, right component은 props로 전달받도록 수정할 예정
const BasicAppBar = forwardRef(({ title = '' }: Props, inputRef) => {
  const router = useRouter();
  const [inputV, setInputV] = useState('');
  return (
    <AppBar position="static" color="default" sx={styles.header}>
      <Toolbar>
        {/* Left Component */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={router.back}
          sx={{ mr: 2, position: 'absolute' }}
        >
          <ArrowBackIcon />
        </IconButton>
        {/* Left Component End*/}
        {/* Title */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            borderBottomWidth: 0,
            width: '100%',
          }}
        >
          <Paper
            component="form"
            sx={{
              p: '0px 4px',
              background: 'rgb(239, 240, 241)',
              borderRadius: 12,
              display: 'flex',
              width: '90%',
            }}
            elevation={0}
            onSubmit={(e) => {
              e.preventDefault();
              router.replace(handleUrl().set('q', inputV).path());
            }}
          >
            <InputBase
              inputRef={inputRef}
              sx={{ ml: 1, flex: 1 }}
              placeholder="작품 제목과 작가를 검색해보세요."
              value={inputV}
              onChange={(e) => {
                setInputV(e.target.value);
              }}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

const styles = {
  header: {
    backgroundColor: '#fff',
    boxShadow: 'none',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    flexGrow: 1,
    textAlign: 'center',
  },
};
export default BasicAppBar;
