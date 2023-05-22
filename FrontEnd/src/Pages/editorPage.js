import ReactQuill from "react-quill";

export default function Editor({ value, onChange }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link'],
    ],
  };

  return (
    <div className="content">
      <ReactQuill
        value={value}
        theme="snow"
        placeholder="Small summary here..."
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
}

