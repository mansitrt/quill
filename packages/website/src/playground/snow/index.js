//import Quill from '../../../../quill/src';

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

var placeHolderLanguage = 'Enter note content here';
var keyboardHeight = 0;
var isTabToEdit = null;
var isPlanNote = false;
var belowContentHeight = 0;

// Add fonts to whitelist
let Font = Quill.import('formats/font');
// We do not add Sans Serif since it is the default
Font.whitelist = [
  'TimesNewRoman',
  'Helvetica',
  'AppleChancery',
  'Papyrus',
  'Rockwell',
  'Optima',
  'Georgia',
];
Quill.register(Font, true);

var Size = Quill.import('attributors/style/size');
Size.whitelist = [
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '36px',
];
Quill.register(Size, true);

// set the default font size
const sizeSelect = document.getElementById('sizeSelect');
sizeSelect.value = '14px';

// set the default font name
const fontSelect = document.getElementById('fontSelect');
fontSelect.value = 'Optima';

Quill.register(
  {
    'modules/tableUI': quillTableUI.default,
  },
  true,
);

var snow = new Quill('#editor', {
  theme: 'snow',
  placeholder: `${placeHolderLanguage}`,
  modules: {
    table: true,
    tableUI: true,
    toolbar: '#toolbar',
  },
});

const table = snow.getModule('table');
const editorContainer = document.getElementById('editor-container');
const editor = document.getElementById('editor');

document.querySelector('#insert-table').addEventListener('click', function () {
  table.insertTable(2, 2);
});

// Called each time when text changes in the editor
const toolbar = document.getElementById('toolbar');
const toolbarWrapper = document.getElementById('toolbarWrapper');

let editorHeight = document.getElementById('editor').offsetHeight;
const selection = () => {
  if (window.getSelection) return window.getSelection();
};

snow.on('selection-change', function (range) {
  if (range) {
    if (range.start == range.end) {
      // window.webkit.messageHandlers.callbackHandler.postMessage(
      //   `Toolbar_Visible`,
      // );

      if (isTabToEdit) {
        document.getElementById('toolbar').style.display = 'block';
      }
    }
  }
});

document.addEventListener('scroll', (event) => {
  setTimeout(() => window.scrollTo(0, 0), 100);
});

function setupClickToScroll() {
  const parentDiv = document.getElementById('editor');

  if (!parentDiv) {
    console.error(`Div with id "${divId}" not found.`);
    return;
  }

  parentDiv.addEventListener('click', (event) => {
    // Check if the clicked element is a child of the parent div
    if (parentDiv.contains(event.target)) {
      const clickedElement = event.target;

      // If the clicked target is not the parent div itself
      if (clickedElement !== parentDiv) {
        // Set a timeout to scroll the clicked element into view after 3 seconds
        setTimeout(() => {
          clickedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center', // Center the element in the view
          });
        }, 300); // 3 seconds delay
      }
    }
  });
}
setupClickToScroll();

snow.on('text-change', function (delta, source) {
  sendContentToNativeApp();
});

function getQuillHtml() {
  return snow.root.innerHTML;
}

function sendContentToNativeApp() {
  try {
    let html = getQuillHtml();
    window.webkit.messageHandlers.callbackHandler.postMessage(html);
  } catch (err) {
    console.log('The native context does not exist yet');
  }
}

document.addEventListener('scroll', (event) => {
  window.scrollTo(0, 0);
});

setupClickToScroll = () => {
  const parentDiv = document.getElementById('editor');

  if (!parentDiv) {
    console.error(`Div with id "${divId}" not found.`);
    return;
  }

  parentDiv.addEventListener('click', (event) => {
    // Check if the clicked element is a child of the parent div
    if (parentDiv.contains(event.target)) {
      const clickedElement = event.target;

      // If the clicked target is not the parent div itself
      if (clickedElement !== parentDiv) {
        // Set a timeout to scroll the clicked element into view after 3 seconds
        setTimeout(() => {
          clickedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center', // Center the element in the view
          });
        }, 300); // 3 seconds delay
      }
    }
  });
};
setupClickToScroll();

function adjustForKeyboard(keyboardHeight) {
  const editor = document.getElementById('editor');

  // If keyboard is open, adjust the height of the editor
  if (keyboardHeight > 0) {
    editor.style.height = '200px';
  } else {
    editor.style.height = `calc(100vh - 80px)`;
  }
}

// function isToolbarFullyVisible() {
//   var $toolbar = $('#toolbar');
//   var toolbarTop = $toolbar.offset().top;
//   var toolbarBottom = toolbarTop + $toolbar.outerHeight();
//   var windowHeight = $(window).height();
//   return toolbarTop >= 0 && toolbarBottom <= windowHeight;
// }

// $(window).on('resize', function () {
//   if (isToolbarFullyVisible) {
//     // window.webkit.messageHandlers.callbackHandler.postMessage('Toolbar_Visible');
//   } else {
//     // window.webkit.messageHandlers.callbackHandler.postMessage('Toolbar_Not_Visible');
//   }
// });

$('#btnscrollToBottom').click(function () {
  const $editable = $('.ql-editor');
  const height = $editable[0].scrollHeight;

  console.log('scroll height: ', height);

  $editable.animate(
    {
      scrollTop: height,
    },
    500,
  );
});

$('#MakeUIWorkForEdit').click(function () {
  snow.root.scrollTop = 0;
});

function scrollToCursor() {
  var range = snow.getSelection();
  if (range) {
    var bounds = snow.getBounds(range.index, range.length);
    snow.root.scrollTop = bounds.top;
  }
}

$('#ScrollToCursorPosition').click(function () {
  scrollToCursor();
});

// function getTextOfRichTextEditorSave() {
//   snow.root.blur();
//   snow.enable(false);
//   return snow.root.innerHTML;
// }

function disabledRichTextContainer() {
  snow.enable(false);
  isTabToEdit = false;

  document.getElementById('toolbar').style.display = 'none';
  document.querySelector(
    '#editor-container .ql-container.ql-snow',
  ).style.height = '100%';
}

function enabledRichTextContainer() {
  isPlanNote = false;
  snow.enable(true);
  document.getElementById('toolbar').style.display = 'none';
  isTabToEdit = true;
  document.querySelector(
    '#editor-container .ql-container.ql-snow',
  ).style.height = '95%';
}

// function getTextOfRichTextEditorEdit() {
//   snow.enable(true);
//   const root = snow.root;
//   const selectionPosition = Math.round(root.scrollTop / (root.scrollHeight - root.clientHeight) * snow.getLength());
//   snow.setSelection(selectionPosition || 0);
//   document.getElementById('toolbar').style.display = 'block';

//   setTimeout(() => {
//     if(document.getElementById('toolbar').style.display != 'none') {
//       document.getElementById('editor').style.height = `${editorHeight + Number(belowContentHeight) - Number(keyboardHeight)}px`;
//     }
//     snow.focus();
//     toolbar.scrollIntoView();
//   }, 100)
// }

// async function setkeyboardScroll() {
//   const range = snow.getSelection();
//   await snow.blur();
//   await snow.setSelection(range.index, range.length);
//   await toolbar.scrollIntoView();
// }

// Call this function when the font and size values are received from Swift
// function setDefaults(fontName, fontSize) {
//   initializeEditor(fontName, fontSize);
// }

function changeThePlaceHolder(newPlaceholder) {
  snow.root.setAttribute('data-placeholder', `${newPlaceholder}`);
}
