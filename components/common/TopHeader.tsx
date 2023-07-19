import { useRouter } from 'next/router';
import { Stack, Box, IconButton } from '@mui/material';
import { useDdleContext } from 'contexts/Ddle';
import Text from '@mui/material/Typography';
import Image from 'components/Image';
import * as newStaticUrls from 'constants/staticUrls';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import Badge from '@mui/material/Badge';

type Props = {
  showSearch?: boolean;
  showNotification?: boolean;
  newNoti?: boolean;
  showLogo?: boolean;
  showCart?: boolean;
  title: string;
  backIcon?: boolean;
};

const TopHeader = ({
  showSearch = false, // 검색 버튼 표시 여부
  showNotification = true, // 알림 버튼 표시 여부
  showLogo = true, // 로고 영역 표시 여부
  showCart = true, // 장바구니 영여 표시 여부
  title = '', // 메뉴 제목
  newNoti = false,
  backIcon = false,
}: Props) => {
  const router = useRouter();
  const { user, requestLogin, cart } = useDdleContext();
  if (backIcon) {
    return (
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        sx={{
          width: '100%',
          padding: '20px 12px',
          position: 'relative',
          display: 'flex',
        }}
      >
        <IconButton onClick={router.back} sx={{ position: 'absolute' }}>
          <KeyboardBackspaceOutlinedIcon />
        </IconButton>
        {title && (
          <Box
            sx={[
              {
                width: '100%',
                textAlign: 'center',
              },
            ]}
          >
            <Text sx={styles.leftTitle}>{title}</Text>
          </Box>
        )}
        <Box
          sx={{
            marginLeft: 'auto',
            flex: 1,
            textAlign: 'right',
          }}
        >
          {showSearch && (
            <IconButton
              sx={styles.searchIcon}
              onClick={() => {
                router.push('/search');
              }}
            >
              <Image
                objectFit="contain"
                width="24px"
                height="auto"
                src={newStaticUrls.Icons.Search}
                alt="Search"
              />
            </IconButton>
          )}

          {showNotification && (
            <IconButton
              sx={styles.notificationIcon}
              onClick={() => {
                if (user) {
                  router.push('/inbox');
                } else {
                  requestLogin();
                }
              }}
            >
              <Image
                objectFit="contain"
                width="24px"
                height="auto"
                src={
                  newNoti
                    ? newStaticUrls.Icons.InboxNew
                    : newStaticUrls.Icons.Inbox
                }
                alt="Inbox"
              />
            </IconButton>
          )}

          {showCart && (
            <IconButton
              sx={styles.cartIcon}
              onClick={() => {
                if (user) {
                  router.push('/cart');
                } else {
                  requestLogin();
                }
              }}
            >
              <Badge badgeContent={cart.length} color="primary">
                <Image
                  objectFit="contain"
                  width="24px"
                  height="auto"
                  src={newStaticUrls.Icons.Cart}
                  alt="Cart"
                />
              </Badge>
            </IconButton>
          )}
        </Box>
      </Stack>
    );
  }
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      sx={styles.topBarWrapper}
    >
      {showLogo && (
        <Box sx={styles.logoImage}>
          {/* TODO : 이미지 리소스 받으면 로고 이미지 교체 예정 */}
          <Image
            objectFit="cover"
            // width="64px"
            height={26}
            src={newStaticUrls.Logo.LogoWithTitle}
            alt="Notice"
          />
        </Box>
      )}

      {title && (
        <Box sx={styles.leftTitleContainer}>
          <Text sx={styles.leftTitle}>{title}</Text>
        </Box>
      )}

      <Box
        sx={{
          marginLeft: 'auto',
        }}
      >
        {showSearch && (
          <IconButton
            sx={styles.searchIcon}
            onClick={() => {
              router.push('/search');
            }}
          >
            <Image
              objectFit="contain"
              width="24px"
              height="auto"
              src={newStaticUrls.Icons.Search}
              alt="Search"
            />
          </IconButton>
        )}

        {showNotification && (
          <IconButton
            sx={styles.notificationIcon}
            onClick={() => {
              if (user) {
                router.push('/inbox');
              } else {
                requestLogin();
              }
            }}
          >
            <Image
              objectFit="contain"
              width="24px"
              height="auto"
              src={
                newNoti
                  ? newStaticUrls.Icons.InboxNew
                  : newStaticUrls.Icons.Inbox
              }
              alt="Inbox"
            />
          </IconButton>
        )}

        {showCart && (
          <IconButton
            sx={styles.cartIcon}
            onClick={() => {
              if (user) {
                router.push('/cart');
              } else {
                requestLogin();
              }
            }}
          >
            <Badge badgeContent={cart.length} color="primary">
              <Image
                objectFit="contain"
                width="24px"
                height="auto"
                src={newStaticUrls.Icons.Cart}
                alt="Cart"
              />
            </Badge>
          </IconButton>
        )}
      </Box>
    </Stack>
  );
};

const styles = {
  topBarWrapper: {
    width: '100%',
    padding: '20px 20px 20px 36px',
  },
  leftTitleContainer: {
    marginTop: '2px',
    marginRight: 'auto',
  },
  leftTitle: {
    fontWeight: 'bold',
  },
  notificationIcon: {
    marginLeft: 'auto !important',
  },
  logoImage: {
    marginTop: '2px',
    marginRight: 'auto',
  },
  searchIcon: {
    marginLeft: 'auto !important',
  },
  cartIcon: {
    marginLeft: 'auto !important',
  },
};

export default TopHeader;
