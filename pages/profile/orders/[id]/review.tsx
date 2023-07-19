import ScreenBox from 'components/ScreenBox';
import BasicAppBar from 'components/common/BasicAppBar';
import { Box, Stack, Typography, Button, Divider } from '@mui/material';
import dayjs from 'dayjs';
import { KeyboardArrowRight } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import OrderItem from 'components/OrderItem';
import Rating from '@mui/material/Rating';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import TextInput from 'components/TextInput';
import ImageUploader from 'components/ImageUploader';
import { useDdleContext } from 'contexts/Ddle';
import { useSnackbar } from 'notistack';
import { useContext as useConfirm } from 'contexts/confirm';
import { apis } from 'apis';
import OrderList from 'components/OrderList';
type Props = {
  onClickGoBack: () => void;
};

const OrderDetail = ({ order }: any) => {
  const router = useRouter();
  const orderItemId = router.query['order-item'];
  const orderItem = order.attributes.order_items.data.find(
    (item) => String(item.id) === String(orderItemId)
  );
  const [satisfaction, setSatisfaction] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [processNo, setProcessNo] = useState(0);
  const [curating, setCurating] = useState('');
  const [images, setImages] = useState([]);
  const create = apis.purchasedReview.useCreate();
  const update = apis.purchasedReview.useUpdate();
  const { user } = useDdleContext();
  const { enqueueSnackbar } = useSnackbar();
  const [, confirm] = useConfirm();

  const prevReviewId = router.query['review-id'];
  useEffect(() => {
    if (prevReviewId) {
      (async () => {
        const { data: prevReview } = await apis.purchasedReview.get(
          Number(prevReviewId),
          {
            query: {
              populate: [
                'user',
                'order',
                'order_item',
                'user.avatar',
                'artist',
                'artist.avatar',
                'images',
              ],
              sort: ['createdAt:desc'],
            },
          }
        );

        setCorrect(prevReview.attributes.correct);
        setSatisfaction(prevReview.attributes.satisfaction);
        setCurating(prevReview.attributes.text);
        setImages(
          prevReview.attributes.images.data.map(({ id, attributes }) => ({
            id,
            ...attributes,
          }))
        );
      })();
    }
  }, [prevReviewId]);

  return (
    <ScreenBox>
      <BasicAppBar title="리뷰 작성" />
      <Stack sx={{ px: '20px', width: '100%', height: '100%', flex: 1 }}>
        <Stack>
          <Typography
            sx={{ fontSize: '14px', color: (theme) => theme.palette.grey[500] }}
          >
            {dayjs().format('YYYY. MM. DD')}
          </Typography>
        </Stack>
        <Box
          sx={{
            pt: '18px',
            flex: 1,
          }}
        >
          <OrderList items={orderItem ? [orderItem] : []} />
          <Stack alignItems="flex-end">
            <Button
              disableRipple
              sx={{ py: 0, visibility: processNo === 0 ? 'hidden' : 'visible' }}
              size="small"
              onClick={() => {
                setProcessNo(0);
              }}
            >
              별점 수정
            </Button>
          </Stack>
          <Divider sx={{ mt: '4px' }} />
          {processNo === 0 ? (
            <Stack>
              <Stack
                sx={{ mt: '92px' }}
                justifyContent="center"
                alignItems="center"
              >
                <Typography sx={{ fontSize: 16, mb: 1 }}>
                  작가님의 작품은 만족하셨나요?
                </Typography>
                <Rating
                  value={satisfaction}
                  sx={{ fontSize: '2.5rem' }}
                  onChange={(event, newValue) => {
                    setSatisfaction(newValue);
                  }}
                  icon={<StarRoundedIcon fontSize="inherit" />}
                  emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                />
              </Stack>
              <Stack
                sx={{ mt: '45px' }}
                justifyContent="center"
                alignItems="center"
              >
                <Typography sx={{ fontSize: 16, mb: 1 }}>
                  상세정보와 동일 했나요?
                </Typography>
                <Rating
                  value={correct}
                  sx={{ fontSize: '2.5rem' }}
                  onChange={(event, newValue) => {
                    setCorrect(newValue);
                  }}
                  icon={<StarRoundedIcon fontSize="inherit" />}
                  emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                />
              </Stack>
            </Stack>
          ) : (
            <Stack sx={{ pt: '27px' }}>
              <Typography
                sx={{ mb: '16px', fontWeight: 'bold', flex: 1, fontSize: 15 }}
              >
                3줄 큐레이팅
              </Typography>
              <TextInput
                multiline
                maxRows={3}
                placeholder="작품에 대한 평가를 3줄로 작성해 주세요."
                value={curating}
                onChange={(e) => {
                  let num = 0;
                  for (const char of e.target.value) {
                    if (char === '\n') num += 1;
                  }
                  if (num > 2) {
                    alert('3줄을 초과할 수 없습니다.');
                  } else {
                    setCurating(e.target.value);
                  }
                }}
              />
              <Typography
                sx={{
                  mt: '18px',
                  mb: '16px',
                  fontWeight: 'bold',
                  flex: 1,
                  fontSize: 15,
                }}
              >
                사진
              </Typography>
              <ImageUploader
                type="2"
                images={images}
                imageInputType="serverUploaded"
                onChange={(images) => setImages(images)}
                max={10}
                multiple
              />
              <Box sx={{ mt: 4, height: '180px' }}>
                <Stack
                  sx={{
                    background: (theme) => theme.palette.grey[200],
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    padding: '20px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: (theme) => theme.palette.grey[900],
                      whiteSpace: 'pre',
                      mb: 1,
                    }}
                  >
                    {`* 후기작성 안내
작성된 후기는 뜰의 홍보 콘테츠로 사용될 수 있습니다.`}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: (theme) => theme.palette.grey[700],
                      whiteSpace: 'pre',
                    }}
                  >
                    {`작품과 관련이 없거나 문지 및 기호의 단순 나열,반복된 내용의 
후기 및 개인정보, 광고, 비속어가 포함된 내용의 후기는 비노출이
될 수 있음을 확인하고 등록합니다.`}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          )}
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            py: '10px',
            mb: '40px',
            borderRadius: 6,
            background: 'rgb(14, 12, 39)',
            '&:hover': {
              background: 'rgb(14, 12, 39)',
            },
            '&:active': {
              background: 'rgb(14, 12, 39)',
            },
          }}
          onClick={async () => {
            setProcessNo((p) => p + 1);
            if (processNo !== 0) {
              try {
                confirm
                  .open({
                    title: (prevReviewId ? '수정' : '작성') + '하시겠습니까?',
                    buttons: [
                      {
                        label: '취소',
                      },
                      {
                        label: prevReviewId ? '수정' : '작성',
                        isDanger: true,
                      },
                    ],
                  })
                  .then(async (confirm) => {
                    if (confirm === '작성' || confirm === '수정') {
                      if (!curating || !images.length) {
                        alert('필수 정보들이 입력되지 않았습니다. ');
                      } else {
                        const artistId =
                          orderItem.attributes.product.data.attributes.artist
                            .data.id;
                        const params = {
                          user: {
                            id: user?.id,
                          },
                          artist: {
                            id: artistId,
                          },
                          satisfaction,
                          correct,
                          text: curating,
                          images: images.map(({ id }) => id),
                          order: order.id,
                          order_item: orderItem.id,
                        } as any;
                        let id = prevReviewId;
                        if (prevReviewId) {
                          params.id = prevReviewId;
                          const updateRes = await update.mutateAsync(params);
                        } else {
                          const { data: createRes } = await create.mutateAsync(
                            params
                          );
                          id = createRes.id;
                        }
                        enqueueSnackbar('3줄 큐레이팅이 등록되었습니다.');
                        router.push(`/artist/${artistId}/curatings/${id}`);
                      }
                    }
                  });
              } catch (e) {
                alert(e.message);
              }
            }
          }}
        >
          {processNo === 0 ? '다음 단계' : '등록하기'}
        </Button>
      </Stack>
    </ScreenBox>
  );
};

export async function getServerSideProps(context) {
  try {
    const orderId = context.params.id;
    const { data: order } = await apis.order.get(Number(orderId), {
      query: {
        populate: [
          '*',
          'order_items',
          'order_items.product',
          'order_items.product.artist',
          'order_items.product.thumbnails',
          'delivery',
        ],
      },
    });
    return {
      // Passed to the page component as props
      props: { order },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        error: e.message,
      },
    };
  }
}
export default OrderDetail;
