import { useRouter } from 'next/router';
import ScreenBox from 'components/ScreenBox';
import SearchAppBar from 'components/common/SearchAppBar';
import { Stack, Chip, Typography, Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useEffect, useRef, useMemo } from 'react';
import { apis } from 'apis';

function AlignItemsList({
  items,
}: {
  items: { id: any; image: string; name: string; type: 'artist' | 'art' }[];
}) {
  const router = useRouter();
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {items.map((item) => (
        <ListItem
          key={item.name}
          sx={{ borderBottom: '1px solid rgb(235, 235, 235)', py: 1.2 }}
          role="button"
          onClick={() => {
            if (item.type === 'artist') {
              router.push(`/artist/${item.id}`);
            } else {
              router.push(`/product/${item.id}`);
            }
          }}
        >
          <ListItemAvatar
            sx={{ display: 'flex', height: '36px', alignItems: 'center' }}
          >
            {item.type === 'artist' ? (
              <Avatar src={item.image} />
            ) : (
              // <SearchIcon />
              <Avatar src={item.image} />
            )}
          </ListItemAvatar>
          <ListItemText
            primary={item.name}
            secondary={item.subDesc}
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: 12,
              },
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}

const Search = () => {
  const router = useRouter();

  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const q = router.query.q || '';
  const { data: products } = apis.product.useGetList({
    query: {
      populate: '*',
      filters: {
        name: {
          $containsi: q,
        },
        display: {
          $eq: true,
        },
      },
      pagination: {
        pageSize: 5,
      },
      sort: ['createdAt:desc'],
    },
  });
  const { data: artists } = apis.artist.useGetList({
    query: {
      populate: '*',
      filters: {
        $or: [
          {
            nickname: {
              $containsi: q,
            },
          },
          {
            name: {
              $containsi: q,
            },
          },
        ],
      },
      pagination: {
        pageSize: 5,
      },
      sort: ['createdAt:desc'],
    },
  });

  const searchedResults = useMemo(() => {
    let arr: any = [];
    if (products?.data) {
      arr = arr.concat(
        products.data.map((product) => ({
          id: product.id,
          image: product.attributes.thumbnails.data?.[0].attributes.url,
          name: product.attributes.name,
          subDesc: product.attributes.subDesc,
          type: 'product',
        }))
      );
    }
    if (artists?.data) {
      arr = arr.concat(
        artists.data.map((artist) => ({
          id: artist.id,
          image: artist.attributes.avatar?.data?.attributes.url,
          name: artist.attributes.nickname,
          type: 'artist',
        }))
      );
    }

    return arr;
  }, [artists, products]);
  return (
    <>
      <ScreenBox>
        {/* 상단 메뉴 */}
        <SearchAppBar title="검색" ref={inputRef} />
        {!q ? null : searchedResults.length > 0 ? (
          <Stack sx={{ px: 2, width: '100%' }}>
            <AlignItemsList items={searchedResults} />
          </Stack>
        ) : searchedResults.length === 0 && q ? (
          <Stack sx={{ px: 2, width: '100%' }}>
            <Stack sx={{ width: '100%', py: 12 }} alignItems="center">
              <Typography sx={{ color: (theme) => theme.palette.grey[400] }}>
                작성된 게시글이 없습니다.
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <Stack sx={{ px: 2, width: '100%' }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: 'rgb(121, 121, 121)',
                pt: '10px',
                pb: '14px',
              }}
            >
              키워드 검색
            </Typography>
            <Box>
              {[
                '일러스트',
                '도자',
                '회화',
                '원화',
                '에디션',
                '가구',
                '드로잉',
                '집들이선물',
                '라이프',
              ].map((text) => (
                <Chip
                  key={text}
                  label={text}
                  sx={{
                    mr: 1,
                    mb: 1,
                    padding: '6px 22px',
                    '& .MuiChip-label': {
                      paddingLeft: 0,
                      paddingRight: 0,
                      color: 'rgb(121, 121, 121)',
                    },
                  }}
                />
              ))}
            </Box>
          </Stack>
        )}
      </ScreenBox>
    </>
  );
};

export default Search;
