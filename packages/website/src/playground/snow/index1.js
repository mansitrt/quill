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

// Get the select element
const sizeSelect = document.getElementById('sizeSelect');

// Set the default value (e.g., "10px")
sizeSelect.value = '10px';
$('.ql-picker-label').first().addClass('ql-active');

// Get the select element
const fontSelect = document.getElementById('fontSelect');
// Set the default font value (e.g., "Optima")
fontSelect.value = 'Optima';
$('.ql-size .ql-picker-label').first().addClass('ql-active');

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

snow.on('text-change', function (delta, source) {
  sendContentToNativeApp();
  updateActiveClass();
});

let editorHeight = document.getElementById('editor').offsetHeight;
const selection = () => {
  if (window.getSelection) return window.getSelection();
};

snow.on('selection-change', function (range) {
  if (range) {
    if (range.start == range.end) {
      window.webkit.messageHandlers.callbackHandler.postMessage(
        `Toolbar_Visible`,
      );
      updateActiveClass();
      if (isTabToEdit) {
        document.getElementById('toolbar').style.display = 'block';
      }

      //document.getElementById('editor').style.height = '36%';
      toolbar.scrollIntoView();
      setTimeout(() => {
        if (document.getElementById('toolbar').style.display != 'none') {
          console.log('editorHeight :>> ', editorHeight);
          console.log('belowContentHeight :>> ', belowContentHeight);
          console.log('keyboardHeight :>> ', keyboardHeight);
          document.getElementById('editor').style.height =
            `${editorHeight + Number(belowContentHeight) - Number(keyboardHeight)}px`;
        }
        snow.focus();
        toolbar.scrollIntoView();
      }, 100);
    }
  } else {
    document.getElementById('editor').style = '';
    toolbar.scrollIntoView();
  }
});
// Return the HTML content of the editor
function getQuillHtml() {
  return snow.root.innerHTML;
}

// Send editor text to native app
function sendContentToNativeApp() {
  try {
    let html = getQuillHtml();
    window.webkit.messageHandlers.callbackHandler.postMessage(html);
  } catch (err) {
    console.log('The native context does not exist yet');
  }
}

$('.ql-editor').first().addClass('ql-font-Optima');
$('.ql-picker-label').first().addClass('ql-active');
$('.ql-size .ql-picker-label').first().addClass('ql-active');
$('.ql-editor').first().addClass('ql-fontSize-10');

// Manually add `ql-active` class based on the current font and size selection
function updateActiveClass() {
  const fontSelect = document.getElementById('fontSelect');
  const sizeSelect = document.getElementById('sizeSelect');
  const currentFont = snow.getFormat().font || 'Helvetica'; // Default font
  const currentSize = snow.getFormat().size || '12px'; // Default size

  // Update font select
  const fontOption = fontSelect.querySelector(`option[value="${currentFont}"]`);
  if (fontOption) {
    fontSelect.value = currentFont;
  }

  // Update size select
  const sizeOption = sizeSelect.querySelector(`option[value="${currentSize}"]`);
  if (sizeOption) {
    sizeSelect.value = currentSize;
  }

  // Manually add ql-active to the corresponding toolbar buttons
  document.querySelectorAll('.ql-picker-label').forEach((label) => {
    label.classList.remove('ql-active');
  });

  $('.ql-picker-label').first().addClass('ql-active');
  const activeSizeLabel = sizeSelect.querySelector(`.ql-picker-label`);
  if (activeSizeLabel) activeSizeLabel.classList.add('ql-active');
}

snow.root.addEventListener('focus', () => {
  updateActiveClass(); // Update active class when editor is focused
});

function adjustForKeyboard(keyboardHeight) {
  const toolbar = document.getElementById('toolbar');
  const editor = document.getElementById('editor');
  const editorContainer = document.getElementById('editor-container');
  const toolbarHeight = toolbar.offsetHeight;
  window.webkit.messageHandlers.callbackHandler.postMessage(
    window.innerHeight.toString(),
  );
  window.webkit.messageHandlers.callbackHandler.postMessage(
    editor.style.height.toString(),
  );
  // if keyboard is open
  if (keyboardHeight > 0) {
    editor.style.maxHeight = '40vh';
  } else {
    // Reset height when the keyboard is closed
    editor.style.height = '80vh';
  }
}

// Initial setup when the page loads
//  document.addEventListener('DOMContentLoaded', () => {
//     const availableHeight = (window.innerHeight - keyboardHeight - toolbarHeight) + 120;
//    editorContainer.style.height = `calc(100vh - ${toolbar.offsetHeight}px)`;
//    editor.style.height= `${availableHeight}px`;
//   editor.style.maxHeight = '180px';
//   });

function isToolbarFullyVisible() {
  var $toolbar = $('#toolbar');
  var toolbarTop = $toolbar.offset().top;
  var toolbarBottom = toolbarTop + $toolbar.outerHeight();
  var windowHeight = $(window).height();

  return toolbarTop >= 0 && toolbarBottom <= windowHeight;
}

$(window).on('resize', function () {
  if (isToolbarFullyVisible) {
    window.webkit.messageHandlers.callbackHandler.postMessage(
      'Toolbar_Visible',
    );
  } else {
    window.webkit.messageHandlers.callbackHandler.postMessage(
      'Toolbar_Not_Visible',
    );
  }
});

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

function disabledRichTextContainer() {
  snow.enable(false);
  isTabToEdit = false;

  document.getElementById('toolbar').style.display = 'none';
  //document.querySelector('#editor-container .ql-container.ql-snow').style.height = '100%';
}

function enabledRichTextContainer() {
  isPlanNote = false;
  snow.enable(true);
  document.getElementById('toolbar').style.display = 'none';
  isTabToEdit = true;
  //  document.querySelector('#editor-container .ql-container.ql-snow').style.height = '95%';
}

//function getTextOfRichTextEditorEdit() {
//  window.webkit.messageHandlers.callbackHandler.postMessage('Start edit');
//  snow.enable(true);
//   const root = snow.root;
//   const selectionPosition = Math.round(root.scrollTop / (root.scrollHeight - root.clientHeight) * snow.getLength());
//   snow.setSelection(selectionPosition || 0);
//   document.getElementById('toolbar').style.display = 'block';

//   setTimeout(() => {
//      if(document.getElementById('toolbar').style.display != 'none') {
//          document.getElementById('editor').style.height = `${editorHeight + Number(belowContentHeight) - Number(keyboardHeight)}px`;
//      }
//      snow.focus();
//       toolbar.scrollIntoView();
//    }, 100)
//  }

//   async function setkeyboardScroll() {
//       const range = snow.getSelection();
//       await snow.blur();
//       await snow.setSelection(range.index, range.length);
//await toolbar.scrollIntoView();
//   }

// START: set default font size
function onSelectDefaultFontSize(size) {
  //document.getElementById("sizeSelect").value = size;
  //snow.format("size", size);
  //const option = document.querySelector("#sizeSelect .ql-picker-label");
  //option.setAttribute("data-value", size);
  //option.setAttribute("data-label", size);
  //document.getElementById("firstElement")?.setAttribute('style',`font-size:${size}`);
}
// END: set default font size

// START: set default font family
function onSelectDefaultFontFamily(font) {
  // document.getElementById("fontSelect").value = font.replaceAll(" ","-");
  // snow.format("font", font.replaceAll(" ","-"));
  //const option = document.querySelector("#fontSelect .ql-picker-label");
  //option.setAttribute("data-value", font.replaceAll(" ","-"));
  // option.setAttribute("data-label", font);
  // document.getElementById("firstElement")?.classList?.add(`ql-font-${font.replaceAll(" ","-")}`);
}
// END: set default font family

function changeThePlaceHolder(newPlaceholder) {
  snow.root.setAttribute('data-placeholder', `${newPlaceholder}`);
}
