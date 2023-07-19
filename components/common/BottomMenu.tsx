import { useRouter } from 'next/router';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Image from 'components/Image';
import { bottomMenuWithLogin } from 'constants/bottomMenu';
import { useDdleContext } from 'contexts/Ddle';

// FIXME : 하단 공용 메뉴는 특정 Context(로그인 여부/페이지)에 따라 달라질 수 있음. 이 부분 고려해서 추후 수정 해야함
const BottomMenu = () => {
  const router = useRouter();
  const { user } = useDdleContext();

  const isHidden = ['/product/[id]'].includes(router.pathname);

  if (isHidden) {
    return null;
  }

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        onChange={(event, newValue) => {
          // FIXME : 단순 링크 페이지 이동인지, 컴포넌트간 이동인지 구조 결정에 따라 변경
          // setValue(newValue);

          // 메뉴 클릭시 해당하는 URL로 이동시킨다.
          const targetUrl = bottomMenuWithLogin[newValue].url;
          if (targetUrl === '/profile' && !user) {
            router.push('/login');
          } else {
            router.push(targetUrl);
          }
        }}
      >
        {bottomMenuWithLogin.map((menu) => (
          <BottomNavigationAction
            key={menu.title}
            label=""
            showLabel={false}
            disableRipple
            icon={
              <Image
                objectFit="cover"
                width="28px"
                height="28px"
                src={
                  // pathname이 url과 같으면 active 아이콘을 표시한다
                  (router.pathname === '/login' ||
                    router.pathname === '/join') &&
                  menu.url === '/profile'
                    ? menu.iconImg.active
                    : router.pathname == menu.url
                    ? menu.iconImg.active
                    : menu.iconImg.deactive
                }
                alt={menu.title}
              />
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomMenu;
