/* eslint-disable */
/* global daum */
import React, { useEffect, useRef } from 'react';
import Head from 'next/head';

export const TEST_IDS = {
  finder: 'finder',
  close: 'close',
};
export const DAUM_SCRIPT =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
export const CLOSE_IMG =
  'https://t1.daumcdn.net/postcode/resource/images/close.png';
const DaumAddressFinder = ({ open, onClose, onSubmit }) => {
  const daumZipCode = useRef();
  useEffect(() => {
    if (open) {
      const ele = daumZipCode.current;
      new daum.Postcode({
        oncomplete: function (data) {
          // 각 주소의 노출 규칙에 따라 주소를 조합한다.
          // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
          let addr = ''; // 주소 변수
          let extraAddr = ''; // 참고항목 변수

          //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
          if (data.userSelectedType === 'R') {
            // 사용자가 도로명 주소를 선택했을 경우
            addr = data.roadAddress;
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            addr = data.jibunAddress;
          }

          const submit = {
            addressDetail: '',
            address: '',
            zipCode: '',
          };

          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
          if (data.userSelectedType === 'R') {
            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== '' && data.apartment === 'Y') {
              extraAddr +=
                extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (extraAddr !== '') {
              extraAddr = ' (' + extraAddr + ')';
            }
            // 조합된 참고항목을 해당 필드에 넣는다.
            submit.addressDetail = extraAddr;
          } else {
            submit.addressDetail = '';
          }

          submit.zipCode = data.zonecode;
          submit.address = addr;

          onSubmit(submit);
          // iframe을 넣은 element를 안보이게 한다.
          // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
          onClose();
        },
        width: '100%',
        height: '100%',
        maxSuggestItems: 5,
      }).embed(ele);
    }
  }, [open]);
  return (
    <>
      <Head>
        {open ? (
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          ></meta>
        ) : (
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, user-scalable=1"
          ></meta>
        )}
        <script src={DAUM_SCRIPT}></script>
      </Head>
      <div
        data-testid={TEST_IDS.finder}
        ref={daumZipCode}
        style={{
          display: open ? 'block' : 'none',
          width: 'calc(100% - 32px)',
          height: 'calc(100vh - 60px)',
          maxWidth: '400px',
          maxHeight: '500px',
          paddingTop: '32px',
          borderRadius: 8,
          backgroundColor: '#fff',
          boxShadow: '0px 5px 8px 2px rgba(0,0,0,0.3)',
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'hidden',
          zIndex: 99999,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <img
          data-testid={TEST_IDS.close}
          src={CLOSE_IMG}
          id="btnCloseLayer"
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: 8,
            top: 8,
            borderRadius: 10,
            zIndex: 1,
          }}
          onClick={onClose}
          alt="닫기 버튼"
        />
      </div>
    </>
  );
};
export default DaumAddressFinder;
