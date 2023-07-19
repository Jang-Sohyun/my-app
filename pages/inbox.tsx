import { useRouter } from 'next/router';
import ScreenBox from 'components/ScreenBox';
import BottomMenu from 'components/common/BottomMenu';
import BasicAppBar from 'components/common/BasicAppBar';
import {
  Stack,
  Typography as Text,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import { pushLists } from 'constants/mockData';
import * as newStaticUrls from 'constants/staticUrls';
import Image from 'components/Image';

// 알림 메시지가 하나도 없을 때 안내 메시지 표시 컴포넌트
const EmptyInbox = () => (
  <Stack
    direction="column"
    justifyContent="center"
    alignItems="center"
    spacing={1}
    height="80vh"
  >
    <Image
      objectFit="cover"
      width="48px"
      height="48px"
      src={newStaticUrls.Background.InboxEmptyBackground}
      alt="Empty Inbox"
    />

    <Text sx={styles.noMessageText}>새로운 알림이 없어요</Text>
  </Stack>
);

const Inbox = () => {
  const router = useRouter();

  // 뒤로가기 버튼 클릭시 홈 화면으로 이동한다.
  const onClickGoBack = () => {
    router.push('/');
  };

  return (
    <>
      <ScreenBox>
        {/* 상단 메뉴 */}
        <BasicAppBar title="알림" />

        {Array.isArray(pushLists) && pushLists.length > 0 ? (
          <List dense={true} sx={styles.inboxList}>
            {pushLists.map((item) => (
              <ListItem sx={styles.inboxList}>
                <ListItemButton
                  sx={{ p: 0 }}
                  onClick={() => {
                    router.push('/');
                  }}
                >
                  <ListItemIcon>
                    {/* FIXME : 정의한 메시지 유형(item.type)에 맞게 아이콘 분기처리 (기획 스펙 정의 필요) */}
                    {/* TODO : 아이콘 이미지 받아서 교체 필요 */}
                    <MarkEmailUnreadOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.message}
                    secondary={item.createdTimeAgo}
                    secondaryTypographyProps={{ sx: styles.secondaryText }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <EmptyInbox />
        )}
      </ScreenBox>
    </>
  );
};

const styles = {
  inboxList: {
    pl: 2,
  },
  inboxListItem: {
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
  secondaryText: {
    color: 'rgb(195, 195, 195)',
    fontSize: '12px',
  },
  noMessageText: {
    color: '#c3c3c3',
    fontWeight: 600,
    marginTop: '15px !important',
  },
};
export default Inbox;
