import { Stack, Box, Typography } from '@mui/material';
import SelectableChip from 'components/SelectableChip';

const SelectableList = ({
  label,
  subLabel,
  selectableItems,
  selectedItems,
  onSelect,
}: any) => (
  <Stack spacing={2}>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography sx={{ fontWeight: 'bold', fontSize: 12 }}>{label}</Typography>
      <Typography
        sx={{ fontSize: 12, color: (theme) => theme.palette.grey[600] }}
      >
        {subLabel}
      </Typography>
    </Stack>
    <Box>
      {selectableItems.map((text) => {
        const selected = selectedItems.includes(text);
        return (
          <SelectableChip
            key={text}
            label={text}
            selected={selected}
            onSelect={() => {
              onSelect(text);
            }}
          />
        );
      })}
    </Box>
  </Stack>
);

export default SelectableList;
