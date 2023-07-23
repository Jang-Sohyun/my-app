import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SxProps } from '../libs/sx';

const Loader = ({
  height,
  text,
  color,
  sx,
}: {
  height?: number | string;
  text?: string;
  color?: string;
  sx?: SxProps;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height,
        ...sx,
      }}
    >
      <CircularProgress style={color ? { color } : {}} />
      {text ? (
        <Typography sx={color ? { color, mt: 2 } : { mt: 2 }}>
          {text}
        </Typography>
      ) : null}
    </Box>
  );
};

export default Loader;
