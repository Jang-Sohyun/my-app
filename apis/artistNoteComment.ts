import generateBaseRestApi from './generateBaseRestApi';

import { useDdleContext } from 'contexts/Ddle';
import { useState, useRef, useEffect } from 'react';

const apis = generateBaseRestApi('artist-note-comments');

interface UseCommentsParams {
  noteId: number;
  parent?: number | null;
  onlyCount?: boolean;
  disabledFetch?: boolean;
}
const useComments = ({
  noteId,
  parent,
  onlyCount,
  disabledFetch,
}: UseCommentsParams) => {
  const { user, requestLogin } = useDdleContext();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadComments = async (
    {
      noteId,
      page = 1,
      parent = null,
    }: { noteId?: number; page?: number; parent?: number } = {
      page: 1,
    }
  ) => {
    const { data: commentsData, meta } = await apis.getList({
      query: {
        populate: [
          'artist_note',
          'artist_note_comments',
          'user',
          'user.avatar',
          'reported_by',
          'parent',
          'user.artist',
          'user.artist.avatar',
        ],
        sort: {
          '0': 'createdAt',
        },
        pagination: {
          page,
          pageSize: 100,
        },
        filters: {
          artist_note: { id: { $eq: noteId } },
          parent: {
            id: parent
              ? { $eq: parent }
              : {
                  $null: true,
                },
          },
        },
      },
    });

    const pageCount = meta.pagination.pageCount;

    if (pageCount === 0) return [];
    else if (page === pageCount) return commentsData;
    else {
      return [
        ...commentsData,
        ...(await loadComments({ noteId, page: page + 1, parent })),
      ];
    }
  };
  useEffect(() => {
    if (noteId && !onlyCount && !disabledFetch) {
      (async () => {
        setLoading(true);
        try {
          const results = await loadComments({
            noteId,
            parent,
            page: 1,
          });
          setComments(results);
        } catch (e) {
          alert(e.message);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [noteId, parent, onlyCount, disabledFetch]);

  const {
    data: count,
    refetch: refetchCommentsCount,
    isLoading: loadingCommentsCount,
    isRefetching: refetchigCommentsCount,
  } = apis.useGetCount({
    query: {
      populate: '*',
      pagination: {
        pageSize: 1,
      },
      filters: {
        artist_note: {
          id: { $eq: noteId },
        },
        removed: {
          $ne: true,
        },
        parent: parent
          ? {
              id: { $eq: parent },
            }
          : undefined,
      },
    },
  });

  const create = async ({
    text,
    parent,
  }: {
    text: string;
    parent?: number | null;
  }) => {
    if (user) {
      if (text) {
        try {
          await apis.create({
            text,
            artist_note: noteId,
            user: user?.id,
            parent,
          });
          loadComments({
            noteId,
            parent,
          });
        } catch (e) {
          alert(e.message);
        }
      }
    } else {
      requestLogin();
    }
  };

  const refetch = async () => {
    refetchCommentsCount();
    setLoading(true);
    try {
      const results = await loadComments({
        noteId,
        parent,
        page: 1,
      });
      setComments(results);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };
  return {
    comments,
    create,
    count,
    refetch,
    loading,
  };
  // return {
  //   item,
  //   count,
  //   comments,
  // };
};

export default { ...apis, useComments };
