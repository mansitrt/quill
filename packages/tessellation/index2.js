import Quill from '../quill/dist/quill';  // Import Quill
import '../quill/dist/dist/quill.snow.css';  // Optional: Import the default Quill theme CSS


const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ['clean'], // remove formatting button
  ];
// Your Quill initialization code
const quill = new Quill('#toolbar', {
    modules: {
        toolbar: {
          container: toolbarOptions,
        },
      },
      placeholder: 'Compose an epic...',
      theme: 'snow', // or 'bubble'
});