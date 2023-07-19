import { Chip } from '@mui/material';

const SelectableChip = ({ label, selected, onSelect }: any) => (
  <Chip
    label={label}
    sx={{
      mr: 1,
      mb: 1,
      padding: '6px 22px',
      background: selected ? '#000' : 'rgb(230,230,230)',
      '& .MuiChip-label': {
        paddingLeft: 0,
        paddingRight: 0,
        color: selected ? '#fff' : 'rgb(121, 121, 121)',
      },
      ':active, :hover': {
        background: selected ? '#000' : 'rgb(230,230,230)',
      },
    }}
    role="button"
    onClick={onSelect}
  />
);

export default SelectableChip;
