import { useEffect } from 'react';
import {
  Stack,
  Box,
  Typography as Text,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Checkbox from '@mui/material/Checkbox';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import comma from '../../libs/comma';

type ProductListByProviderProps = {
  cartItems: any;
};

/*
  provider 별로 데이터 재정렬
  provider 렌더하고 상품 렌더

  차곡 스튜디오 : {
    provider : {
      
    },
    items : []
  },
  
  심정 : {
    provider : {
      
    },
    items : []
  }

  object.loop 
  provider를 렌더한다 (1회)
  items를 렌더한다. 
*/

const ProductListByProvider = ({
  shopName,
  shopSrc,
  cartItems,
  onSelect,
  selectedIds,
  onRemove,
}: ProductListByProviderProps) => {
  return (
    <Box sx={styles.cartListByProviderWrapper}>
      {/* 판매자별 상품 그룹 목록 */}
      <Box sx={styles.productGroup}>
        {/* 리스트 첫번째인 경우에만 판매자 프로필 렌더 */}
        <Stack
          sx={styles.provider}
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Avatar sx={styles.providerProfile} src={shopSrc} />
          <Text sx={styles.providerName}>{shopName}</Text>
        </Stack>

        <List dense={true} sx={styles.listContainer}>
          {cartItems.map((item: any) => {
            const product = item.attributes.product.data;

            return (
              <ListItem
                key={item.id}
                sx={styles.listItem}
                onClick={() => {
                  onSelect(item);
                }}
              >
                <Checkbox
                  sx={styles.checkboxIcon}
                  icon={<CheckCircleOutlineIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  checked={selectedIds.includes(item.id)}
                />

                <img
                  width="60px"
                  height="60px"
                  src={product?.attributes.thumbnails.data?.[0]?.attributes.url}
                  loading="lazy"
                />

                <ListItemText
                  sx={styles.listItemText}
                  primary={
                    <Text
                      sx={styles.primaryText}
                    >{`${product.attributes.name} (${item.attributes.amount}개)`}</Text>
                  }
                  secondary={
                    <Text sx={styles.secondaryText}>
                      {product.attributes.price}원
                    </Text>
                  }
                />

                <CloseOutlinedIcon
                  sx={styles.closeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemove(item);
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

const styles = {
  listContainer: {
    pl: 0,
    '& img': {
      borderRadius: '12px',
      marginRight: '5px',
      marginLeft: '0px',
    },
  },
  primaryText: {
    color: '#444',
    fontSize: '13px',
    fontWeight: 700,
  },
  secondaryText: {
    color: '#444',
    fontSize: '14px',
    fontWeight: 700,
  },
  cartListByProviderWrapper: { width: '90%' },
  productGroup: { borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' },
  provider: { p: 2, pl: 0 },
  providerProfile: { width: 32, height: 32 },
  providerName: { pl: 0, fontSize: 14, fontWeight: 600 },
  listItem: { p: 0, mb: 1 },
  checkboxIcon: { p: 0, mr: 1 },
  listItemText: { ml: 1 },
  closeButton: { width: 16, height: 16 },
  providerTotalContainer: { mt: 2 },
  providerTotalPriceLabel: { fontSize: 13 },
  providerTotalPrice: { fontSize: 16, pl: 1, fontWeight: 700 },
};

export default ProductListByProvider;
