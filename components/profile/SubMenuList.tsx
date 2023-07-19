import { ListSubheader, List } from '@mui/material';
import { useRouter } from 'next/router';
import { SubMenuListType } from 'types/index';
import SubMenuListItem from './SubMenuListItem';

const SubMenuList = ({ subHeaderText, menus }: SubMenuListType) => {
  const router = useRouter();

  return (
    <List
      sx={styles.menuList}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={<ListSubheader component="div">{subHeaderText}</ListSubheader>}
    >
      {menus.map((menu) => (
        <SubMenuListItem
          key={menu.pageName}
          label={menu.label}
          pageName={menu.pageName}
          onClick={() => {
            if (menu.onClick) menu.onClick();
            else {
              router.push(menu.pageName);
            }
          }}
        />
      ))}
    </List>
  );
};

const styles = {
  menuList: { width: '100%', maxWidth: 360, bgcolor: 'background.paper' },
};
export default SubMenuList;
