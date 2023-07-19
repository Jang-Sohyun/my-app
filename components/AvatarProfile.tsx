import { Avatar, Typography as Text, Stack } from '@mui/material';
import { EmptyImg } from 'constants/empty';

type Props = {
  avatar?: string | null;
  avatarSx?: any;
  nameBoxSx?: any;
  name?: string;
  nameSx?: any;
  subName?: string;
  subNameSx?: any;
  sx?: any;
};
const AvatarProfile = (props: Props) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={props.sx}>
    {Object.hasOwn(props, 'avatar') ? (
      <Avatar
        alt={props.name}
        src={props.avatar || EmptyImg}
        sx={[styles.influencerAvatar, props.avatarSx]}
      />
    ) : null}
    <Stack sx={props.nameBoxSx}>
      <Text
        noWrap
        textOverflow="ellipsis"
        sx={[styles.influencerName, props.nameSx]}
      >
        {props.name}
      </Text>
      <Text noWrap textOverflow="ellipsis" sx={[props.subNameSx]}>
        {props.subName}
      </Text>
    </Stack>
  </Stack>
);
const styles = {
  influencerAvatar: {
    width: '18px',
    height: '18px',
    border: '1px solid #dddddd',
  },
  influencerName: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export default AvatarProfile;
