import { useState, useEffect, useCallback } from 'react';

const useRefreshing = (refresh: () => Promise<any>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (refreshing) {
      (async () => {
        await refresh();
        setRefreshing(false);
      })();
    }
  }, [refreshing]);

  return { onRefresh, refreshing };
};

export default useRefreshing;
