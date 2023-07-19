import Link from 'next/link';
import { Fab, ButtonBase } from '@mui/material';
import * as StaticUrls from 'constants/staticUrls';

type Props = {
  href: string;
};
export default (props: Props) => (
  <Link href={props.href}>
    <ButtonBase
      disableRipple
      sx={{
        boxShadow: 'none !important',
        position: 'fixed',
        bottom: 72,
        left: 16,
        background: 'transparent',
        boxShadow: 'none',
        width: '64px',
      }}
    >
      <img src={StaticUrls.Icons.Write} style={{ width: '100%' }} />
    </ButtonBase>
  </Link>
);
