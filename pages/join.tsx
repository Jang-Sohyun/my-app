import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ScreenBox from '../components/ScreenBox';
import { Box } from '@mui/material';
import NextButton from '../components/NextButton';
import { JoinStep } from '../types/index';
import ServiceAgreement from '../components/join/ServiceAgreement';
import SmsAuth from '../components/join/SmsAuth';
import MemberJoin from '../components/join/MemberJoin';
import BasicAppBar from '../components/common/BasicAppBar';
import { apis } from '../apis/index';
import { useDdleContext } from '../contexts/Ddle';
import { useSnackbar } from 'notistack';

const initialAgreements = [
  {
    id: 1,
    isRequire: true,
    isChecked: false,
    label: '만 14세 이상입니다',
    url: '',
  },
  {
    id: 2,
    isRequire: true,
    isChecked: false,
    label: '서비스 이용약관에 동의',
    url: 'https://buttered-christmas-182.notion.site/f3b1bb27feb64fb1808219b2c9fd1cdf',
  },
  {
    id: 3,
    isRequire: true,
    isChecked: false,
    label: '개인정보 수집 이용에 동의',
    url: 'https://buttered-christmas-182.notion.site/19b1322878774422932f7df98acd63e4',
  },
  {
    id: 4,
    isRequire: true,
    isChecked: false,
    label: '온라인 경매 약관 동의',
    url: 'https://buttered-christmas-182.notion.site/ca52d500fe3d494fba95f5ec64ee54ba',
  },
  {
    id: 5,
    isRequire: false,
    isChecked: false,
    label: '홍보 및 마케팅 이용에 동의',
    url: 'https://buttered-christmas-182.notion.site/9ee40db1a597451fabc413f10b17c982',
  },
  {
    id: 6,
    isRequire: false,
    isChecked: false,
    label: '마케팅 개인정보 제3자 제공 동의',
    url: 'https://buttered-christmas-182.notion.site/3-c657de17519346f7995b24eecefc2fb5',
  },
];

const initialJoinStep: JoinStep = 'service_agreement';

const Join = () => {
  const router = useRouter();

  const [step, setStep] = useState(initialJoinStep); // 가입 단계
  const [agreements, setAgreements] = useState(initialAgreements); // 이용 약관
  const [isCheckAll, setIsCheckAll] = useState(false); // 이용약관 전체 동의 여부
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false); // 다음 버튼 활성화 여부
  const [smsAuthButtonEnabled, setSmsAuthButtonEnabled] = useState(false); // 핸드폰 번호 인증버튼 활성화 여부
  const [cellPhone, setCellphone] = useState(''); // 핸드폰 번호
  const [smsAuthKey, setSmsAuthKey] = useState(''); // SMS 인증 번호
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordConfirm, setUserPasswordConfirm] = useState('');
  const [userArtistNo, setUserArtistNo] = useState(''); // 입점 작가 번호
  const [requested, setRequested] = useState(false);
  const [loadingSms, setLoadingSms] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const ddle = useDdleContext();

  // 뒤로가기 버튼 클릭시 이전 단계 화면으로 이동한다.
  const onClickGoBack = () => {
    switch (step) {
      case 'service_agreement':
        // 로그인 페이지로 이동
        router.push('/login');
        break;
      case 'sms_auth':
        // 이용약관 페이지로 이동
        setStep('service_agreement');
        break;
      case 'member_join':
        // SMS 인증 페이지로 이동
        setStep('sms_auth');
        break;
      default:
        // 홈으로 이동
        router.push('/home');
        break;
    }
  };

  // 입력받은 핸드폰 번호의 유효성을 검증하고
  // 올바른 번호이면 인증받기 버튼을 활성화한다.
  const vailidateCellPhone = (phoneNumber: string) => {
    // 정규식 통과 패턴 예시 (01012345678)
    const patternPhone = new RegExp('01[016789][^0][0-9]{4}[0-9]{3,4}');

    if (!patternPhone.test(phoneNumber)) {
      setSmsAuthButtonEnabled(false);
      return;
    }

    setSmsAuthButtonEnabled(true);
  };

  // SMS 인증번호 발송 요청
  const callSmsAuth = async () => {
    try {
      setLoadingSms(true);
      enqueueSnackbar('인증번호가 발송되었습니다.');

      const result = await apis.user.requestSmsVerification({
        phone: cellPhone,
      });
      setRequested(true);

      // // TODO : SMS 인증번호 발송 API 호출
      // alert(
      //   '문자로 인증 번호를 발송하였습니다. 전달받은 인증번호를 입력해주세요.'
      // );
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingSms(false);
    }
  };

  // 모든 약관 동의 항목을 체크/체크해제 처리한다.
  const toggleCheckAll = (e: any) => {
    const checked = e.target.checked;
    setIsCheckAll(checked);

    const newAgreements = agreements.map((item) => {
      item.isChecked = checked;
      return item;
    });

    setAgreements(newAgreements);
  };

  // 해당하는 약관 동의 항목을 체크/체크해제 처리한다.
  const toggleCheck = (e: any, id: number) => {
    const newAgreements = agreements.map((item) => {
      if (item.id == id) {
        return { ...item, isChecked: e.target.checked };
      }
      return item;
    });

    setAgreements(newAgreements);
  };

  // 최종 회원 가입
  const joinMember = () => {
    // 회원 정보 입력 유효성 검사
    const validateUserInput = () => {
      // 이메일 유효성 검사
      const emailPattern = /\S+@\S+\.\S+/;
      if (!emailPattern.test(userEmail)) {
        alert('이메일 주소가 유효하지 않습니다.');
        return false;
      }

      // 아이디 유효성 검사 (영문, 숫자 4-10자리)
      const userIdPattern = /^[A-Za-z0-9]{4,10}$/;
      if (!userIdPattern.test(userId)) {
        alert('아이디는 영문, 숫자 포함 총 10자리까지 입력 가능합니다.');
        return false;
      }

      // 비밀번호와 비밀번호 확인 창 값이 같은지 검사
      if (userPassword !== userPasswordConfirm) {
        alert('입력하신 비밀번호가 일치하지 않습니다.');
        return false;
      }

      return true;
    };

    const isProceed = validateUserInput();

    if (isProceed) {
      // TODO : 회원가입 API 호출
      alert('TODO : 회원가입 AJAX Call');

      // 선택 약관 동의한 항목의 id를 담는다.(필수 약관 동의 여부은 DB에 쌓을 필요 없으므로 무시)
      const allowedAgreements = agreements.filter(
        (item) => item.isRequire == false
      );
      let allowedAgreementsIds: number[] = [];
      allowedAgreements.forEach((item) => {
        if (item.isChecked == true) {
          allowedAgreementsIds.push(item.id);
        }
      });

      router.replace('/');
      // 회원가입 API 요청시 보낼 데이터 예시
    }
  };

  // 화면 이동시 공통 실행되는 로직
  useEffect(() => {
    // 서비스 이용약관의 경우 필수 항목이 모두 체크 되어있으면
    // 다음 버튼을 활성화 시켜둔다.
    if (step == 'service_agreement') {
      const requireAgreements = agreements.filter(
        (item) => item.isRequire == true
      );
      const isEnabled = requireAgreements.every(
        (item) => item.isChecked == true
      );
      setNextButtonEnabled(isEnabled);
    } else {
      // 화면 이동시마다 다음 버튼 상태를 비활성화 한다.
      setNextButtonEnabled(false);
    }
  }, [step]);

  // 핸드폰 번호 변경시 유효성을 검증한다.
  useEffect(() => {
    vailidateCellPhone(cellPhone);
  }, [cellPhone]);

  // 입력받은 SMS 인증 번호가 유효한지 검증하고
  // 올바른 인증번호이면 다음 버튼을 활성화 한다.
  useEffect(() => {
    // 인증 요청을 보낸 상태이면서
    // 인증번호 6글자 모두 입력시에만 입력받은 인증키로 유효성 검사 API를 호출한다.
    if (smsAuthButtonEnabled && smsAuthKey.length == 6) {
      (async () => {
        try {
          const { data } = await apis.user.verifySmsCode({
            code: smsAuthKey,
            phone: cellPhone,
          });
          if (data.length > 0) {
            setNextButtonEnabled(true);
          } else {
            setNextButtonEnabled(false);
          }
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [smsAuthKey]);

  useEffect(() => {
    // 필수 약관 항목들이 모두 체크 되었는지 여부에 따라
    // 다음 버튼을 활성화/비활성화 시킨다.
    const requireAgreements = agreements.filter(
      (item) => item.isRequire == true
    );
    const isEnabled = requireAgreements.every((item) => item.isChecked == true);
    setNextButtonEnabled(isEnabled);

    // 약관 항목중 하나라도 체크 해지가 풀리면
    // 모두 동의 체크도 같이 체크 해지 한다.
    const isAllCheckboxChecked = agreements.every(
      (item) => item.isChecked == true
    );
    setIsCheckAll(isAllCheckboxChecked);
  }, [agreements]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (cellPhone === '00000000') {
      if (!requested) setRequested(true);
      if (smsAuthKey === '000000') {
        setNextButtonEnabled(true);
      }
    }
  }, [cellPhone, requested, smsAuthKey]);

  return (
    <ScreenBox>
      <BasicAppBar />

      <Box sx={styles.wrapper}>
        {
          /* 약관 동의 화면(service_agreement) */
          step == 'service_agreement' && (
            <>
              <ServiceAgreement
                isCheckAll={isCheckAll}
                agreements={agreements}
                onChangeCheckAll={toggleCheckAll}
                onChangeCheck={toggleCheck}
              />

              <NextButton
                disabled={!nextButtonEnabled}
                label="다음"
                onClick={() => setStep('sms_auth')}
              />
            </>
          )
        }

        {
          /* 휴대폰 인증 화면(sms_auth) */
          step == 'sms_auth' && (
            <>
              <SmsAuth
                authButtonEnabled={smsAuthButtonEnabled}
                authCompleted={nextButtonEnabled}
                cellPhone={cellPhone}
                onChangeCellphone={setCellphone}
                onClickSmsAuth={callSmsAuth}
                loadingSms={loadingSms}
                authKey={smsAuthKey}
                requested={requested}
                onChangeSmsAuthKey={setSmsAuthKey}
                disableCellPhone={requested}
                disableSmsKey={nextButtonEnabled}
              />
              <NextButton
                disabled={!nextButtonEnabled}
                label="다음"
                onClick={() => setStep('member_join')}
              />
            </>
          )
        }

        {
          /* 회원 정보 입력 화면(member_join) */
          step == 'member_join' && (
            <>
              <MemberJoin
                userId={userId}
                onChangeUserId={setUserId}
                artistNo={userArtistNo}
                onChangeUserArtistNo={setUserArtistNo}
              />
              <NextButton
                label={loadingSignUp ? '회원가입 진행 중' : '5초 회원가입 완료'}
                disabled={loadingSignUp}
                onClick={async () => {
                  try {
                    setLoadingSignUp(true);
                    const signUpData = {
                      signedUp: true,
                      agreeMarketing: agreements.find((o) => o.id === 5)
                        ?.isChecked,
                      agreeShareMarketing: agreements.find((o) => o.id === 6)
                        ?.isChecked,
                      nickname: userId,
                      phone: cellPhone,
                      artistNo: userArtistNo,
                    };
                    await apis.user.completeSignUp(signUpData);
                    // alert('회원가입 완료');
                    ddle.setUserFromJwtOrClear();
                    setTimeout(() => {
                      enqueueSnackbar('회원가입이 완료되었습니다.');
                      router.replace('/');
                    }, 1000);
                  } catch (e) {
                    alert(e.message);
                  } finally {
                    setLoadingSignUp(false);
                  }
                }}
              />
            </>
          )
        }
      </Box>
    </ScreenBox>
  );
};

const styles = {
  wrapper: {
    width: '85%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'left',
  },
};

export default Join;
