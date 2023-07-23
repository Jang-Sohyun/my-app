import ScreenBox from '../components/ScreenBox';
import BasicAppBar from '../components/common/BasicAppBar';
import { Box, Stack, Typography, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { KeyboardArrowRight } from '@mui/icons-material';
import { useRouter } from 'next/router';
import comma from '../libs/comma';

type Props = {
  image: string;
  name: string;
  artist?: string;
  optionLabel?: string;
  price?: number;
  quantity?: number;
};

const OrderItem = (props: Props) => {
  return (
    <Stack>
      <Stack direction="row" sx={{ width: '100%' }}>
        <img
          src={props.image}
          style={{
            width: '64px',
            borderRadius: '8px',
          }}
          alt={props.image}
        />
        <Stack sx={{ pl: '12px', pt: '6px' }}>
          <Typography
            sx={{
              fontSize: '13px',
            }}
          >
            {props.name}
          </Typography>
          <Typography sx={{ fontSize: '12px' }}>{props.artist}</Typography>
          <Typography
            sx={{ fontSize: '11px', color: (theme) => theme.palette.grey[400] }}
          >
            {props.optionLabel}
          </Typography>
          {props.price && props.quantity ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                {comma(props.price)}원
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: (theme) => theme.palette.grey[400],
                }}
              >
                {props.quantity}개
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
};

const OrderItemBackup = (props: Props) => {
  return (
    <Stack direction="row" sx={{ width: '100%' }}>
      <img
        src={props.image}
        style={{
          width: '64px',
          borderRadius: '8px',
        }}
        alt={props.image}
      />
      <Stack sx={{ pl: '12px', pt: '6px' }}>
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          {props.name}
        </Typography>
        <Typography sx={{ fontSize: '12px' }}>{props.artist}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
          {comma(props.price)}원
        </Typography>
        <Typography
          sx={{
            fontSize: '12px',
            color: (theme) => theme.palette.grey[400],
          }}
        >
          {props.quantity}개
        </Typography>
      </Stack>
    </Stack>
  );
};
export default OrderItem;
