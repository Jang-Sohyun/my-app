import ScreenBox from '../../components/ScreenBox';
import BottomMenu from '../../components/common/BottomMenu';
import PostTimeLine from '../../components/common/PostTimeLine';
import { commuinityCategoryTabs } from '../../constants/category';
import CreateFab from '../../components/CreateFab';
import { apis } from '../../apis';
import { useRouter } from 'next/router';
import { useDdleContext } from '../../contexts/Ddle';
import ReviewItem from '../../components/ReviewItem';
import { Stack } from '@mui/material';
import BasicAppBar from '../../components/common/BasicAppBar';

const Note = ({ review }: any) => {
  return (
    <>
      <ScreenBox footer sx={{ background: (theme) => theme.palette.grey[200] }}>
        <BasicAppBar
          title={'리뷰 상세'}
          sx={{ background: (theme) => theme.palette.grey[200] }}
        />

        <Stack sx={{ width: '100%' }} spacing={3}>
          <ReviewItem item={review} showDetail />
        </Stack>
      </ScreenBox>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const { id } = context.params;
    const { data: review } = await apis.review.get(Number(id), {
      query: {
        populate: ['product', 'product.thumbnails', 'user'],
        sort: ['createdAt:DESC'],
        filters: {
          user: {
            id: {
              $eq: id,
            },
          },
        },
      },
    });
    return {
      // Passed to the page component as props
      props: { review },
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
