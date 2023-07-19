import { Button, Divider, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import _List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import _ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import InfiniteScroll from 'react-infinite-scroll-component';

const ListItemText = styled(_ListItemText)<{ component?: React.ElementType }>(
  {}
);

const ProductSaleList = ({
  items,
  fetchNextPage,
  hasNextPage,
  onClickUpdate,
  onClickProduct,
}: any) => {
  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        paddingBottom: '16px',
        paddingTop: '16px',
        '& .MuiListItemText-primary': {
          fontSize: 13,
          fontWeight: 'bold',
        },
        '& .MuiListItemText-root': {
          marginLeft: '15px',
        },
        '& .MuiAvatar-root': {
          width: '84px',
          height: '84px',
          borderRadius: '10px',
        },
      }}
    >
      <InfiniteScroll
        dataLength={items?.length || 0} //This is important field to render the next data
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<h4>로딩 중</h4>}
      >
        {items.map((item, i) => (
          <ListItem
            key={item.id}
            role="button"
            onClick={() => {
              if (onClickProduct) {
                onClickProduct(item);
              }
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                }}
                src={item.attributes.thumbnails.data?.[0].attributes.url}
              />
            </ListItemAvatar>
            <ListItemText
              primary={item.attributes.name}
              secondary={item.attributes.subDesc || ' '}
            />
            {onClickUpdate ? (
              <Button
                sx={{
                  fontSize: 14,
                  textDecoration: 'underline',
                  padding: 0,
                  color: '#bbbbbb',
                  alignSelf: 'flex-end',
                  mb: 1,
                }}
                onClick={() => {
                  onClickUpdate(item);
                }}
              >
                작성 수정
              </Button>
            ) : null}
          </ListItem>
        ))}
      </InfiniteScroll>
    </Box>
  );
};

export default ProductSaleList;
