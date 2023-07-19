import { Stack, Button, FormControlLabel, Checkbox } from '@mui/material';

type Props = {
  checked: boolean;
  label: string;
  onCheckBoxChange?: (e: any) => void | null;
  onButtonClick?: (e: any) => void | null;
};

const CheckBoxWithLabel = ({
  checked,
  label,
  onCheckBoxChange,
  onButtonClick,
}: Props) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="stretch"
    spacing={0}
  >
    <FormControlLabel
      checked={checked}
      control={<Checkbox />}
      label={label}
      onChange={(e: any) => {
        onCheckBoxChange?.(e);
      }}
    />

    {onButtonClick && (
      <Button sx={styles.agreementViewBtn} onClick={(e) => onButtonClick?.(e)}>
        보기
      </Button>
    )}
  </Stack>
);

const styles = {
  agreementViewBtn: {
    color: '#bbb',
  },
};

export default CheckBoxWithLabel;
