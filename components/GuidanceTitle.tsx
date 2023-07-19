import Text from '@mui/material/Typography';
import { Stack } from '@mui/material';

type Props = {
  children?: React.ReactNode | null;
};

const GuidanceTitle = ({ children }: Props) => (
  <Stack direction="row" my={8} spacing={2}>
    <Text sx={styles.guidanceTitle}>{children}</Text>
  </Stack>
);

const styles = {
  guidanceTitle: {
    fontSize: '26px',
    fontWeight: 800,
    lineHeight: 1.2,
  },
};

export default GuidanceTitle;
