
import twemoji from '<path_to_twemoji_module>';

function getTwemojiUrl(emoji, format) {
  let url = "";
  twemoji.parse(emoji, (icon) => {
    url = twemoji.base + (format === "svg" ? `svg/${icon}.svg` : `72x72/${icon}.png`);
    return false;
  });
  return url;
}

twemoji.base = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/13.0.1/";

