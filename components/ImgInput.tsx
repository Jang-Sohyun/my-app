import { apis } from 'apis/index';
import { Backdrop, Typography } from '@mui/material';
import { useState } from 'react';

export type ImageInputType = 'file' | 'dataURL' | 'raw' | 'serverUploaded';
type Props = {
  type: any;
  multiple?: boolean;
  onUpload: (data: any) => void;
};
const ImgInput = ({ type, onUpload, multiple }: Props) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <input
        hidden
        accept="image/*"
        type="file"
        multiple={multiple}
        onChange={async (e) => {
          try {
            setLoading(true);
            const files = e.target.files;
            if (!files || files.length === 0) return;
            const file = files?.[0];

            if (!type || type === 'raw') {
              onUpload?.(e);
            } else if (type === 'file') {
              if (multiple) onUpload?.(files);
              else onUpload?.(file);
            } else if (type === 'dataURL') {
              if (multiple) {
                const reader = new FileReader();
                const results = [];
                reader.addEventListener(
                  'load',
                  () => {
                    results.push(reader.result);
                    if (results.length === files.length) {
                      onUpload?.(results);
                    }
                  },
                  false
                );
                for (let i = 0; i < files.length; i++) {
                  reader.readAsDataURL(files[i]);
                }
              } else {
                const reader = new FileReader();

                reader.addEventListener(
                  'load',
                  () => onUpload?.(reader.result),
                  false
                );
                if (file) {
                  reader.readAsDataURL(file);
                }
              }
            } else if (type === 'serverUploaded') {
              if (multiple) {
                const results = await Promise.all(
                  Array.from(files).map((file) => apis.upload(file))
                );
                onUpload?.(results);
              } else {
                await apis.upload(file).then((r) => onUpload?.(r));
              }
            }
            e.target.value = '';
          } catch (e) {
            alert(e.message);
          } finally {
            setLoading(false);
          }
        }}
      />
      {loading && (
        <Backdrop open={loading} sx={{ zIndex: 100000000000 }}>
          <Typography sx={{ color: 'white', pointerEvents: 'none' }}>
            이미지 업로드 중
          </Typography>
        </Backdrop>
      )}
    </>
  );
};
export default ImgInput;
