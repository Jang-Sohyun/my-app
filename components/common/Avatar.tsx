import { Stack, Avatar } from '@mui/material';
import Text from '@mui/material/Typography';
import { Artist } from '../../types/index';
import Link from 'next/link';

type Props = {
  avatar: Artist;
  secondaryText: string;
  rightComponent?: any | null;
};

const AvatarProfile = ({
  avatar: { id, name, profile, artist },
  secondaryText,
  rightComponent,
}: Props) => {
  const avatarUrl = artist
    ? artist.attributes.avatar.data?.attributes.url
    : profile;
  const avatarNickname = artist ? artist.attributes.nickname : name;
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      spacing={0.5}
    >
      {artist?.id || id ? (
        <Link href={artist ? `/artist/${artist.id}` : `/profile/${id}`}>
          <Avatar
            alt={avatarNickname}
            src={avatarUrl}
            sx={styles.writerAvatar}
          />
        </Link>
      ) : (
        <Avatar alt={avatarNickname} src={avatarUrl} sx={styles.writerAvatar} />
      )}

      <Stack sx={{ flex: 1 }}>
        <Text noWrap textOverflow="ellipsis" sx={styles.writerName}>
          {avatarNickname}
        </Text>
        <Text sx={styles.secondaryText} noWrap>
          {secondaryText}
        </Text>
      </Stack>
      {rightComponent}
    </Stack>
  );
};
const styles = {
  writerAvatar: {
    width: '40px',
    height: '40px',
    border: '1px solid #ddd',
  },
  writerName: {
    fontWeight: 700,
    marginLeft: '8px',
  },
  secondaryText: {
    marginLeft: '8px',
    color: '#c3c3c3',
    fontSize: '13px',
    maxWidth: '70%',
  },
};

export default AvatarProfile;
