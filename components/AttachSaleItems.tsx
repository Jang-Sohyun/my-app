import { Typography } from '@mui/material';
import { Stack } from '@mui/material';
import BottomSheet from 'components/BottomSheet';
import { useEffect, useState, useMemo } from 'react';
import ProductSaleList from './ProductSaleList';
import { apis } from 'apis';
import { useDdleContext } from 'contexts/Ddle';

const AttachSaleItems = ({ open, onOpen, onClose, onClickProduct }) => {
  const { user } = useDdleContext();

  const result = apis.product.useGetInfiniteList(
    {
      query: {
        populate: ['images', 'artist', 'thumbnails'],
        sort: ['createdAt:DESC'],
        filters: {
          artist: {
            id: { $eq: user?.artist?.id },
          },
        },
      },
    },
    { enabled: Boolean(user?.artist?.id) }
  );
  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [result]);

  return (
    <>
      <BottomSheet open={open} onOpen={onOpen} onClose={onClose}>
        <Stack sx={{ paddingBottom: 4, pt: 2 }}>
          <Stack justifyContent="center" alignItems="center">
            <Typography gutterBottom>
              <strong>판매 작품 연결하기</strong>
            </Typography>
          </Stack>
          <Stack
            sx={{
              px: '20px',
              pb: '20%',
              pt: '12px',

              maxHeight: '80vh',
              overflowY: 'scroll',
            }}
            spacing={1}
          >
            <ProductSaleList
              items={items}
              fetchNextPage={result.fetchNextPage}
              hasNextPage={result.hasNextPage}
              onClickProduct={onClickProduct}
            />
          </Stack>
        </Stack>
      </BottomSheet>
    </>
  );
};

export default AttachSaleItems;
