// Remove only near-white background connected to the edge, retaining enclosed highlights.
export function clearEdgeBackground(pixels, width, height) {
 const count=width*height,visited=new Uint8Array(count),queue=new Uint32Array(count);
 let head=0,tail=0;
 function enqueue(index){
  if(visited[index])return;
  visited[index]=1;
  const offset=index*4,r=pixels[offset],g=pixels[offset+1],b=pixels[offset+2];
  if(pixels[offset+3]>16&&(Math.min(r,g,b)<242||Math.max(r,g,b)-Math.min(r,g,b)>16))return;
  queue[tail++]=index;
 }
 for(let x=0;x<width;x++){enqueue(x);enqueue((height-1)*width+x);}
 for(let y=1;y<height-1;y++){enqueue(y*width);enqueue(y*width+width-1);}
 while(head<tail){
  const index=queue[head++],x=index%width;
  pixels[index*4+3]=0;
  if(x>0)enqueue(index-1);
  if(x<width-1)enqueue(index+1);
  if(index>=width)enqueue(index-width);
  if(index<count-width)enqueue(index+width);
 }
 return pixels;
}

const images=new Map(),crops=new Map();
function loadImage(url){
 if(!images.has(url))images.set(url,new Promise((resolve,reject)=>{
  const image=new Image();
  image.decoding='async';
  image.onload=()=>resolve(image);
  image.onerror=()=>reject(new Error(`Could not load artwork: ${url}`));
  image.src=url;
 }));
 return images.get(url);
}
async function prepareCrop(canvas){
 const url=canvas.dataset.assetFile;
 const rect=JSON.parse(canvas.dataset.assetRect),size=JSON.parse(canvas.dataset.assetSize);
 const key=JSON.stringify([url,rect,size]);
 if(!crops.has(key))crops.set(key,(async()=>{
  const image=await loadImage(url),[x,y,width,height]=rect;
  const result=document.createElement('canvas');
  result.width=width;result.height=height;
  const context=result.getContext('2d',{willReadFrequently:true});
  const scaleX=image.naturalWidth/size[0],scaleY=image.naturalHeight/size[1];
  context.drawImage(image,x*scaleX,y*scaleY,width*scaleX,height*scaleY,0,0,width,height);
  if(canvas.dataset.assetBackdrop==='true'){
   const bitmap=context.getImageData(0,0,width,height);
   clearEdgeBackground(bitmap.data,width,height);
   context.putImageData(bitmap,0,0);
  }
  return result;
 })());
 return crops.get(key);
}
export async function renderAssets(root=document){
 const pending=[...root.querySelectorAll('canvas[data-asset-file]:not([data-asset-state])')];
 await Promise.all(pending.map(async canvas=>{
  canvas.dataset.assetState='loading';
  try{
   const crop=await prepareCrop(canvas);
   canvas.getContext('2d').drawImage(crop,0,0);
   canvas.dataset.assetState='ready';
  }catch(error){
   canvas.dataset.assetState='error';
   console.error(error);
  }
 }));
}
