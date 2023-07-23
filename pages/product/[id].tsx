import { useState } from 'react';
import ScreenBox from '../../components/ScreenBox';
import BottomMenuForPurchase from '../../components/common/BottomMenuForPurchase';
import TopHeader from '../../components/common/TopHeader';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import SwipeableViews from 'react-swipeable-views';
import { NextSeo } from 'next-seo';
import parse from 'html-react-parser';
import { Stack, Typography, Divider, ButtonBase } from '@mui/material';
import comma from '../../libs/comma';
import { WriteIcon } from '../../components/svgIcons';
import AskAboutProduct from '../../components/AskAboutProduct';
import WriteReview from '../../components/WriteReview';
import OptionSelect from '../../components/OptionSelect';
import Alert from '../../components/Alert';
import useConfirmDialog from '../../libs/useConfirmDialog';
import { apis } from '../../apis/index';
import { useDdleContext } from '../../contexts/Ddle';
import Link from 'next/link';
import { useSnackbar } from 'notistack';

const ProductDetail = ({ product: productFromServer }: any) => {
  let product = productFromServer?.data;
  const { data: productFromClient } = apis.product.useGet(
    product?.id,
    {
      query: {
        populate: [
          'avatar',
          'artist.avatar',
          'images',
          'thumbnails',
          'reviews',
          'artistNote',
        ],
      },
    },
    { enabled: Boolean(product) }
  );
  if (productFromClient?.data) product = productFromClient?.data;
  const artist = product?.attributes.artist.data;
  const images = product?.attributes.images.data || [];
  const thumbnails = product?.attributes.thumbnails.data || [];
  const isSoldOut = product?.attributes.stock === 0;
  const { user, requestLogin } = useDdleContext();
  const { enqueueSnackbar } = useSnackbar();

  const [imgStep, setImgStep] = useState(0);
  const [reviewImgStep, setReviewImgStep] = useState(0);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [openAskAboutProduct, setOpenAskAboutProduct] = useState(false);
  const [openWriteReview, setOpenWriteReview] = useState(false);
  const [openOptionSelect, setOpenOptionSelect] = useState(false);
  const confirmDialog = useConfirmDialog();

  const { mutateAsync: writeReview, isLoading: writeReviewLoading } =
    apis.review.useCreate();

  const { mutateAsync: createCs, isLoading: createCsLoading } =
    apis.productInquery.useCreate();
  const { isLiked, like } = apis.likingProduct.useLike(product?.id);

  const { data: artistNotes } = apis.artistNote.useGetList(
    {
      query: {
        sort: 'createdAt:desc',
        populate: ['images'],
        filters: {
          artist: {
            id: {
              $eq: artist?.id,
            },
          },
          product: {
            id: {
              $eq: product?.id,
            },
          },
        },
      },
    },
    { enabled: Boolean(product && artist) }
  );

  if (!product || !artist) return null;

  return (
    <>
      <ScreenBox footer>
        <TopHeader
          backIcon
          showSearch={true}
          showNotification={false}
          showLogo={false}
        />
        <Stack sx={{ width: '100%' }} divider={<Divider />}>
          <SwipeableViews
            // index={imgStep}
            onChangeIndex={(index) => {
              setImgStep(index);
            }}
          >
            {thumbnails?.map((img) => (
              <Box key={img.attributes.url}>
                <Box
                  component="img"
                  sx={{
                    borderTop: (theme) =>
                      `1px solid ${theme.palette.grey[200]}`,
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.grey[200]}`,
                    borderLeft: 0,
                    borderRight: 0,
                    display: 'block',
                    overflow: 'hidden',
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'contain',
                  }}
                  src={img.attributes.url}
                />
              </Box>
            ))}
          </SwipeableViews>
          {thumbnails.length > 1 ? (
            <Box sx={{ position: 'relative', width: '100%' }}>
              <MobileStepper
                steps={thumbnails.length}
                position="static"
                activeStep={imgStep}
                backButton={null}
                nextButton={null}
                sx={{
                  position: 'absolute',
                  background: 'transparent',
                  width: '100%',
                  top: '-20px',
                  '& .MuiMobileStepper-dots': {
                    width: '100%',
                  },
                  '& .MuiMobileStepper-dot': {
                    width: `calc(100% / ${thumbnails.length}) !important`,
                    height: '2px !important',
                    borderRadius: 0,
                    background: 'white',
                  },
                  '& .MuiMobileStepper-dot.MuiMobileStepper-dotActive': {
                    background: 'black',
                  },
                }}
              />
            </Box>
          ) : null}
          <Stack sx={{ px: '20px', py: '16px' }}>
            {artist ? (
              <Link href={`/artist/${artist.id}`}>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 'bold' }}>
                    {artist.attributes.nickname}
                  </Typography>
                  <Typography sx={{ fontSize: 15 }}>
                    {product.attributes.name}
                  </Typography>
                </Box>
              </Link>
            ) : null}
            {product.attributes.tags && (
              <Typography sx={{ fontSize: 10 }}>
                {product.attributes.tags}
              </Typography>
            )}
            <Stack direction="row" alignItems="center" sx={{ pt: '10px' }}>
              <Typography
                sx={{
                  flex: 1,
                  fontSize: 10,
                  color: (theme) => theme.palette.grey[400],
                }}
              >
                거래 가격
              </Typography>
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 'bold',
                }}
              >
                {isSoldOut
                  ? 'Sold Out'
                  : `${comma(product.attributes.price)}원`}
              </Typography>
            </Stack>
          </Stack>
          <Stack sx={{ px: '20px', py: '16px' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 'bold', mb: 1 }}>
              배송 정보
            </Typography>
            <Stack direction="row">
              <Typography
                sx={{
                  width: '20%',
                  fontSize: 13,
                  fontWeight: 'bold',
                  color: (theme) => theme.palette.grey[700],
                }}
              >
                배송지
              </Typography>
              <Stack>
                <Typography sx={{ fontSize: 13 }}>
                  무료 (도서산간/제주 지역 추가비용 발생)
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  5-7일 이내 출고 예정
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack sx={{ py: '10px' }}>
            <Typography
              sx={{
                textAlign: 'center',
                mb: 1,
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              작품 정보
            </Typography>
            {images?.map((image) => (
              <Box
                key={image.id}
                component="img"
                src={image.attributes.url}
                sx={{ width: '100%' }}
              />
            ))}
            {product.attributes.detailHtml ? (
              <Box
                sx={{
                  py: 2,
                  px: 2,
                  '& img': {
                    width: '100%',
                  },
                  '& p': {
                    margin: 0,
                    fontWeight: 400,
                    fontSize: '1rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                  },
                }}
              >
                {parse(product.attributes.detailHtml)}
              </Box>
            ) : (
              ''
            )}
          </Stack>
          <Stack
            sx={{
              mx: '14px',
              my: '45px',
              py: '18px',
              px: '70px',
              background: (theme) => theme.palette.grey[200],
              borderRadius: '12px',
            }}
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '36px',
                background: 'white',
                width: '36px',
                height: '36px',
              }}
            >
              <WriteIcon />
            </Box>
            <ButtonBase
              disableRipple
              onClick={() => {
                if (user) {
                  setOpenWriteReview(true);
                } else {
                  requestLogin();
                }
              }}
              sx={{ textAlign: 'left' }}
            >
              <Stack>
                <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
                  감상평 남기기
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  작가에게 감상평을 전달해보세요!
                </Typography>
              </Stack>
            </ButtonBase>
          </Stack>
          {artistNotes?.data?.length > 0 ? (
            <Stack sx={{ pb: '36px' }}>
              <Typography
                sx={{
                  pl: '38px',
                  pt: '24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                이 작품의 노트
              </Typography>
              <SwipeableViews
                index={reviewImgStep}
                onChangeIndex={(index) => {
                  setReviewImgStep(index);
                }}
                containerStyle={{
                  width: '85%',
                }}
              >
                {artistNotes.data.map((note) => (
                  <Stack
                    key={note.id}
                    sx={{ width: '100%', paddingLeft: '20px' }}
                  >
                    <Stack
                      sx={{
                        p: '20px',
                        background: (theme) => theme.palette.grey[200],
                        borderRadius: '8px',
                      }}
                      spacing={1}
                    >
                      <Typography
                        sx={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          whiteSpace: 'pre',
                        }}
                      >
                        {note.attributes.title}
                        <Link href={`/note/${note.id}`}>
                          <strong>더보기</strong>
                        </Link>
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        {note.attributes.text.length > 100 ? (
                          <>
                            {note.attributes.text.slice(0, 100) + '...'}
                            <Link href={`/note/${note.id}`}>
                              <strong>더보기</strong>
                            </Link>
                          </>
                        ) : (
                          note.attributes.text
                        )}
                      </Typography>
                      {note.attributes.images.data?.length > 0 ? (
                        <Box
                          sx={{ width: '100%', borderRadius: 4 }}
                          component="img"
                          src={note.attributes.images.data[0].attributes.url}
                        />
                      ) : null}
                    </Stack>
                  </Stack>
                ))}
              </SwipeableViews>
            </Stack>
          ) : null}
        </Stack>
      </ScreenBox>

      <BottomMenuForPurchase
        product={product}
        snackBarOpen={snackBarOpen}
        onClickCloseSnackbar={() => {
          setSnackBarOpen(false);
        }}
        isLiked={isLiked}
        onClickLike={like}
        onClickAsk={() => {
          if (user) {
            setOpenAskAboutProduct(true);
          } else {
            requestLogin();
          }
        }}
        isSoldOut={isSoldOut}
        onClickBuy={() => {
          setOpenOptionSelect(true);
        }}
      />
      <AskAboutProduct
        open={openAskAboutProduct}
        onClose={() => {
          setOpenAskAboutProduct(false);
        }}
        onOpen={() => {
          setOpenAskAboutProduct(true);
        }}
        product={product}
        onSubmit={({ title, body }) => {
          if (!createCsLoading) {
            confirmDialog
              .open({
                title: '문의를 남기겠습니까?',
                buttons: {
                  cancel: '아니요',
                  confirm: '네',
                },
              })
              .then(async (confirm) => {
                if (confirm) {
                  try {
                    await createCs({
                      user: user?.id,
                      desc: body,
                      title,
                      product: product.id,
                      artist: artist.id,
                    });
                    enqueueSnackbar('문의가 등록되었습니다.');
                    setOpenAskAboutProduct(false);
                  } catch (e) {
                    alert(e.message);
                  }
                }
              });
          }
        }}
      />
      <WriteReview
        open={openWriteReview}
        onClose={() => {
          setOpenWriteReview(false);
        }}
        onOpen={() => {
          setOpenWriteReview(true);
        }}
        product={product}
        onSubmit={({ body }) => {
          if (!writeReviewLoading) {
            if (body.length < 30) {
              confirmDialog.open({
                title: '30자 이상 작성해주세요!',
                body: `감상평은 30자 이상 1000자이하로\n작성할 수 있습니다.`,
                buttons: {
                  cancel: '확인',
                },
              });
            } else {
              confirmDialog
                .open({
                  title: '감상평을 남기겠습니까?',
                  body: `작가님과 감상평으로 소통 해보는건 어떨까요?\n작가님에게도 감상평을 공유해보세요!`,
                  buttons: {
                    cancel: '괜찮아요.',
                    confirm: '좋아요!',
                  },
                })
                .then(async (confirm) => {
                  if (confirm) {
                    try {
                      await writeReview({
                        user: user?.id,
                        text: body,
                        product: product.id,
                      });
                      enqueueSnackbar('감상평이 등록되었습니다.');
                      setOpenWriteReview(false);
                    } catch (e) {
                      alert(e.message);
                    }
                  }
                });
            }
          }
        }}
      />
      <OptionSelect
        open={openOptionSelect}
        product={product}
        stock={product.attributes.stock}
        onClose={() => {
          setOpenOptionSelect(false);
        }}
        onOpen={() => {
          setOpenOptionSelect(true);
        }}
        // options={data.options}
        options={[]}
        onAddCart={(items) => {
          alert(items);
        }}
        onBuyNow={(items) => {
          alert(items);
        }}
      />
      <Alert
        open={confirmDialog.isOpen}
        onClose={() => {
          confirmDialog.onClose();
        }}
        title={confirmDialog.data?.title}
        subTitle={confirmDialog.data?.body}
        buttons={[
          {
            label: confirmDialog.data?.buttons.cancel,
            onClick: () => {
              confirmDialog.onClose();
            },
          },
          confirmDialog.data?.buttons.confirm
            ? {
                label: confirmDialog.data?.buttons.confirm,
                isDanger: true,
                onClick: () => {
                  confirmDialog.onConfirm(true);
                },
              }
            : null,
        ]}
      />

      <NextSeo
        title={`뜰 | ${product.attributes.name}`}
        description="뜰 - 예술을 향유하는 첫 걸음"
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_HOST}/artist/${product.id}`,
          title: `뜰 | ${product.attributes.name}`,
          description: '뜰 - 예술을 향유하는 첫 걸음',
          images: [
            { url: product.attributes.thumbnails.data[0].attributes.url },
          ],
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />
    </>
  );
};
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
export async function getStaticProps({ params }) {
  try {
    const id = params.id;
    const product = await apis.product.get(Number(id), {
      query: {
        populate: [
          'avatar',
          'artist.avatar',
          'images',
          'thumbnails',
          'reviews',
        ],
      },
    });
    return {
      props: { product },
      revalidate: 10,
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
// export async function getServerSideProps(context) {
//   try {
//     const id = context.params.id;
//     const product = await apis.product.get(Number(id), {
//       query: {
//         populate: [
//           'avatar',
//           'artist.avatar',
//           'images',
//           'thumbnails',
//           'reviews',
//         ],
//       },
//     });
//     return {
//       props: { product },
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       props: {
//         error: e.message,
//       },
//     };
//   }
// }
export default ProductDetail;
