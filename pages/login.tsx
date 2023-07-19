import Text from '@mui/material/Typography';
import ScreenBox from 'components/ScreenBox';
import Image from 'components/Image';
import { Stack, ButtonBase, Box, Link, Typography } from '@mui/material';
import * as newStaticUrls from 'constants/staticUrls';
import { CS_MAIL } from 'constants/service';
import { initiateSignIn as onClickAppleLogin } from 'libs/apple';
import { initiateSignIn as onClickGoogleLogin } from 'libs/google';
import { AppleIcon, KakaoIcon } from 'components/svgIcons';
import * as webview from 'libs/webview';
import { useEffect, useState } from 'react';

const Login = () => {
  const [platform, setPlatform] = useState<'webview' | 'web' | 'pending'>(
    'pending'
  );
  useEffect(() => {
    if (platform === 'pending') {
      setPlatform(webview.isWebView() ? 'webview' : 'web');
    }
  }, [platform]);

  return (
    <ScreenBox sx={styles.container}>
      <Box sx={styles.logoWrapper}>
        <Image
          objectFit="contain"
          width="193px"
          height="65px"
          src={newStaticUrls.Background.MainBackground}
          alt="Main Background Image"
        />
      </Box>

      <Stack
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          flex: 1,
          pt: 4,
        }}
        alignItems="center"
      >
        <Stack spacing={2} sx={styles.loginContainer} alignItems="center">
          <ButtonBase
            onClick={async () => {
              window.Kakao.Auth.authorize({
                redirectUri: `${process.env.NEXT_PUBLIC_HOST}/api/connect/kakao/redirect`, // `${process.env.NEXT_PUBLIC_BACKEND_API}/api/connect/kakao/callback`,
                state: '',
                scope: 'account_email',
                serviceTerms: '',
                isPopup: Boolean(webview.getKakaoSignInPopUp()),
              });
            }}
            sx={{
              background: '#FEE500',
              color: '#000',
              justifyContent: 'flex-start',
              borderRadius: '6px',
              height: '40px',
              fontSize: '14px',
              position: 'relative',
              width: '300px',
            }}
          >
            <KakaoIcon sx={{ ml: '8px', width: '34px', height: 'auto' }} />
            <Typography
              sx={{
                left: '6px',
                right: 'auto',
                textAlign: 'center',
                position: 'absolute',
                width: '100%',
              }}
            >
              Kakao로 로그인
            </Typography>
          </ButtonBase>
          <ButtonBase
            onClick={async () => {
              if (platform === 'webview') {
                webview.appleSignIn();
              } else {
                await onClickAppleLogin();
              }
            }}
            sx={{
              background: '#000',
              color: '#fff',
              justifyContent: 'flex-start',
              height: '40px',
              borderRadius: '6px',
              fontSize: '14px',
              position: 'relative',
              width: '300px',
            }}
          >
            <AppleIcon
              sx={{ ml: '16px', width: '16px', pb: '2px', height: 'auto' }}
            />
            <Typography
              sx={{
                left: '6px',
                right: 'auto',
                textAlign: 'center',
                position: 'absolute',
                width: '100%',
              }}
            >
              Apple로 로그인
            </Typography>
          </ButtonBase>
          <ButtonBase
            onClick={() => {
              if (platform === 'webview') {
                webview.googleSignIn();
              } else {
                onClickGoogleLogin();
              }
            }}
            sx={{
              color: '#000',
              border: (theme) => `1px solid ${theme.palette.grey[300]}`,
              justifyContent: 'flex-start',
              borderRadius: '6px',
              height: '40px',
              fontSize: '14px',
              position: 'relative',
              width: '300px',
            }}
          >
            <Box
              component="img"
              sx={{ ml: '16px', width: '16px', height: '16px' }}
              src="/images/icons/google.png"
            />
            <Typography
              sx={{
                left: '6px',
                right: 'auto',
                textAlign: 'center',
                position: 'absolute',
                width: '100%',
              }}
            >
              Google로 로그인
            </Typography>
          </ButtonBase>
        </Stack>

        <Stack direction="row" spacing={5} mt={3} sx={{ fontSize: 14 }}>
          <Link
            onClick={() => {
              window.location.href = `mailto:${CS_MAIL}`;
            }}
            color="inherit"
            underline="hover"
          >
            로그인 문의
          </Link>
        </Stack>
      </Stack>
    </ScreenBox>
  );
};

const styles = {
  logoWrapper: {
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  logoImage: {
    marginTop: '2px',
  },
  loginContainer: {
    width: '80%',
  },
  loginInput: {
    border: '1px solid #ddd',
    borderRadius: '40px',
    height: '34px',
    padding: '20px',
    '&::before': {
      display: 'none',
    },
    '&::after': {
      display: 'none',
    },
  },
  loginInputText: {
    textAlign: 'center',
  },
  logoText: {
    fontSize: '20px',
    whiteSpace: 'pre-line',
  },
  loginButtonText: {
    color: '#797979',
    fontSize: '17px',
    textDecoration: 'underline',
  },
  container: {
    pb: 10,
  },
};

export default Login;
