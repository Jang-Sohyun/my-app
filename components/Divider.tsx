import { Divider as MuiDivider, SxProps } from '@mui/material';
import theme from 'constants/theme';

type Props = {
  sx?: SxProps;
  size?: number;
};
const Divider = ({ sx, size = 12 }: Props) => {
  return <MuiDivider sx={{ ...styles.root, borderBottomWidth: size, ...sx }} />;
};
const styles = {
  root: {
    borderColor: theme.palette.grey['200'],
  },
};
export default Divider;
