import ScreenBox from '../../components/ScreenBox';
import BasicAppBar from '../../components/common/BasicAppBar';
import {
  Typography,
  Stack,
  Box,
  Button,
  Chip,
  Divider,
  NoSsr,
} from '@mui/material';
import SwipeableView from 'react-swipeable-views';
import { Fab } from '@mui/material';
import Add from '@mui/icons-material/Add';
import CollectingCardAdder from '../../components/CollectingCardAdder';
import { useMemo, useState } from 'react';
import SiseCheck from '../../components/SiseCheck';
import { apis } from '../../apis';
import { useDdleContext } from '../../contexts/Ddle';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

type Props = {
  onClickGoBack: () => void;
};
const Collecting = ({ onClickGoBack }: Props) => {
  const [cardAdderOpen, setCardAdderOpen] = useState(false);
  const [siseCheckOpen, setSiseCheckOpen] = useState(false);
  const { user } = useDdleContext();
  const { enqueueSnackbar } = useSnackbar();
  const { data: collections, refetch } = apis.collection.useGetList(
    {
      query: {
        sort: 'createdAt:DESC',
        filters: {
          user: {
            id: {
              $eq: user?.id,
            },
          },
        },
        populate: [
          'order_item',
          'order_item.product',
          'order_item.product.artist',
          'order_item.product.thumbnails',
        ],
      },
    },
    {
      enabled: Boolean(user),
    }
  );

  const totalAmount = collections?.meta?.pagination.total || 0;
  const total = useMemo(() => {
    if (totalAmount >= 10) {
      return String(totalAmount);
    } else {
      return `0${totalAmount}`;
    }
  }, [totalAmount]);

  const [loading, setLoading] = useState(false);
  return (
    <ScreenBox>
      <BasicAppBar title="컬렉팅" />
      <Stack sx={{ width: '100%' }}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: '20px', pl: 3 }}
        >
          <Typography sx={{ fontSize: 18 }}>현재</Typography>
          <Typography sx={{ fontSize: 50, mx: 3, fontWieght: '900' }}>
            {total}
          </Typography>
          <Typography sx={{ fontSize: 18 }}>소장 중</Typography>
        </Stack>
        <Divider />
        {totalAmount > 0 ? (
          <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
            <NoSsr>
              <Typography sx={{ ml: 2, mt: 3, fontSize: 15 }}>
                컬렉팅 카드
                <Chip
                  label="Beta"
                  size="small"
                  sx={{
                    ml: 1,
                    background: '#000',
                    color: '#fff',
                  }}
                />
              </Typography>
            </NoSsr>
          </Stack>
        ) : null}
        <Box sx={{ pt: '40px' }}>
          {totalAmount > 0 ? (
            <SwipeableView
              className="scale"
              containerStyle={{
                width: '100%',
              }}
            >
              {collections.data.map((item, i) => {
                const orderItem = item.attributes.order_item.data;
                const product = orderItem.attributes.product.data;
                const artist = product.attributes.artist.data;
                const thumbnails = product.attributes.thumbnails.data;
                const length = collections.data.length;
                let no = length - i;
                if (no < 10) no = `0${no}`;
                else no = `${no}`;

                return (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '90%',
                      margin: 'auto',
                    }}
                  >
                    <CollectingCard
                      name={product.attributes.name}
                      artist={artist.attributes.nickname}
                      no={no}
                      thumbnail={thumbnails[0].attributes.url}
                      createdAt={item.attributes.createdAt}
                      onClickSiseCheck={() => {
                        setSiseCheckOpen(true);
                      }}
                    />
                  </Box>
                );
              })}
            </SwipeableView>
          ) : (
            <Stack sx={{ width: '100%', py: 12 }} alignItems="center">
              <Typography sx={{ color: (theme) => theme.palette.grey[400] }}>
                컬렉션을 추가하려면 아래의 + 버튼을 눌러주세요.
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>
      {/* <Typography>
          우림님은 비기너 컬렉터 3개를 더 소장하면 ‘홀릭 컬렉터’로 올라갑니다.
        </Typography> */}
      <Fab
        sx={{
          position: 'fixed',
          left: 36,
          bottom: 80,
          background: (theme) => theme.palette.grey[800],
          ':hover, :active': {
            background: (theme) => theme.palette.grey[800],
          },
        }}
        onClick={() => {
          setCardAdderOpen(true);
        }}
      >
        <Add sx={{ fontSize: '30px', color: 'white' }} />
      </Fab>
      <CollectingCardAdder
        open={cardAdderOpen}
        onOpen={() => {
          setCardAdderOpen(true);
        }}
        onClose={() => {
          setCardAdderOpen(false);
        }}
        onSubmit={async (code) => {
          if (loading) return;
          setLoading(true);
          try {
            const { data: orderItems } = await apis.orderItems.getList({
              query: {
                filters: {
                  code: {
                    $eq: code,
                  },
                },
              },
            });
            if (orderItems.length > 0) {
              const item = orderItems[0];
              const { data: collections } = await apis.collection.getList({
                query: {
                  filters: {
                    order_item: item.id,
                  },
                },
              });
              if (collections.length > 0) {
                enqueueSnackbar('이미 추가된 컬렉션입니다.');
              } else {
                await apis.collection.create({
                  user: user.id,
                  order_item: item.id,
                });
                refetch();
                enqueueSnackbar('컬렉션이 추가되었습니다.');
                setCardAdderOpen(false);
              }
            } else {
              alert('잘못된 코드입니다.');
            }
          } catch (e) {
            alert(e.message);
          } finally {
            setLoading(false);
          }
        }}
      />
      <SiseCheck
        open={siseCheckOpen}
        onClose={() => {
          setSiseCheckOpen(false);
        }}
      />
    </ScreenBox>
  );
};

const CollectingCard = ({
  onClickSiseCheck,
  name,
  artist,
  no,
  thumbnail,
  createdAt,
}: any) => {
  return (
    <Stack
      sx={{
        borderRadius: '20px',
        border: '1px solid #000',
        width: '100%',
        overflow: 'hidden',
      }}
      alignItems="center"
    >
      <Box
        component="img"
        src={thumbnail}
        sx={{
          width: '100%',
          // borderRadius: '20px',
          // overflow: 'hidden',
          height: '305px',
          objectFit: 'cover',
        }}
      />
      <Stack
        sx={{
          width: '100%',
          paddingTop: '12px',
          px: '16px',
          textAlign: 'left',
          paddingBottom: '12px',
        }}
        alignItems="flex-start"
      >
        <Typography sx={{ fontWeight: 'bold' }}>{name}</Typography>
        <Typography>{artist}</Typography>
      </Stack>
      <Divider sx={{ width: '90%', background: '#000' }} />
      <Box
        sx={{
          height: '80px',
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        <Button
          sx={{ textDecoration: 'underline', fontSize: 16 }}
          onClick={() => {
            onClickSiseCheck();
          }}
        >
          시세 확인하기
        </Button>
      </Box>
      <Stack
        sx={{
          color: 'white',
          background: 'rgb(14, 12, 39)',
          width: '100%',
          textAlign: 'right',
          padding: '6px 12px',
        }}
      >
        <Typography sx={{ fontSize: 12 }}>No.{no}</Typography>
        <Typography sx={{ fontSize: 12 }}>
          {dayjs(createdAt).format('YYYY/MM/DD')}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Collecting;
