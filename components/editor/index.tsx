import { ReactNode, useRef, useMemo, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import { apis } from 'apis/index';

// ----------------------------------------------------------------------

declare global {
  interface Window {
    hljs: any;
  }
}

hljs.configure({
  languages: ['javascript', 'jsx', 'sh', 'bash', 'html', 'scss', 'css', 'json'],
});

if (typeof window !== 'undefined') {
  window.hljs = hljs;
}

import { ReactQuillProps } from 'react-quill';
// next
import dynamic from 'next/dynamic';
// @mui
import { styled } from '@mui/material/styles';
import { Box, BoxProps, CircularProgress } from '@mui/material';
//
import EditorToolbar, { formats } from './EditorToolbar';
// import { uploadImage } from 'src/utils/files';

import AutoLinks from 'quill-auto-links';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');

    const { Quill } = RQ;
    Quill.register('modules/autoLinks', AutoLinks);
    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    ),
  }
);

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[400]}`,
  '& .ql-container.ql-snow': {
    borderColor: 'transparent',
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  '& .ql-editor': {
    minHeight: 200,
    maxHeight: 640,
    '&.ql-blank::before': {
      fontStyle: 'normal',
      color: theme.palette.text.disabled,
    },
    '& pre.ql-syntax': {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
    },
  },
}));

// ----------------------------------------------------------------------

export interface Props extends ReactQuillProps {
  id?: string;
  error?: boolean;
  simple?: boolean;
  helperText?: ReactNode;
  sx?: BoxProps;
  placeholder?: string;
  disabled?: boolean;
  disableToolbar?: boolean;
}

// const url = await uploadImage(file);

export default function Editor({
  id = 'minimal-quill',
  error,
  value,
  onChange,
  simple = false,
  helperText,
  sx,
  placeholder,
  disabled,
  disableToolbar,
  ...other
}: Props) {
  const quillRef = useRef<any | null>();
  const [loading, setLoading] = useState(false);

  const modules = useMemo(
    () => ({
      autoLinks: true,
      toolbar: {
        container: `#${id}`,
        handlers: {
          image: async () => {
            if (quillRef?.current) {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.click();
              input.onchange = async () => {
                if (input.files) {
                  const file: any = input.files[0];
                  if (file) {
                    try {
                      setLoading(true);
                      const { url } = await apis.upload(file);
                      // const url = await uploadImage(file);
                      if (quillRef.current) {
                        const range = quillRef.current.getEditorSelection();
                        quillRef.current
                          .getEditor()
                          .insertEmbed(range.index, 'image', url);
                      }
                    } catch (e) {
                      alert(e.message);
                    } finally {
                      setLoading(false);
                    }
                  }
                }
              };
            }
          },
        },
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
      syntax: true,
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  return (
    <RootStyle
      sx={{
        ...(error && {
          border: (theme) => `solid 1px ${theme.palette.error.main}`,
        }),
        ...sx,
      }}
    >
      <EditorToolbar
        id={id}
        isSimple={simple}
        disableToolbar={disableToolbar || disabled}
      />
      <ReactQuill
        forwardedRef={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write something'}
        {...other}
      />
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </RootStyle>
  );
}
