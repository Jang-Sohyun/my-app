import { Typography } from '@mui/material';
import { Stack, Button, IconButton, Box } from '@mui/material';
import BottomSheet from '../components/BottomSheet';
import { useState } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import comma from '../libs/comma';
import { AddOutlined, RemoveOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useDdleContext } from '../contexts/Ddle';
import { useSnackbar } from 'notistack';
import { useContext as useConfirm } from '../contexts/confirm';
import { apis } from '../apis';

const OptionSelect = ({
  open,
  onOpen,
  onClose,
  options,
  product,
  onAddCart,
  onBuyNow,
  stock,
}) => {
  const router = useRouter();
  const [, confirm] = useConfirm();
  const { addToCart, user } = useDdleContext();
  const hasOptions = options?.length > 0;
  const { enqueueSnackbar } = useSnackbar();

  // 옵션일 때
  const [selectedOptions, setSelectedOptions] = useState<
    {
      id: any;
      name: string;
      price: number;
      quantity: number;
    }[]
  >([]);

  // 옵션 없을 때
  const [quantityWhenNoOptions, setQuantityWhenNoOptions] = useState(1);

  let overallPrice = 0;

  if (hasOptions) {
    selectedOptions.forEach((o) => {
      overallPrice += o.price * o.quantity;
    });
  } else {
    overallPrice = product.attributes.price * quantityWhenNoOptions;
  }

  return (
    <BottomSheet open={open} onOpen={onOpen} onClose={onClose}>
      <Stack sx={{ paddingBottom: 4, pt: '30px', px: '20px' }} spacing={1.5}>
        {hasOptions ? (
          <>
            <TextField
              select
              label="옵션 선택"
              sx={{
                '&.MuiInputBase-root.MuiOutlinedInput-root': {
                  borderRadius: 12,
                },
              }}
              value=""
              onChange={(e) => {
                const option = options.find(
                  (option) => option.id === e.target.value
                );

                if (option) {
                  setSelectedOptions([
                    ...selectedOptions,
                    {
                      id: option.id,
                      name: option.name,
                      price: option.price,
                      quantity: 1,
                    },
                  ]);
                }
              }}
            >
              <MenuItem value={''}>옵션 선택</MenuItem>
              {options.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                  disabled={!!selectedOptions.find((o) => o.id === option.id)}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            {selectedOptions.map((selectedOption) => (
              <OptionSelected
                key={selectedOption.id}
                data={selectedOption}
                onClickRemove={() => {
                  setSelectedOptions(
                    selectedOptions.filter((o) => o.id !== selectedOption.id)
                  );
                }}
                onClickQuantityChange={(value) => {
                  setSelectedOptions(
                    selectedOptions.map((o) => {
                      const next = o.quantity + value;
                      if (
                        o.id === selectedOption.id &&
                        product.attributes.stock >= next
                      ) {
                        return {
                          ...o,
                          quantity: next,
                        };
                      }
                      return o;
                    })
                  );
                }}
              />
            ))}
          </>
        ) : (
          <>
            <OptionSelected
              data={{
                id: product.id,
                name: product.attributes.name,
                price: product.attributes.price,
                quantity: quantityWhenNoOptions,
              }}
              onClickQuantityChange={(value) => {
                setQuantityWhenNoOptions(quantityWhenNoOptions + value);
              }}
              max={stock}
            />
          </>
        )}

        <Stack sx={{ pt: '20px', pb: '20px' }} spacing={2}>
          <Stack direction="row" alignItems="center">
            <Typography
              sx={{
                fontSize: 12,
                color: (theme) => theme.palette.grey[500],
                flex: 1,
              }}
            >
              총액
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {comma(overallPrice)}원
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography
              sx={{
                fontSize: 12,
                color: (theme) => theme.palette.grey[500],
                flex: 1,
              }}
            >
              배송비
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              무료배송
            </Typography>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          sx={{ width: '100%' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Button
            variant="outlined"
            fullWidth
            sx={{
              border: '1px solid rgb(14, 12, 39)',
              color: 'rgb(14, 12, 39)',
            }}
            onClick={async () => {
              try {
                await addToCart({
                  productId: product.id,
                  amount: quantityWhenNoOptions,
                });
                enqueueSnackbar('장바구니에 상품이 담겼습니다.');
              } catch (e) {
                console.error(e);
              }
            }}
          >
            장바구니
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{
              py: '10px',
              background: 'rgb(14, 12, 39)',
              '&:hover': {
                background: 'rgb(14, 12, 39)',
              },
              '&:active': {
                background: 'rgb(14, 12, 39)',
              },
            }}
            onClick={async () => {
              confirm
                .open({
                  title: '구매하시겠습니까?',
                  buttons: [
                    { label: '취소' },
                    { label: '구매', isDanger: true },
                  ],
                })
                .then(async (confirm) => {
                  if (confirm === '구매') {
                    if (user) {
                      try {
                        const { data: order } = await apis.order.create({
                          user: user.id,
                        });
                        const item = {
                          product: product.id,
                          amount: quantityWhenNoOptions,
                          order: order.id,
                        };
                        await apis.orderItems.create(item);
                        router.push(`/order/${order.id}`);
                      } catch (e) {
                        alert(e.message);
                      }
                    } else {
                      router.push('/login');
                    }
                  }
                });
            }}
          >
            구매하기
          </Button>
        </Stack>
      </Stack>
    </BottomSheet>
  );
};
const OptionSelected = ({
  data,
  onClickQuantityChange,
  onClickRemove,
  max,
}: any) => (
  <Stack
    key={data.id}
    sx={{
      py: '15px',
      px: '20px',
      background: (theme) => theme.palette.grey[200],
      borderRadius: 2,
    }}
  >
    <Stack direction="row" alignItems="center">
      <Typography sx={{ flex: 1, fontWeight: 'bold' }}>{data.name}</Typography>
      {onClickRemove ? (
        <IconButton size="small" sx={{ mr: '-8px' }}>
          <CloseOutlined onClick={onClickRemove} />
        </IconButton>
      ) : null}
    </Stack>
    <Stack direction="row" alignItems="center" sx={{ ml: '-8px' }}>
      <Stack direction="row" sx={{ flex: 1 }} alignItems="center">
        <IconButton
          onClick={() => {
            onClickQuantityChange(-1);
          }}
          disabled={data.quantity === 1}
        >
          <RemoveOutlined />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            width: '36px',
            height: '36px',
            borderRadius: '36px',
            border: (theme) => `1px solid ${theme.palette.grey[300]}`,
          }}
        >
          <Typography sx={{ fontSize: 18 }}>{data.quantity}</Typography>
        </Box>
        <IconButton
          onClick={() => {
            onClickQuantityChange(1);
          }}
          disabled={data.quantity >= max}
        >
          <AddOutlined />
        </IconButton>
      </Stack>
      <Typography sx={{}}>{comma(data.price * data.quantity)}원</Typography>
    </Stack>
  </Stack>
);

export default OptionSelect;
