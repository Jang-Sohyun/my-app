import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';

type Props = {
  title?: string;
  onClickGoBack?: () => void | null;
  onTitleClick?: () => void;
};

// FIXME : 추후 공용 컴포넌트 확장을 고려하여,
// left component, center title, right component은 props로 전달받도록 수정할 예정
const BasicAppBar = ({
  onClickGoBack,
  sx,
  title = '',
  rightComponent,
  onTitleClick,
}: Props) => {
  const router = useRouter();
  return (
    <AppBar position="static" color="default" sx={[styles.header, sx]}>
      <Toolbar>
        {/* Left Component */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onClickGoBack || router.back}
          sx={{ mr: 2, position: 'absolute' }}
        >
          <ArrowBackIcon />
        </IconButton>
        {/* Left Component End*/}
        {/* Title */}
        <Typography
          variant="h6"
          component="div"
          sx={styles.title}
          role="button"
          onClick={onTitleClick}
        >
          {title}
        </Typography>
        {/* Title End*/}

        {/* Right Component */}

        {rightComponent}
        {/* Right Component End*/}
      </Toolbar>
    </AppBar>
  );
};

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
