import { useState } from 'react';
import ScreenBox from '../../components/ScreenBox';
import BasicAppBar from '../../components/common/BasicAppBar';
import NestedList from '../../components/profile/NestedList';
import AccountChanger from '../../components/AccountChanger';
import AddressChanger from '../../components/AddressChanger';
import BankAccountChanger from '../../components/BankAccountChanger';
import { Stack, Typography, Button, Avatar } from '@mui/material';
import { useDdleContext } from '../../contexts/Ddle';
import { apis } from '../../apis';
import { useContext as useConfirm } from '../../contexts/confirm';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

// 사용자 정보 데이터를 Nested List에 표시하기에 적합한 형식으로 변환한다.
// FIXME: API 응답 명세 정해지면 구체적으로 type 지정

const Profile = () => {
  const [accountChangerOpen, setAccountChangerOpen] = useState(false);
  const [bankAccountChangerOpen, setBankAccountChangerOpen] = useState(false);
  const [addressChangerOpen, setAddressChangerOpen] = useState(false);

  const { user, logout, setUserFromJwtOrClear } = useDdleContext();
  const [, confirm] = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const { data: deliveries, refetch: refetchDeliveries } =
    apis.delivery.useGetList(
      {
        query: {
          filters: {
            user: {
              id: {
                $eq: user?.id,
              },
            },
          },
        },
      },
      {
        enabled: Boolean(user),
      }
    );
  const { data: refundAccounts, refetch: refetchRefundAccounts } =
    apis.refundAccount.useGetList(
      {
        query: {
          filters: {
            user: {
              id: {
                $eq: user?.id,
              },
            },
          },
        },
      },
      {
        enabled: Boolean(user),
      }
    );

  const delivery = deliveries?.data[0];
  const refundAccount = refundAccounts?.data[0];

  return (
    <ScreenBox>
      <BasicAppBar title="프로필" />
      <Stack sx={{ width: '100%' }}>
        <NestedList
          subHeader={
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                pb: '13px',
              }}
            >
              <Stack
                sx={{ flex: 1 }}
                direction="row"
                alignItems="center"
                spacing={2}
              >
                <Typography sx={{ fontSize: 13 }}>계정 정보</Typography>
                <Avatar
                  src={user?.avatar?.url}
                  sx={{ width: '30', height: '30' }}
                />
              </Stack>
              <Button
                sx={{ fontWeight: 'bold' }}
                onClick={() => {
                  setAccountChangerOpen(true);
                }}
              >
                변경하기
              </Button>
            </Stack>
          }
          items={[
            {
              label: '이름',
              text: user?.nickname,
            },
            {
              label: '이메일',
              text: user?.email,
            },
            {
              label: '전화',
              text: user?.phone,
            },
          ]}
        />
        <NestedList
          subHeader={
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                pb: '13px',
              }}
            >
              <Typography sx={{ fontSize: 13, flex: 1 }}>
                배송지 정보
              </Typography>
              <Button
                sx={{ fontWeight: 'bold' }}
                onClick={() => {
                  setAddressChangerOpen(true);
                }}
              >
                변경하기
              </Button>
            </Stack>
          }
          items={[
            {
              label: '받는 분',
              text: delivery?.attributes.recipient || '없음',
            },
            {
              label: '연락처',
              text: delivery?.attributes.mobile || '없음',
            },
            {
              label: '배송 주소',
              text: delivery?.attributes.address || '없음',
            },
            {
              label: '배송 메모',
              text: delivery?.attributes.memo || '없음',
            },
          ]}
        />
        <NestedList
          subHeader={
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                pb: '13px',
              }}
            >
              <Typography sx={{ fontSize: 13, flex: 1 }}>환불 계좌</Typography>
              <Button
                sx={{ fontWeight: 'bold' }}
                onClick={() => {
                  setBankAccountChangerOpen(true);
                }}
              >
                변경하기
              </Button>
            </Stack>
          }
          items={[
            {
              label: '예금주',
              text: refundAccount
                ? `${refundAccount.attributes?.name} (${refundAccount.attributes?.bank} ${refundAccount.attributes?.account})`
                : '없음',
            },
          ]}
        />
        <Typography
          sx={{ fontSize: 13, pb: '26px', px: '20px' }}
          role="button"
          onClick={() => {
            confirm
              .open({
                title: '로그아웃?',
                body: '로그아웃 하시겠습니까?',
                buttons: [{ label: '취소' }, { label: '네', isDanger: true }],
              })
              .then(async (confirm) => {
                if (confirm === '네') {
                  logout();
                }
              });
          }}
        >
          로그아웃
        </Typography>
        <Typography
          sx={{ fontSize: 13, pb: '13px', px: '20px' }}
          role="button"
          onClick={() => {
            confirm
              .open({
                title: '회원탈퇴?',
                body: '회원탈퇴 하시겠습니까?',
                buttons: [{ label: '취소' }, { label: '네', isDanger: true }],
              })
              .then(async (confirm) => {
                if (confirm === '네') {
                  await apis.user.update({
                    id: user?.id,
                    exited: true,
                  });
                  logout();
                  enqueueSnackbar('탈퇴가 완료되었습니다.');
                }
              });
          }}
        >
          회원탈퇴
        </Typography>
      </Stack>

      <AccountChanger
        initialValues={{
          nickname: user?.nickname,
          avatar: user?.avatar,
          email: user?.email,
          phone: user?.phone,
        }}
        open={accountChangerOpen}
        onOpen={() => {
          setAccountChangerOpen(true);
        }}
        onClose={() => {
          setAccountChangerOpen(false);
        }}
        onSubmit={async ({ nickname, avatar }) => {
          confirm
            .open({
              title: '저장하시겠습니까?',
              buttons: [{ label: '취소' }, { label: '저장', isDanger: true }],
            })
            .then(async (confirm) => {
              if (confirm === '저장') {
                await apis.user.updateMe({
                  nickname,
                  avatar: avatar.id,
                });
                enqueueSnackbar('저장이 완료되었습니다.');
                setUserFromJwtOrClear();
                setAccountChangerOpen(false);
              }
            });
        }}
      />

      <AddressChanger
        initialValues={delivery}
        open={addressChangerOpen}
        onOpen={() => {
          setAddressChangerOpen(true);
        }}
        onClose={() => {
          setAddressChangerOpen(false);
        }}
        onSubmit={async ({ recipient, mobile: phone, address, memo }) => {
          confirm
            .open({
              title: '저장하시겠습니까?',
              buttons: [{ label: '취소' }, { label: '저장', isDanger: true }],
            })
            .then(async (confirm) => {
              if (confirm === '저장') {
                if (delivery) {
                  await apis.delivery.update({
                    id: delivery.id,
                    recipient,
                    mobile: phone,
                    address,
                    memo,
                  });
                  setUserFromJwtOrClear();
                  setAccountChangerOpen(false);
                } else {
                  await apis.delivery.create({
                    user: user?.id,
                    recipient,
                    mobile: phone,
                    address,
                    memo,
                  });
                }
                refetchDeliveries();
                enqueueSnackbar('저장이 완료되었습니다.');
              }
            });
        }}
      />
      <BankAccountChanger
        initialValues={refundAccount}
        open={bankAccountChangerOpen}
        onOpen={() => {
          setBankAccountChangerOpen(true);
        }}
        onClose={() => {
          setBankAccountChangerOpen(false);
        }}
        onSubmit={async ({ name, bank, account }) => {
          confirm
            .open({
              title: '저장하시겠습니까?',
              buttons: [{ label: '취소' }, { label: '저장', isDanger: true }],
            })
            .then(async (confirm) => {
              if (confirm === '저장') {
                if (refundAccount) {
                  await apis.refundAccount.update({
                    id: refundAccount.id,
                    name,
                    bank,
                    account,
                  });
                  setUserFromJwtOrClear();
                  setBankAccountChangerOpen(false);
                } else {
                  await apis.refundAccount.create({
                    user: user?.id,
                    name,
                    bank,
                    account,
                  });
                }
                refetchRefundAccounts();
                enqueueSnackbar('저장이 완료되었습니다.');
              }
            });
        }}
      />
    </ScreenBox>
  );
};
export default Profile;
