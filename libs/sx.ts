import { SxProps as MuiSxProps, Theme } from '@mui/material/styles';

export type SxProps = MuiSxProps<Theme>;

export const toArray = (sx?: SxProps | null) => {
  if (sx) {
    return Array.isArray(sx) ? sx : [sx];
  }
  return [];
};
