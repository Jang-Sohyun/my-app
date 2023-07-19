import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import decodeJwt from 'jwt-decode';
import qs from 'qs';

// Apple Response
// {
//   state: '[STATE]',
//   code: 'c8562a0047fde40ab924f48818f56c360.0.rzqz.kIz6sjJ8H33knBP-FV-GcQ',
//   id_token: 'eyJraWQiOiJZdXlYb1kiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmFydGRkbGUuc2VydmljZS5wcm9kIiwiZXhwIjoxNjc2Mjc0NjU2LCJpYXQiOjE2NzYxODgyNTYsInN1YiI6IjAwMDkwOS5lMzYwNTAyM2NkZTM0YzIwOThkZTAzY2I1NWUxOWNiMC4wNzIzIiwibm9uY2UiOiJbTk9OQ0VdIiwiY19oYXNoIjoieUNyVFcyc1ptdElocGN6M0IxV3FYUSIsImVtYWlsIjoiaHBqbTI4ejR0d0Bwcml2YXRlcmVsYXkuYXBwbGVpZC5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJpc19wcml2YXRlX2VtYWlsIjoidHJ1ZSIsImF1dGhfdGltZSI6MTY3NjE4ODI1Niwibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.JkAdcC53DG3VHdEYDqy4jzmaxvXEiyZ-V6wlOxsbb_JTaDc0ujqDQ67FmaN7TOgYAeuwqm_b2lHN4XJw5o166NyL5FmuxsQoePV5bXdH0rCMBukifIZhgZs13KZg7G98wwZ_IDAosE4elzlRoaTmMbx1pEDzDqKaARcFluxRcqaXL9-jqH9DUd6F0mEUFUld_-aH5NmWHPDdaYxyqu7zfBUODKNgWm2HefQS5sSPIkLicrV5yoHiEyoA1CrBlav6geilB3iS43bZKe4_DgWpZyM8gIdy7hjIaTx6auMM2xHSFwVF9MABTJl5mwwKYngZgESnzYunNjn8GATWBijtZg',
//   user: '{"name":{"firstName":"Kiyeop","lastName":"Yang"},"email":"hpjm28z4tw@privaterelay.appleid.com"}'
// }
const KAKAO_AUTH_HOST = 'https://kauth.kakao.com';
const KAKAO_API_HOST = 'https://kapi.kakao.com';

const getUserByEmail = async (email: string) => {
  try {
    const {
      data: [signedUser],
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/users?${qs.stringify({
        filters: {
          email: {
            $eq: email,
          },
        },
      })}`
    );
    return signedUser;
  } catch (e) {
    return null;
  }
};

const getUsernameInEmail = (email: string) => {
  const [username] = email.split('@');
  return username;
};
type TokenKeys = 'google_token' | 'kakao_token' | 'apple_token';

const startLoginProcess = async (params: {
  sub: string;
  email: string;
  tokenKey: TokenKeys;
}) => {
  const { sub, email, tokenKey } = params;
  // 기존 가입 유저 확인
  const signedUser = await getUserByEmail(email);

  // 이메일 존재하나 구글 로그인 아닌 경우 에러
  if (signedUser) {
    if (!signedUser[tokenKey]) {
      throw new Error('이미 다른 방법으로 로그인 한 회원입니다.');
    }
    // 가입된 유저가 있을 경우 로그인
    const oauthRes = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/local`,
      {
        identifier: email,
        password: sub,
      }
    );
    return oauthRes.data;
  } else {
    // 가입된 유저가 없을 경우 회원가입
    const { data: signupRes } = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/local/register`,
      {
        username: getUsernameInEmail(email),
        email,
        password: sub,
        [tokenKey]: sub,
      }
    );
    return signupRes;
  }
  throw new Error('알 수 없는 에러');
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  // Get data from your database
  // STRAPI_BACKEND_URL/api/auth/${provider}/callback
  const { provider, ...queries } = req.query;

  try {
    let data: any;

    if (provider === 'google') {
      const { token } = req.query;
      const { data: googleUser } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
      );
      const { sub, email } = googleUser;
      data = await startLoginProcess({
        sub,
        email,
        tokenKey: 'google_token',
      });
    } else if (provider === 'apple') {
      // 애플 로그인
      const id_token = req.body.id_token || req.query.id_token;

      const { sub, email } = decodeJwt(id_token) as any;
      data = await startLoginProcess({
        sub,
        email,
        tokenKey: 'apple_token',
      });
    } else if (provider === 'kakao') {
      // 카카오 로그인

      // 엑세스 토큰 받기
      const oauthRes = await axios.post(
        `${KAKAO_AUTH_HOST}/oauth/token`,
        qs.stringify({
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_REST_KEY,
          code: req.query.code,
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      );
      const access_token = oauthRes.data.access_token;

      // 카카오 유저 정보 조회
      const { data: kakaoUser } = await axios.get(
        `${KAKAO_API_HOST}/v2/user/me`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const {
        id,
        kakao_account: { email },
      } = kakaoUser;
      const kakaoId = String(id);

      // 가입된 유저 확인
      const signedUser = await getUserByEmail(email);

      if (signedUser) {
        if (!signedUser.kakao_token) {
          // 가입된 유저가 있으나 카카오 로그인이 아닐 경우 에러
          return res.redirect(
            302,
            '/?err=' +
              encodeURIComponent('이미 다른 방법으로 로그인 한 회원입니다.')
          );
        }
        try {
          // 임시 코드 시작
          // 현재 기존 카카오 로그인으로 가입한 유저들의 계정 데이터를 강제로 업데이트
          await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/${signedUser.id}`,
            {
              provider: 'local',
              password: kakaoId,
              kakao_token: kakaoId,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.SERVER_API_KEY}`,
              },
            }
          );
          // 임시 코드 종료
        } catch (e) {
          console.log(e.message, e.response.data);
          return res.redirect(302, '/login');
        }

        // 가입된 유저가 있을 경우 로그인
        const oauthRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/local`,
          {
            identifier: email,
            password: kakaoId,
          }
        );
        data = oauthRes.data;
      } else {
        // 가입된 유저가 없을 경우 회원가입
        const oauthRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/local/register`,
          {
            username: getUsernameInEmail(email),
            email,
            password: kakaoId,
            kakao_token: kakaoId,
          }
        );
        data = oauthRes.data;
      }
    } else {
      throw new Error('잘못된 Provider');
    }

    // 위 프로세스에서 최종 반환 값은 user와 jwt
    const { jwt, user } = data;

    if (user.exited) {
      // 탈퇴
      return res.redirect(
        302,
        '/?err=' +
          encodeURIComponent('탈퇴한 회원입니다. 관리자에게 문의하여주세요.')
      );
    } else if (user.signedUp) {
      // 기본 가입 프로세스 진행 완료시
      return res.redirect(302, '/?jwt=' + jwt);
    } else {
      // 최초 가입시
      return res.redirect(302, '/join?jwt=' + jwt);
    }
  } catch (e) {
    console.error(e);
    console.error(e.message);

    return res.redirect(302, '/?err=' + encodeURIComponent(e.message));
  }
}
