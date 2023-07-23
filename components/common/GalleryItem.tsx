import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { LikeIcon } from '../../components/svgIcons';
import { CheckCircleOutline, CheckCircle } from '@mui/icons-material';
import { useDdleContext } from '../../contexts/Ddle';
import Link from 'next/link';
import { apis } from '../../apis/index';

function GalleryItem({
  item,
  selectMode,
  onSelect,
  showMeta,
  selectedIdxes,
  isLikeable,
  onLike,
}: any) {
  const { id, attributes } = item;
  const thumbnailAttributes = attributes.thumbnails.data?.[0].attributes;
  const { like, isLiked } = apis.likingProduct.useLike(id);
  const { user, requestLogin } = useDdleContext();

  return (
    <Box key={id} sx={{ position: 'relative' }}>
      <Box sx={{ position: 'relative' }}>
        <Link href={`/product/${id}`}>
          <img
            src={
              thumbnailAttributes.formats.medium?.url || thumbnailAttributes.url
            }
            alt={id}
            loading="lazy"
            style={{
              borderRadius: 20,
              display: 'block',
              height: 'auto',
              minHeight: '100px',
              width: '95%',
              margin: 'auto',
              objectFit: 'cover',
            }}
          />
        </Link>

        {isLikeable && (
          <IconButton
            component="label"
            sx={{
              position: 'absolute',
              right: '12px',
              bottom: '6px',
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (user) {
                like();
                if (onLike) onLike();
              } else {
                requestLogin();
              }
            }}
          >
            <LikeIcon isLiked={isLiked} />
          </IconButton>
        )}
      </Box>
      {selectMode && (
        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            right: '4px',
            top: '4px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onSelect(index);
          }}
        >
          {selectedIdxes.includes(index) ? (
            <CheckCircle
              sx={{
                color: (theme) => theme.palette.secondary.light,
                borderRadius: 30,
              }}
            />
          ) : (
            <CheckCircleOutline
              sx={{
                color: '#efefef',
                borderRadius: 30,
                Background: '#cfcfcf',
              }}
            />
          )}
        </IconButton>
      )}
      {showMeta && (
        <Link href={`/artist/${attributes.artist.data?.id}`}>
          <Stack sx={styles.aditionalInfo} role="button">
            <Typography variant="caption" sx={styles.creator}>
              {attributes.artist.data?.attributes.nickname}
            </Typography>
            <Typography variant="caption" sx={styles.title}>
              {attributes.name}
            </Typography>
          </Stack>
        </Link>
      )}
    </Box>
  );
}

const styles = {
  galleryGuideMsg: {
    fontSize: '20px',
    fontWeight: 'bold',
    mt: 2.5,
    mb: 1,
    mx: 1,
  },
  gallery: {
    width: '100%',
  },
  aditionalInfo: {
    paddingLeft: '10px',
    marginTop: '8px',
    marginBottom: '8px',
    lineHeight: '1.1',
  },
  creator: {
    marginTop: '5px',
    fontWeight: 'bold',
  },
  title: {
    marginTop: '-5px',
  },
};
export default GalleryItem;
