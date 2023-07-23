import ScreenBox from '../../components/ScreenBox';
import PostTimeLine from '../../components/common/PostTimeLine';
import { apis } from '../../apis';
import { useRouter } from 'next/router';
import BasicAppBar from '../../components/common/BasicAppBar';

const Note = ({ note }: any) => {
  const router = useRouter();

  const { data: noteFromClientSide } = apis.artistNote.useGet(note.id);

  if (noteFromClientSide?.data) {
    note.attributes.commentCount =
      noteFromClientSide?.data?.attributes.commentCount;
    note.attributes.likingCount =
      noteFromClientSide?.data?.attributes.likingCount;
  }
  const artist = note.attributes.artist.data;
  const user = note.attributes.user.data;
  return (
    <>
      <ScreenBox footer sx={{ background: (theme) => theme.palette.grey[200] }}>
        <BasicAppBar
          title={artist ? artist.attributes.nickname : user.attributes.nickname}
          sx={{ background: (theme) => theme.palette.grey[200] }}
          onTitleClick={() => {
            if (artist) {
              router.push(`/artist/${artist.id}`);
            } else {
              router.push(`/profile/${user.id}`);
            }
          }}
        />

        <PostTimeLine items={[note]} detailMode />
      </ScreenBox>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const { id } = context.params;
    const { data: note } = await apis.artistNote.get(Number(id), {
      query: {
        populate: [
          'user',
          'user.avatar',
          'artist',
          'artist.avatar',
          'artist.user',
          'images',
          'product',
          'product.thumbnail',
        ],
      },
    });
    return {
      // Passed to the page component as props
      props: { note },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        error: e.message,
      },
    };
  }
}
export default Note;
