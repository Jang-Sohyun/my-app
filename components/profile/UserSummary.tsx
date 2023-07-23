import AvatarProfile from '../../components/common/Avatar';
import { Stack, Box, Typography as Text, Alert } from '@mui/material';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { User } from '../../types/index';
import { useRouter } from 'next/router';

type typeUserSummary = {
  user: User;
  onClickProfile: () => void;
};

const UserSummary = ({ user }: typeUserSummary) => {
  const router = useRouter();
  const onClickProfileDetail = () => {
    router.push('/profile/update');
  };
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={styles.userInfoContainer}
        onClick={onClickProfileDetail}
      >
        <Box sx={{ flex: 1 }}>
          <AvatarProfile
            avatar={{
              name: user.nickname,
              profile: user.avatar?.url,
            }}
            secondaryText={user.email}
          />
        </Box>
        <ChevronRightOutlinedIcon />
      </Stack>
      <Alert severity="info" sx={{ mt: 1, width: '100%' }}>
        <Text sx={{ fontSize: '12px' }}>
         작가 프로필 수정은 아래의 메뉴를 따라주세요.<br/><strong>하단의 작가 정보 -> 프로필 페이지</strong>
        </Text>
      </Alert>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-around"
        sx={styles.userSummaryContainer}
      >
        <Box
          onClick={() => {
            if (user.activitySummary.orderCount) {
              router.push('/profile/orders');
            }
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Text sx={styles.userSummaryCount}>
            {user.activitySummary.orderCount}
          </Text>
          <Text sx={styles.userSummarySubtext}>주문</Text>
        </Box>
        <Box
          onClick={() => {
            if (user.activitySummary.collectCount) {
              router.push('/profile/collectings');
            }
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Text sx={styles.userSummaryCount}>
            {user.activitySummary.collectCount}
          </Text>
          <Text sx={styles.userSummarySubtext}>컬렉팅</Text>
        </Box>
        <Box
          onClick={() => {
            if (user.activitySummary.favoriteCount) {
              router.push('/profile/favorites');
            }
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Text sx={styles.userSummaryCount}>
            {user.activitySummary.favoriteCount}
          </Text>
          <Text sx={styles.userSummarySubtext}>찜</Text>
        </Box>
      </Stack>
    </>
  );
};

const styles = {
  userInfoContainer: {
    width: '100%',
    px: '30px',
  },
  userSummaryContainer: {
    width: '84%',
    p: 2,
    m: 2,
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: 'rgb(0 0 0 / 12%) 0px 3px 8px',
  },
  userSummaryCount: {
    fontWeight: 800,
    fontSize: '20px',
  },
  userSummarySubtext: {
    color: '#bebebe',
    fontSize: '14px',
  },
};

export default UserSummary;
