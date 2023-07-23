import { Stack, Typography } from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';
import OrderItem from '../components/OrderItem';

const List = (props: any) => {
  return (
    <Stack
      sx={{
        width: '100%',
        position: 'relative',
      }}
      role="button"
      onClick={props.onClick}
    >
      <Stack spacing={1}>
        {props.items.map((item: any, i: number) => (
          <Stack key={i}>
            <OrderItem
              image={item.image}
              name={item.name}
              artist={item.artist}
              optionLabel={item.optionLabel}
              price={item.price}
              quantity={item.quantity}
            />
          </Stack>
        ))}
      </Stack>
      {props.onClick ? (
        <KeyboardArrowRight
          sx={{ position: 'absolute', right: 0, top: '74px', opacity: 0.3 }}
        />
      ) : null}
    </Stack>
  );
};
const OrderList = ({ items }: any) => {
  return (
    <List
      items={items.map((orderItem: any) => {
        const product = orderItem.attributes.product.data;
        if (product) {
          const item = {
            image: product.attributes.thumbnails.data[0].attributes.url,
            name: product.attributes.name,
            artist: product.attributes.artist.data.attributes.nickname,
            optionLabel: '',
            price: product.attributes.price,
            quantity: orderItem.attributes.amount,
          };
          return item;
        } else {
          return {
            image: '',
            name: '삭제된 제품',
            artist: '',
            optionLabel: '',
            price: 0,
            quantity: 0,
          };
        }
      })}
    />
  );
};

export default OrderList;
