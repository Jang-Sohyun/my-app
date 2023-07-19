import { Box, Button } from '@mui/material';

type Props = {
  disabled?: boolean;
  label?: string;
  onClick?: (step: string) => void;
};

const NextButton = ({ disabled, label, onClick }: Props) => (
  <Box my={10}>
    <Button
      sx={styles.nextButton}
      fullWidth
      variant="contained"
      disableElevation
      disabled={disabled}
      onClick={(e) => {
        onClick(e);
      }}
    >
      {label}
    </Button>
  </Box>
);

const styles = {
  nextButton: {
    fontSize: '19px',
    borderRadius: '35px',
    height: '50px',
    backgroundColor: '#0e0c27',
  },
};

export default NextButton;
