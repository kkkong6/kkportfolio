import {artwork,portraitAsset} from './artwork-manifest.js';

function resolveAsset(asset){
  return {...asset,variants:asset.variants.map(variant=>({...variant,url:new URL(`./assets/optimized/${variant.file}`,import.meta.url).href}))};
}
export const art=Object.fromEntries(Object.entries(artwork).map(([id,states])=>
  [id,Object.fromEntries(Object.entries(states).map(([state,asset])=>[state,resolveAsset(asset)]))]));
const portrait=resolveAsset(portraitAsset);
function imageMarkup(asset,eager,bag){
  const src=asset.variants.at(-1).url;
  const srcset=asset.variants.map(v=>`${v.url} ${v.width}w`).join(', ');
  const sizes=bag?'(max-width:600px) 24vw, 16vw':'(max-width:600px) 270px, 470px';
  return `<img class="asset-image" ${eager?'src':'data-src'}="${src}" ${eager?'srcset':'data-srcset'}="${srcset}" sizes="${sizes}" width="${asset.width}" height="${asset.height}" decoding="async" ${eager?'fetchpriority="high"':''} alt="" draggable="false">`;
}
export function portraitMarkup(bag){
  return `<span class="asset-layer real"><span class="portrait-frame"><span class="portrait-crop">${imageMarkup(portrait,false,bag)}</span></span></span>`;
}
export function assetMarkup(asset,state,bag=false){
  const {width:w,height:h}=asset;
  const width=w>=h?100:w/h*100,height=h>=w?100:h/w*100;
  return `<span class="asset-layer ${state}${asset.sprite?' sprite-crop':''}"><span class="asset-window" style="width:${width}%;height:${height}%">${imageMarkup(asset,bag&&state==='xray',bag)}</span></span>`;
}
