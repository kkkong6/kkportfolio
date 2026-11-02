// Crop approved artwork after decoding; keep source images intact.
const opaqueSheets=new Set(['approved-student.png','camera-aligned-v2.png','portrait-xray.png','internship-key-pair.png','passport-pair.png','approved-objects.png','dumbbell-pair.png']);
const sheet = (file, size, rect) => ({ file: new URL(`./assets/${file}`, import.meta.url).href, size, rect, backdrop:opaqueSheets.has(file) });
export const art = {
  iqiyi: {
    xray: {...sheet('objects-xray.png', [1254,1254], [418,0,418,418]), sprite:true},
    real: {...sheet('objects-real.png', [1254,1254], [418,0,418,418]), sprite:true},
  },
  didi: {
    xray: {...sheet('objects-xray.png', [1254,1254], [836,0,418,418]), sprite:true},
    real: {...sheet('objects-real.png', [1254,1254], [836,0,418,418]), sprite:true},
  },
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
