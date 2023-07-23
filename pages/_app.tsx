import { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/system';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Script from 'next/script';
import { SnackbarProvider } from 'notistack';
import { useScrollRestoration } from '../libs/useScrollRestoration';
import { DefaultSeo } from 'next-seo';
import { DdleContext as DdleContext } from '../contexts/Ddle';
import { ProviderWithUI as ConfirmProviderWithUI } from '../contexts/confirm';
import { ProviderWithUI as MoreConfirmProviderWithUI } from '../contexts/moreConfirm';
import theme from '../constants/theme';
import createEmotionCache from '../libs/createEmotionCache';
import Loader from '../components/Loader';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { useRouter } from 'next/router';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ScreenWidth, ScreenMargin } from '../constants/styles';
import * as StaticUrls from '../constants/staticUrls';
import 'dayjs/locale/ko';
import { Title } from '../constants/seo';
import Iconify from '../components/Iconify';
import { IconButton } from '@mui/material';
import { User, StoreKey } from '../types';
import { apis } from '../apis';
import BottomMenu from '../components/common/BottomMenu';
import { init as initWebview } from '../libs/webview';
import 'react-quill/dist/quill.snow.css';
import '../styles/globals.css';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.locale('ko');

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}
const queryClient = new QueryClient();

// useUser 하는 일
// 1. 유저 프로필 초기화
// 2. 인증 상태 변경에 따라 유저 프로필 변경
// 3. 서버에 푸시 토큰 갱신
interface UserCtx {
  user: User | null;
  loading: boolean;
}
const useUser = () => {
  const [userCtx, setUserCtx] = useState<UserCtx>({
    user: null,
    loading: true,
  });
  const router = useRouter();

  const setUserFromJwtOrClear = async () => {
    const jwtFromStorage = window.localStorage.getItem(StoreKey.Jwt);
    const jwtFromQuery = router.query.jwt as string;

    const jwt = jwtFromQuery || jwtFromStorage;

    if (jwt) {
      try {
        window.localStorage.setItem(StoreKey.Jwt, jwt);
        const { data: me } = await apis.user.getMe();
        setUserCtx({
          user: me,
          loading: false,
        });
      } catch (e) {
        window.localStorage.removeItem(StoreKey.Jwt);
        setUserCtx({
          loading: false,
          user: null,
        });
      }
    } else {
      window.localStorage.removeItem(StoreKey.Jwt);
      setUserCtx({
        loading: false,
        user: null,
      });
    }
  };

  useEffect(() => {
    (async () => {
      if (router.isReady) {
        setUserFromJwtOrClear();
      }
    })();
  }, [router.isReady, router.query.jwt]);

  const logout = async () => {
    try {
      window.localStorage.removeItem(StoreKey.Jwt);
      setUserFromJwtOrClear();
      window.location.href = '/login';
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (userCtx.user && !userCtx.user.signedUp && router.pathname !== 'join') {
      router.replace('/join');
    }
  }, [userCtx, router.pathname]);
  return {
    loading: userCtx.loading,
    user: userCtx.user,
    logout,
    setUserFromJwtOrClear,
    requestLogin: () => {
      const result = window.confirm('로그인이 필요합니다.');
      if (result)
        window.location.href = `/login?redirect=${window.location.href}`;
    },
  };
};

const useCart = (user: any) => {
  const [cart, setCart] = useState<any[]>([]);

  const fetchCart = useCallback(async () => {
    if (user) {
      const { data: cartData } = await apis.cart.getList({
        query: {
          populate: [
            'product',
            'user',
            'product.thumbnails',
            'product.artist',
            'product.artist.avatar',
          ],
          filters: {
            user: {
              id: {
                $eq: user?.id,
              },
            },
          },
        },
      });
      if (cartData) {
        setCart(cartData);
      }
    } else {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = useCallback(
    async ({ productId, amount }: { productId: number; amount: number }) => {
      if (user) {
        if (productId && amount) {
          // 기존 것이 있으면 change
          const prev = cart.find((item) => {
            return item.attributes.product.data?.id === productId;
          });
          if (prev) {
            let nextAmount = prev.attributes.amount + amount;
            if (nextAmount < 1) nextAmount = 1;
            await changeCart({
              cartId: prev.id,
              amount: nextAmount,
            });
          } else {
            // 없으면 추가
            await apis.cart.create({
              product: productId,
              amount,
              user: user.id,
            });
          }
          await fetchCart();
        } else {
          alert('잘못된 요청');
        }
      } else {
        alert('로그인이 필요합니다.');
        window.location.href = `/login?redirect=${window.location.href}`;
        throw new Error('로그인');
      }
    },
    [cart, user]
  );

  const removeCart = useCallback(
    async ({ cartId }: { cartId: number }) => {
      if (cartId && user) {
        await apis.cart.remove(cartId);
        await fetchCart();
      } else {
        alert('잘못된 요청');
      }
    },
    [cart, user]
  );

  const changeCart = useCallback(
    async ({ cartId, amount }: { cartId: number; amount: number }) => {
      if (user && cartId && amount) {
        await apis.cart.update({
          id: cartId,
          amount,
        });
        await fetchCart();
      } else {
        alert('잘못된 요청');
      }
    },
    [cart, user]
  );

  return {
    cart,
    addToCart,
    changeCart,
    removeCart,
  };
};
export default function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { ...pageProps },
  } = props;

  // 유저 프로필 초기화
  const {
    loading: userLoading,
    user,
    logout,
    setUserFromJwtOrClear,
    requestLogin,
  } = useUser();
  // 언어 초기화

  const { cart, addToCart, changeCart, removeCart } = useCart(user);

  // 스크롤 유지
  useScrollRestoration();

  const notistackRef = useRef<any>(null);

  const onClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      if (router.query.err) {
        const err = decodeURIComponent(router.query.err);
        alert(err);
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    window.tossPayments = window.TossPayments(
      process.env.NEXT_PUBLIC_TOSS_CLIENT_ID
    );

    if (
      window.document.body.clientWidth > 1200 &&
      !window.location.href.includes('localhost')
    ) {
      alert(
        '모바일 기기로 이용해주세요.\n뜰은 모바일 화면에 최적화 되어 있습니다.'
      );
    }

    initWebview();
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <DefaultSeo
        title={Title}
        description="뜰 - 예술을 향유하는 첫 걸음"
        openGraph={{
          title: Title,
          description: '뜰 - 예술을 향유하는 첫 걸음',
          type: 'website',
          locale: 'en_IE',
          url: process.env.NEXT_PUBLIC_HOST,
          site_name: '뜰',
          images: [
            {
              url: StaticUrls.Logo.Cover,
              width: 1041,
              height: 512,
              alt: '뜰',
            },
          ],
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/v1/kakao.min.js"
        crossOrigin="anonymous"
        onLoad={() => {
          setTimeout(() => {
            if (!window.Kakao.isInitialized()) {
              window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID);
            }
          }, 500);
        }}
      />

      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      </Head>

      <DdleContext.Provider
        value={{
          user,
          loading: userLoading,
          logout,
          setUserFromJwtOrClear,
          requestLogin,
          cart,
          addToCart,
          changeCart,
          removeCart,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
              ref={notistackRef}
              maxSnack={3}
              dense
              preventDuplicate
              autoHideDuration={3000}
              variant="success"
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              action={(key) => (
                <IconButton size="small" onClick={onClose(key)} sx={{ p: 0.5 }}>
                  <Iconify icon={'eva:close-fill'} />
                </IconButton>
              )}
            >
              <ConfirmProviderWithUI>
                <MoreConfirmProviderWithUI>
                  <Box sx={styles.component}>
                    <Component {...pageProps} />
                    <BottomMenu />
                  </Box>
                  {userLoading && (
                    <Box sx={styles.loader}>
                      <Loader />
                    </Box>
                  )}
                </MoreConfirmProviderWithUI>
              </ConfirmProviderWithUI>
            </SnackbarProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </DdleContext.Provider>
      <GoogleAnalytics trackPageViews />
    </CacheProvider>
  );
}

const styles = {
  component: {
    maxWidth: ScreenWidth,
    width: '100%',
    height: '100%',
    bottom: 0,
    margin: ScreenMargin,
    position: { xs: 'static', sm: 'relative' },
  },
  loader: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
