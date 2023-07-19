import {
  Stack,
  Typography,
  OutlinedInput,
  OutlinedInputProps,
  SxProps,
  NativeSelect,
} from '@mui/material';

interface Props extends OutlinedInputProps {
  label: string;
  containerSx?: SxProps;
  select?: boolean;
  selectOptions?: string[];
}
const TextInput = ({
  label,
  sx,
  helperText,
  containerSx,
  endAdorment,
  select,
  selectOptions,
  ...props
}: Props) => (
  <Stack sx={[props.containerSx, containerSx]}>
    <Typography component="legend" sx={styles.topLabelText}>
      {label}
    </Typography>
    {select ? (
      <NativeSelect
        id="demo-customized-select-native"
        value={props.value}
        onChange={props.onChange}
        input={
          <OutlinedInput
            endAdornment={endAdorment}
            sx={{ ...styles.userInfoInput, ...sx }}
            {...props}
          />
        }
      >
        <option aria-label="None" value="" />
        {selectOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </NativeSelect>
    ) : (
      <OutlinedInput
        endAdornment={endAdorment}
        sx={{ ...styles.userInfoInput, ...sx }}
        {...props}
      />
    )}

    {helperText && (
      <Typography sx={{ fontSize: 10, pl: '12px', pt: '4px' }}>
        {helperText}
      </Typography>
    )}
  </Stack>
);
const styles = {
  topLabelText: {
    marginLeft: '12px',
    marginBottom: '4px',
    fontSize: 13,
    color: (theme) => theme.palette.grey[700],
  },
  userInfoInput: {
    // height: '52px',
    borderRadius: '13px',
  },
};

export default TextInput;
