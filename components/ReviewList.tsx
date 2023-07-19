import { Box, Typography, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
import { apis } from 'apis';
import clsx from 'clsx';

const ReviewList = (props: any) => {
  const router = useRouter();
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [outAnimationIdx, setOutAnimationIdx] = useState<number[]>([]);

  const result = apis.review.useGetInfiniteList({
    query: {
      populate: ['product', 'product.thumbnails', 'user'],
      sort: ['createdAt:DESC'],
      filters: {
        user: {
          id: {
            $eq: props.profile?.id,
          },
        },
      },
    },
  });
  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [result]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        placeContent: 'flex-start',
        px: '12px',
      }}
    >
      {items.length > 0 ? (
        items.map((item, i) => (
          <Box key={i} sx={{ width: '50%', padding: 1 }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%',
                borderRadius: 3,
                border: '1px solid #cfcfcf',
              }}
              onClick={() => {
                if (selectedIdx > -1) {
                  if (selectedIdx === i) {
                    router.push(
                      `/profile/${item.attributes.user.data?.id}/reviews`
                    );
                  }
                  setOutAnimationIdx((prev) => [...prev, selectedIdx]);
                }
                setSelectedIdx(i);
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  textAlign: 'center',
                  fontSize: '20px',
                  color: 'white',
                  borderRadius: 3,
                  backgroundImage: `url(${item.attributes.product.data?.attributes.thumbnails.data[0].attributes.url})`,
                  backgroundSize: 'cover',
                }}
              />
              <Box
                sx={{
                  background: 'white',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  border: '3px solid #000',
                  borderRadius: 3,
                  padding: '12px',
                  display:
                    selectedIdx !== i && !outAnimationIdx.includes(i)
                      ? 'none'
                      : 'block',
                }}
                className={clsx(
                  'animate__animated',
                  selectedIdx === i
                    ? 'animate__flipInY'
                    : outAnimationIdx.includes(i)
                    ? 'animate__flipOutY'
                    : ''
                )}
              >
                <Typography
                  sx={{
                    height: '100%',
                    overflow: 'hidden',
                    textSize: 12,
                  }}
                >
                  {item.attributes.text}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Stack sx={{ width: '100%', py: 12 }} alignItems="center">
          <Typography sx={{ color: (theme) => theme.palette.grey[400] }}>
            작성된 게시글이 없습니다.
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default ReviewList;
