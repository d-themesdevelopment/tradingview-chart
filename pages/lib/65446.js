

import { getClipboard } from 'some-library'; // Replace 'some-library' with the actual library you're using

function writeImpl(data, event) {
  const hasFiles = data.files && data.files.length > 0;

  if (!hasFiles && event && event.eventPhase > 0) {
    preventAndSetData(event, data);
    return Promise.resolve();
  }

  if (!hasFiles) {
    let preventDefault = false;

    const copyEventHandler = (e) => {
      e.stopImmediatePropagation();
      preventAndSetData(e, data);
      preventDefault = true;
    };

    try {
      document.addEventListener('copy', copyEventHandler, true);
      document.execCommand('copy');
    } finally {
      document.removeEventListener('copy', copyEventHandler, true);
    }

    if (preventDefault) {
      return Promise.resolve();
    }
  }

  return writeUsingClipboardApi(data);
}

function preventAndSetData(event, data) {
  event.preventDefault();
  const clipboardData = event.clipboardData;
  if (data.text) {
    clipboardData.setData('text/plain', data.text);
  }
  if (data.html) {
    clipboardData.setData('text/html', data.html);
  }
}

async function writeUsingClipboardApi(data) {
  const clipboard = getClipboard();

  if (!clipboard || !clipboard.write || !window.ClipboardItem) {
    throw new DOMException('ClipboardApi is not supported', 'NotSupportedError');
  }

  const clipboardItems = {};
  if (data.files) {
    for (const file of data.files) {
      clipboardItems[file.type] = file;
    }
  }
  if (data.text) {
    clipboardItems['text/plain'] = data.text;
  }
  if (data.html) {
    clipboardItems['text/html'] = data.html;
  }

  return clipboard.write([new window.ClipboardItem(clipboardItems)]);
}

async function writePromiseUsingApi(data, type) {
  const clipboard = getClipboard();

  if (type === 'text/plain' && !clipboard.write) {
    const text = await data;
    return clipboard.writeText(await text.text());
  }

  if (!clipboard || !clipboard.write || !window.ClipboardItem) {
    throw new DOMException('ClipboardApi is not supported', 'NotSupportedError');
  }

  let clipboardItem = null;

  try {
    clipboardItem = new window.ClipboardItem({
      [type]: data
    });
  } catch (error) {
    clipboardItem = new window.ClipboardItem({
      [type]: await data
    });
  }

  if (clipboardItem) {
    return clipboard.write([clipboardItem]);
  }

  throw new Error('ClipboardApi is not supported');
}

export {
  writeImpl,
  writePromiseUsingApi
};
