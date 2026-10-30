// Approved artwork is displayed through CSS viewports, leaving source images intact.
const sheet = (file, size, rect) => ({ file: new URL(`./assets/${file}`, import.meta.url).href, size, rect });
export const art = {
 shiningwood: {
  xray: sheet('shiningwood-stamp-xray.png', [1254,1254], [0,0,1254,1254]),
  real: sheet('shiningwood-stamp-real.png', [1254,1254], [0,0,1254,1254]),
 },
 internships: {
  xray: sheet('internship-key-pair.png', [1774,887], [0,0,887,887]),
  real: sheet('internship-key-pair.png', [1774,887], [887,0,887,887]),
 },
 education: {
  xray: sheet('approved-student.png', [1774,887], [15,235,620,440]),
  real: sheet('approved-student.png', [1774,887], [650,235,620,440]),
 },
 sydney: {
  xray: sheet('passport-pair.png', [1536,1024], [15,30,738,964]),
  real: sheet('passport-pair.png', [1536,1024], [783,30,738,964]),
 },
 baidu: {
  xray: sheet('camera-aligned-v2.png', [1774,887], [25,205,850,550]),
  real: sheet('camera-aligned-v2.png', [1774,887], [887,205,850,550]),
 },
 tools: {
  xray: sheet('approved-objects.png', [1086,1448], [90,1145,495,285]),
  real: sheet('approved-objects.png', [1086,1448], [585,1145,495,285]),
 },
 step: {
  xray: sheet('objects-xray.png', [1280,1280], [15,20,425,380]),
  real: sheet('objects-real.png', [1280,1280], [15,20,425,380]),
 },
 life: {
  xray: sheet('dumbbell-pair.png', [1774,887], [15,140,850,600]),
  real: sheet('dumbbell-pair.png', [1774,887], [902,140,850,600]),
 },
 profile: {
  xray: sheet('portrait-xray.png', [1136,1385], [95,95,990,1170]),
 },
};
export const portrait = new URL('./assets/portrait-original.jpg', import.meta.url).href;
export function assetMarkup(asset, state) {
 const [iw,ih]=asset.size, [x,y,w,h]=asset.rect;
 const width=w>=h?100:w/h*100, height=h>=w?100:h/w*100;
 return `<span class="asset-layer ${state}"><span class="asset-window" style="width:${width}%;height:${height}%"><img alt="" draggable="false" src="${asset.file}" style="width:${iw/w*100}%;height:${ih/h*100}%;left:${-x/w*100}%;top:${-y/h*100}%"></span></span>`;
}
