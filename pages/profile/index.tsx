import { useState, useEffect } from 'react';
import BottomMenu from 'components/common/BottomMenu';
import { myActivityMenus, customerSupportMenus } from 'constants/submenu';
import { useRouter } from 'next/router';
import ScreenBox from 'components/ScreenBox';
import TopHeader from 'components/common/TopHeader';
import SubMenuList from 'components/profile/SubMenuList';
import UserSummary from 'components/profile/UserSummary';
import { useDdleContext } from 'contexts/Ddle';
import { apis } from 'apis';
import { Stack } from '@mui/material';
import ArtistEnroller from 'components/ArtistEnroller';
import { useContext as useConfirm } from 'contexts/confirm';
import { useSnackbar } from 'notistack';

const Profile = () => {
  const router = useRouter();
  const { user, loading, setUserFromJwtOrClear } = useDdleContext();
  const [artistEnrollerOpen, setArtistEnrollerOpen] = useState(false); // 작가 신청 모달 오픈 여부
  const [, confirm] = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const orderResult = apis.order.useGetCount(
    {
      query: {
        filters: {
          user: {
            id: {
              $eq: user?.id,
            },
          },
          isPaid: {
            $eq: true,
          },
        },
      },
    },
    {
      enabled: Boolean(user),
    }
  );

  const collectionResult = apis.collection.useGetCount(
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

  const likeResult = apis.likingProduct.useGetCount(
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

  useEffect(() => {
    if (router.isReady && !loading && !user) {
      router.replace('/login');
    }
  }, [router.isReady, loading, user]);
  return (
    <ScreenBox footer>
      {Boolean(user) && (
        <>
          <TopHeader
            title="프로필"
            showSearch={false}
            showNotification={false}
            showLogo={false}
          />

          {/* 상단 프로필 요약 */}
          <UserSummary
            user={{
              ...user,
              activitySummary: {
                orderCount: orderResult.data || 0, // 주문 개수
                collectCount: collectionResult.data || 0, // 컬렉팅 개수
                favoriteCount: likeResult.data || 0, // 찜 개수
              },
            }}
          />

          {/* 하위 메뉴 리스트 */}
          {user.artist && (
            <SubMenuList
              subHeaderText="작가 정보"
              menus={[
                {
                  label: <Stack>프로필 페이지</Stack>,
                  pageName: '/profile/artist',
                },
                {
                  label: <Stack>이력</Stack>,
                  pageName: '/profile/info-update',
                },
                {
                  label: <Stack>규정</Stack>,
                  pageName: '/profile/rule-update',
                },
                {
                  label: <Stack>판매 작품</Stack>,
                  pageName: '/profile/sales',
                },
                {
                  label: <Stack>문의 답변하기</Stack>,
                  pageName: '/profile/product-inqueries',
                },
              ]}
            />
          )}
          <SubMenuList subHeaderText="나의 활동" menus={myActivityMenus} />
          <SubMenuList
            subHeaderText="고객 지원"
            menus={
              user.artist
                ? customerSupportMenus
                : [
                    ...customerSupportMenus,
                    {
                      label: '작가 신청',
                      onClick: () => {
                        setArtistEnrollerOpen(true);
                      },
                    },
                  ]
            }
          />
          {user?.isAdmin ? (
            <SubMenuList
              subHeaderText="관리자"
              menus={[
                {
                  label: '주문 내역',
                  pageName: '/admin/orders',
                },
              ]}
            />
          ) : null}
        </>
      )}
      <ArtistEnroller
        open={artistEnrollerOpen}
        onOpen={() => {
          setArtistEnrollerOpen(true);
        }}
        onClose={() => {
          setArtistEnrollerOpen(false);
        }}
        onSubmit={async ({ code }) => {
          if (code) {
            confirm
              .open({
                title: `작가를 신청합니까?`,
                buttons: [{ label: '취소' }, { label: '신청', isDanger: true }],
              })
              .then(async (confirm) => {
                if (confirm === '신청') {
                  const res = await apis.artist.getList({
                    query: {
                      filters: {
                        code: {
                          $eq: code,
                        },
                        user: {
                          id: {
                            $null: true,
                          },
                        },
                      },
                    },
                  });
                  if (res.data.length === 0) {
                    alert('존재하지 않는 코드입니다.');
                    return;
                  }
                  const artist = res.data[0];
                  await apis.artist.update({
                    id: artist.id,
                    user: user.id,
                  });
                  setUserFromJwtOrClear();
                  enqueueSnackbar('신청이 완료되었습니다.');
                  router.push('/profile/artist');
                }
              });
          }
        }}
      />
    </ScreenBox>
  );
};
export default Profile;
