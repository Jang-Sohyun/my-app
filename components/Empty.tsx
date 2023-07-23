import Stack from '@mui/material/Stack';
import Text from '@mui/material/Typography';
import { Colors } from '../constants/theme';
import { BottomBarHeight } from '../constants/styles';

type Props = {
  text?: string | null;
  children?: React.ReactNode | null;
};
const Empty = ({ text, children }: Props) => (
  <Stack sx={styles.stack}>
    <Text sx={styles.text}>{text}</Text>
    {children}
  </Stack>
);

const styles = {
  stack: {
    textAlign: 'center',
    flex: 1,
    top: 0,
    height: `100vh`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: `${BottomBarHeight}px`,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  text: {
    color: Colors.grey['500'],
  },
};

export default Empty;
