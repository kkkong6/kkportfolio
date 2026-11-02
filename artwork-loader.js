// Load gallery artwork near the viewport; keep X-ray visible until real images decode.
const registered=new WeakSet(),loading=new WeakMap();
function loadImage(image){
  if(loading.has(image))return loading.get(image);
  const promise=(async()=>{
    if(image.dataset.src){
      image.srcset=image.dataset.srcset;
      image.src=image.dataset.src;
      delete image.dataset.src;
      delete image.dataset.srcset;
    }
    try{await image.decode();return true;}
    catch{return false;}
  })();
  loading.set(image,promise);
  return promise;
}
async function loadReal(artifact){
  const images=[...artifact.querySelectorAll('.real img')];
  const results=await Promise.all(images.map(loadImage));
  if(results.every(Boolean))artifact.classList.add('real-ready');
}
async function loadArtifact(artifact){
  await Promise.all([...artifact.querySelectorAll('.xray img')].map(loadImage));
  await loadReal(artifact);
}
let observer;
export function renderAssets(root=document){
  observer??=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      observer.unobserve(entry.target);
      loadArtifact(entry.target);
    }
  },{root:document.querySelector('#gallery'),rootMargin:'0px 350px'});
  const bag=[];
  root.querySelectorAll('.artifact').forEach(artifact=>{
    if(registered.has(artifact))return;
    registered.add(artifact);
    artifact.addEventListener('pointerenter',()=>loadArtifact(artifact),{once:true});
    artifact.addEventListener('focusin',()=>loadArtifact(artifact),{once:true});
    if(artifact.classList.contains('in-bag'))bag.push(artifact);
    else if(artifact.closest('dialog'))loadArtifact(artifact);
    else observer.observe(artifact);
  });
  if(bag.length){
    const shell=document.querySelector('.bag>img');
    const visible=[...bag.flatMap(a=>[...a.querySelectorAll('.xray img')]),shell].filter(Boolean);
    Promise.all(visible.map(loadImage)).then(()=>{
      const preload=()=>bag.forEach(loadReal);
      if('requestIdleCallback' in window)requestIdleCallback(preload,{timeout:1500});
      else setTimeout(preload,300);
    });
  }
}
