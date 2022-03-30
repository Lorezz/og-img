import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text) => twemoji.parse(text, twOptions);

const tiempos = readFileSync(
  `${__dirname}/../_fonts/tiempos-headline-web-semibold.woff2`
).toString('base64');
const rglr = readFileSync(
  `${__dirname}/../_fonts/colfax-web-regular.woff2`
).toString('base64');
const bold = readFileSync(
  `${__dirname}/../_fonts/colfax-web-bold.woff2`
).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  'base64'
);

function getCss(theme, fontSize) {
  let background = 'white';
  let foreground = 'black';
  let font = 'Tiempos';
  let plusColor = '#BBB';

  if (theme === 'dark') {
    background = 'linear-gradient(135deg, #F6693D, #884290)';
    foreground = 'white';
    font = 'Colfax';
    plusColor = '#EEE';
  }

  return `
    @font-face {
      font-family: 'Tiempos';
      font-style:  normal;
      font-weight: normal;
      src: url(data:font/woff2;charset=utf-8;base64,${tiempos}) format('woff2');
    }

    @font-face {
      font-family: 'Colfax';
      font-style:  normal;
      font-weight: normal;
      src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
      font-family: 'Colfax';
      font-style:  normal;
      font-weight: bold;
      src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
      font-family: 'Vera';
      font-style: normal;
      font-weight: normal;
      src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
    }

    body {
      background: ${background};
      height: 100vh;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
    }

    code {
      color: #D400FF;
      font-family: 'Vera';
      white-space: pre-wrap;
      letter-spacing: -5px;
    }

    code:before, code:after {
      content: '\`';
    }

    .logo-wrapper {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      justify-items: center;
    }

    .logo {
      margin: 0 75px;
    }

    .plus {
      color: ${plusColor};
      font-family: Times New Roman, Verdana;
      font-size: 100px;
    }

    .spacer {
      margin: 150px;
    }

    .emoji {
      height: 1em;
      width: 1em;
      margin: 0 .05em 0 .1em;
      vertical-align: -0.1em;
    }

    .heading {
      font-family: '${font}', sans-serif;
      font-size: ${sanitizeHtml(fontSize)};
      font-style: normal;
      color: ${foreground};
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    ${
      theme === 'light' &&
      `
        strong {
          background-image: linear-gradient(120deg, #f4cf58 0%, #f4cf58 100%);
          background-repeat: no-repeat;
          background-size: 100% 0.4em;
          background-position: 0 88%;
          font-weight: inherit;
        }

        .heading {
          position: relative;
        }

        .heading:before {
          content: '';
          display: block;
          width: 40vw;
          z-index: -1;
          position: absolute;
          top: 0%;
          bottom: 0%;
          left: 50%;
          transform: translate(-50%, 0) skew(0deg, -10deg);
          background: linear-gradient(45deg, #f9ecfe, #fefae4);
        }
        `
    }
    `;
}

export function getHtml(parsedReq) {
  const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images
                  .map(
                    (img, i) =>
                      getPlusSign(i) + getImage(img, widths[i], heights[i])
                  )
                  .join('')}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
              md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src, width = 'auto', height = '180') {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i) {
  return i === 0 ? '' : '<div class="plus">+</div>';
}
