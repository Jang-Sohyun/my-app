import EditorToolbarStyle from './EditorToolbarStyle';

// ----------------------------------------------------------------------

const HEADINGS = [
  'Heading 1',
  'Heading 2',
  'Heading 3',
  'Heading 4',
  'Heading 5',
  'Heading 6',
];

export const formats = [
  'align',
  'background',
  'blockquote',
  'bold',
  'bullet',
  'code',
  'code-block',
  'color',
  'direction',
  'font',
  'formula',
  'header',
  'image',
  'indent',
  'italic',
  'link',
  'list',
  'script',
  'size',
  'strike',
  'table',
  'underline',
];

type EditorToolbarProps = {
  id: string;
  isSimple?: boolean;
  disableToolbar?: boolean;
};

export default function EditorToolbar({
  id,
  isSimple,
  disableToolbar,
  ...other
}: EditorToolbarProps) {
  return (
    <EditorToolbarStyle
      {...other}
      sx={disableToolbar ? { display: 'none' } : {}}
    >
      <div id={id}>
        <div className="ql-formats">
          <button type="button" className="ql-bold" />
          <button type="button" className="ql-underline" />
        </div>

        {!isSimple && (
          <div className="ql-formats">
            <select className="ql-color" />
            <select className="ql-background" />
          </div>
        )}

        <div className="ql-formats">
          <button type="button" className="ql-list" value="ordered" />
          <button type="button" className="ql-list" value="bullet" />
        </div>

        <div className="ql-formats">
          <select className="ql-align" />
          {/* <button type="button" className="ql-direction" value="rtl" /> */}
        </div>

        <div className="ql-formats">
          <button type="button" className="ql-link" />
          <button type="button" className="ql-image" />
        </div>

        {/* <div className="ql-formats">
          {!isSimple && <button type="button" className="ql-formula" />}
          <button type="button" className="ql-clean" />
        </div> */}
      </div>
    </EditorToolbarStyle>
  );
}
