import React, { useState, useCallback } from 'react';

const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>();
  const resolver = React.useRef<((input: any) => void) | null | undefined>();
  const open = useCallback((data?: any) => {
    setIsOpen(true);
    setData(data);

    return new Promise((resolve) => {
      resolver.current = (input: any) => {
        resolve(input);
      };
    });
  }, []);
  const onClose = useCallback(() => {
    if (resolver.current) resolver.current(false);
    resolver.current = null;
    setIsOpen(false);
  }, []);
  const onConfirm = useCallback((input: any) => {
    if (resolver.current) resolver.current(input || true);
    resolver.current = null;
    setIsOpen(false);
  }, []);
  return {
    isOpen,
    data,
    open,
    onClose,
    onConfirm,
  };
};

export default useConfirmDialog;
