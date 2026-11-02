import {cases as sourceCases,resumeRows} from './data.js';
import {art,portraitMarkup,assetMarkup} from './assets.js';
import {renderAssets} from './artwork-loader.js';
import {createElement,ArrowLeft} from 'lucide';
import './archive.css';
import './hover-story.css';
import './about.css';
const cases={...sourceCases,
 sydney:{...sourceCases.sydney,related:['competilens','miniver','baidu','step']},
 baidu:{...sourceCases.baidu,subtitle:'百度 · 一刻相册 · AI 产品经理实习',lead:'围绕一刻相册，从图片理解、信息追问，到受控生成、人工编辑与保存，设计完整的多模态创作链路。'},
 tools:{...sourceCases.tools,tag:'ABOUT / 专业技能',title:'我的专业技能',related:['profile',...sourceCases.tools.related]},
 profile:{tag:'ABOUT / 孔令楠',title:'你好，我是孔令楠',subtitle:'AI 产品经理 · 技术与设计背景',lead:'从数字媒体技术出发，经历用户产品、模型与业务实践，在悉尼继续学习与创业，随后深入多模态、Agent 与模型评测。',sections:[{title:'我关注的问题',text:'让 AI 不只能够生成，也能够在真实任务中被使用、被评测、被验证。'},{title:'专业技能',text:sourceCases.tools.lead},...sourceCases.tools.sections],related:['education','sydney','didi','baidu','step','competilens']},
};
const $=s=>document.querySelector(s), gallery=$('#gallery'), dialog=$('#detail');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// The bag reveals its invitation; leaving restores the owner's name.
const homeHeading=$('.home h1'),homeBag=$('.home .bag');
const titleDesktop=matchMedia('(min-width: 601px)');
let nameLines=[...homeHeading.querySelectorAll('.name-line')];
let nameFrame=0,titleMode='name',bagPointerInside=false;
function finishNameReveal(){
 cancelAnimationFrame(nameFrame);
 nameLines.forEach(line=>line.textContent=line.dataset.name);
}
function revealName(){
 finishNameReveal();
 if(reduced.matches)return;
 const glyphs=nameLines.map(line=>{
  const overlays=[...line.dataset.name].map(letter=>{
   const cell=document.createElement('span');
   cell.className='name-glyph';
   const original=document.createElement('span');
   original.className='name-original';
   original.textContent=letter;
   const overlay=document.createElement('span');
   overlay.className='name-decoding';
   overlay.textContent=letter;
   cell.append(original,overlay);
   return {cell,overlay,letter};
  });
  line.replaceChildren(...overlays.map(glyph=>glyph.cell));
  return overlays;
 });
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ',start=performance.now();
 const duration=titleMode==='bag'?1000:1200;
 const delays=titleMode==='bag'?[0,500,500]:[0,100];
 let lastTick=-1;
 function animate(now){
  const elapsed=now-start,tick=Math.floor(elapsed/50);
  if(elapsed>=duration+Math.max(...delays)){finishNameReveal();return;}
  if(tick!==lastTick){
   lastTick=tick;
   glyphs.forEach((line,row)=>line.forEach((glyph,index)=>{
    const progress=Math.max(0,(elapsed-delays[row])/duration);
    glyph.overlay.textContent=!/[A-Z]/.test(glyph.letter)||progress>=(index+1)/line.length?glyph.letter:alphabet[Math.floor(Math.random()*alphabet.length)];
   }));
  }
  nameFrame=requestAnimationFrame(animate);
 }
 animate(start);
}
function syncHomeTitle(force=false){
 const next=titleDesktop.matches&&(bagPointerInside||homeBag.querySelector(':focus-visible'))?'bag':'name';
 if(next===titleMode&&!force)return;
 finishNameReveal();
 titleMode=next;
 homeHeading.classList.toggle('is-bag-title',next==='bag');
 nameLines=(next==='bag'?["WHAT’S",'IN MY','BAG']:['LINGNAN','KONG']).map(text=>{
  const line=document.createElement('span');
  line.className='name-line';line.dataset.name=text;line.textContent=text;
  line.setAttribute('aria-hidden','true');
  return line;
 });
 homeHeading.replaceChildren(...nameLines);
 revealName();
}
homeBag.addEventListener('pointerenter',event=>{
 if(event.pointerType==='touch')return;
 bagPointerInside=true;syncHomeTitle();
});
homeBag.addEventListener('pointerleave',()=>{bagPointerInside=false;syncHomeTitle();});
homeBag.addEventListener('focusin',()=>syncHomeTitle());
homeBag.addEventListener('focusout',()=>queueMicrotask(()=>syncHomeTitle()));
titleDesktop.addEventListener('change',()=>{bagPointerInside=false;syncHomeTitle();});
document.fonts.ready.then(()=>syncHomeTitle(true));
reduced.addEventListener('change',()=>{if(reduced.matches)finishNameReveal();});
window.addEventListener('pagehide',finishNameReveal);

const items=[
 {id:'education',label:'数字媒体技术 / 本科',year:'2014 — 2018',x:24,y:60,w:22,r:-8},
 {id:'internships',label:'小米 / 网易 · 电商与内容产品',year:'2017',x:66,y:52,w:12,r:-18},
 {id:'iqiyi',label:'爱奇艺 / 用户产品',year:'2018 — 2020',sprite:1,x:76,y:42,w:19,r:6},
 {id:'didi',label:'滴滴 / AI 与安全',year:'2020 — 2023',sprite:2,x:42,y:73,w:21,r:80},
 {id:'sydney',label:'悉尼大学 / 硕士',year:'2024 — 2026',x:26,y:39,w:19,r:-5},
 {id:'shiningwood',label:'Shiningwood / AI 创业',year:'2025',x:36.5,y:44.5,w:10.5,r:-8},
 {id:'baidu',label:'百度 / 多模态产品',year:'2025 — 2026',x:51,y:34,w:24,r:0},
 {id:'step',label:'阶跃星辰 / 基模能力',year:'2026 — NOW',sprite:0,x:68,y:69,w:23,r:4},
 {id:'profile',label:'孔令楠 / 关于我',year:'ABOUT ME',x:49,y:53,w:18,r:-3}
];
function objectMarkup(item,bag=false){
 const {id,label,year,artOnly=false,sprite=0,x,y,w,r}=item;
 const style=`--sx:${sprite%3*50}%;--sy:${Math.floor(sprite/3)*50}%;--rotation:${bag?r:0}deg;${bag?`left:${x}%;top:${y}%;width:${w}%;`:''}`;
  let images=art[id]?assetMarkup(art[id].xray,'xray',bag)+ (id==='profile'?portraitMarkup(bag):assetMarkup(art[id].real,'real',bag)):'';
 return `<button class="artifact ${bag?'in-bag':''} ${art[id]?'approved-art':''}" data-case="${id}" aria-label="${label}" style="${style}"><span class="object-art">${images}</span><span class="selection" aria-hidden="true"><i class="guide vertical one"></i><i class="guide vertical two"></i><i class="guide horizontal one"></i><i class="guide horizontal two"></i></span>${artOnly?'':`<span class="object-label" aria-hidden="true">${year?`<span class="label-row"><span class="label-year" data-year="${year}">${year}</span></span>`:''}<span class="label-row"><span class="label-title">${label}</span></span></span>`}</button>`;
}
$('#objects').innerHTML=items.map(i=>objectMarkup(i,true)).join('');
$('#chapters').innerHTML=items.filter(i=>!i.bagOnly).map(i=>`<section class="exhibit${i.artOnly||i.id==='shiningwood'||i.id==='profile'?' is-preview':''}" id="${i.id}" aria-label="${i.label}"><div class="object-stage">${objectMarkup(i)}</div><span class="date">${i.year}</span></section>`).join('');
const stories={
 profile:`<h2>KK <span>/ 孔令楠</span></h2><p>计算机技术与 AI 交互背景，5 年AI 产品经验，聚焦大模型研究与 AI 产品应用，连接技术能力与产品实践。</p><p><strong>产品经验</strong> · 从千万级用户产品的体验与增长，到模型能力建设与多模态应用，兼具成熟产品核心迭代、模型应用落地与 AI 原生产品从 0 到 1 的实践。</p><p><strong>模型技术</strong> · 深入理解大模型架构，具备多模态与 Agent 应用实践；开展多模态事实核验与模型训练方法研究，涵盖训练数据合成、SFT、OPD、Benchmark 构建与模型评测。</p><p><strong>交互设计</strong> · 聚焦生成式 AI 的人机协作，围绕意图澄清、过程可视化、证据溯源与人工干预，构建可控、可信的产品体验。</p><p><strong>创业与研发</strong> · 联合创办 AI 科技工作室，运用 AI 辅助编程完成产品设计、全栈开发与迭代验证，将创新方案转化为可运行的 AI 产品。</p>`,
 shiningwood:`<h2>Shiningwood <span>· AI 科技工作室联合创始人</span></h2><p>AI 原生产品研发与企业智能化解决方案。</p><p><strong>自主产品</strong> · 基于大模型与 AI Coding，全流程自主设计与开发语言学习、旅行规划、运动健康等场景的 AI 产品。</p><p><strong>企业服务</strong> · AI 应用咨询、Agent 与智能工作流开发，连接业务需求、技术选型与方案落地。</p>`,
 sydney:`<h2>人工智能交互设计 <span>硕士 · 悉尼大学</span></h2><p><strong>专业学习</strong> · 大模型原理与数据、Agent 系统设计、多模态应用交互、AI 产品战略。</p><p><strong>研究实践</strong> · 两篇 AI 论文研究，聚焦多模态事实核验与大模型后训练，开展研究方案设计，算法实验与效果分析。</p>`,
 didi:`<h2>滴滴 <span>· AI 产品经理</span></h2><p>面向出行人身安全场景，建设基于 AI 的风险识别、分级干预与事件处置体系。</p><p><strong>模型与策略</strong> · 定义车内语音、图像模型及分级干预策略，打通风险识别到处置全链路。20+ 模型落地，安全事故减少 100+ 起／日。</p><p><strong>数据与迭代</strong> · 建设案件复盘平台，整合模型、策略结果与事件全貌，支持案件还原和模型迭代，复盘效率 +65%。</p><p><strong>AI 场景拓展</strong> · 识别客服、反作弊、未成年人保护等业务中的 AI 应用机会，并转化为可落地的 AI 产品。</p>`,
 baidu:`<h2>百度 <span>· AI 产品经理实习</span></h2><p>多模态产品设计与 Agent 能力优化，连接用户体验、训练数据与模型效果。</p><p><strong>多模态产品</strong> · 将网盘相册从图片存储延伸至个人内容创作，融合 VLM 图片理解、多轮追问、结构化记忆与可控生成，构建从照片到内容的完整创作链路。</p><p><strong>Agent 能力建设</strong> · 围绕创作指令理解与任务执行，构建 Query 合成与 Verifier 校验流水线，生产多步 trace 用于 LoRA SFT，任务通过率由 27% 提升至 59%。</p><p><strong>模型选型</strong> · 构建相册超分模型 Benchmark，制定定量指标和人工评测标准，形成模型选型方案。</p>`,
 step:`<h2>阶跃星辰 <span>· AI 产品经理实习</span></h2><p>以评测与训练数据驱动基模视觉能力提升，拓展新产品形态与模型生态。</p><p><strong>产品规划</strong> · 跟踪前沿技术趋势，规划模型审美能力演进与产品能力建设。</p><p class="evaluation-line"><strong>审美评测</strong> · 构建模型生成审美 Benchmark 与评测体系，量化布局、交互与视觉质量。</p><p><strong>数据与训练</strong> · 制定数据策略，设计测试 Prompt 与评测数据集，以 Skills 引导高质量产物生成，验证模型改进效果。</p><p><strong>快速开发与产品化</strong> · 运用 AI Coding 快速验证想法，将单次任务抽象为可复用的流程、工具与产品能力。</p>`,

 education:`<h2>计算机数字媒体技术 <span>学士 · 哈尔滨师范大学</span></h2><p><strong>专业学习</strong> · 程序设计、算法设计、概率与统计、计算机图形学、视觉与交互。</p><p><strong>技术基础</strong> · 理解程序逻辑、数据与技术约束，兼顾产品可行性与用户体验。</p>`,
 internships:`<h2>小米／网易 <span>· 产品经理实习</span></h2><p>从用户洞察到产品落地，兼顾业务增长与产品体验。</p><p><strong>小米电商</strong> · 用户与数据分析，优化交易转化，促进 GMV 增长。</p><p><strong>网易新闻</strong> · 新产品从 0 到 1 孵化，完整功能规划、PRD 与交互原型，一个月完成上线。</p>`,
 iqiyi:`<h2>爱奇艺 <span>· 产品经理</span></h2><p>千万级主站用户产品迭代，优化视频内容消费体验。</p><p><strong>播放体验</strong> · 900 万 DAU 播放页核心改版，结合用户行为优化观看体验，人均播放 VV +10%。</p><p><strong>短视频与互动</strong> · 探索短视频产品新形态，重构内容消费链路；设计综艺互动玩法，提升用户参与。</p>`
};
$('#about-info').innerHTML=`<div class="about-copy">${stories.profile}<a class="about-email" href="mailto:kk.lingnankong@gmail.com">kk.lingnankong@gmail.com</a></div>`;
renderAssets();
const storyExhibits=Object.entries(stories).filter(([id])=>id!=='profile').map(([id,content])=>{
 const exhibit=document.getElementById(id);
 exhibit.classList.add('has-story');
 exhibit.insertAdjacentHTML('beforeend',`<div class="hover-story" id="${id}-story" role="region" aria-label="${exhibit.getAttribute('aria-label')}详情">${content}</div>`);
 // Keep a short final phrase together without balancing all paragraph lines.
 exhibit.querySelectorAll('.hover-story p').forEach(paragraph=>{
  const tail=paragraph.lastChild;
  if(!tail||tail.nodeType!==Node.TEXT_NODE)return;
  const text=tail.textContent;
  if(text.length<=6)return;
  let cut=text.length-6;
  while(cut>0&&/[A-Za-z0-9]/.test(text[cut-1])&&/[A-Za-z0-9]/.test(text[cut]))cut--;
  const ending=document.createElement('span');
  ending.className='story-tail';
  ending.textContent=text.slice(cut);
  tail.textContent=text.slice(0,cut);
  paragraph.append(ending);
 });
 exhibit.querySelector('.artifact').setAttribute('aria-describedby',`${id}-story`);
 return exhibit;
});
// Replay the reference-style year decoding on each new hover/focus entry.
const artifactMotions=new Map();
function setArtifactMotion(owner,active){
 const state=artifactMotions.get(owner);
 if(!state||state.active===active)return;
 state.active=active;
 cancelAnimationFrame(state.frame);
 const {year}=state;
 if(!year)return;
 const original=year.dataset.year;
 year.textContent=original;
 if(!active||reduced.matches)return;
 const digits=[...original].filter(char=>/\d/.test(char)).length;
 if(!digits)return;
 const started=performance.now();
 let lastTick=-1;
 function decode(now){
  const progress=Math.min(1,(now-started)/500);
  const tick=Math.floor((now-started)/50);
  if(tick!==lastTick||progress===1){
   lastTick=tick;
   let position=0;
   year.textContent=[...original].map(char=>{
    if(!/\d/.test(char))return char;
    return ++position<=Math.floor(progress*digits)?char:String(Math.floor(Math.random()*10));
   }).join('');
  }
  if(progress<1)state.frame=requestAnimationFrame(decode);
  else year.textContent=original;
 }
 state.frame=requestAnimationFrame(decode);
}
document.querySelectorAll('#objects .artifact,#chapters .exhibit').forEach(owner=>{
 artifactMotions.set(owner,{year:owner.querySelector('.label-year'),active:false,frame:0});
 const sync=()=>setArtifactMotion(owner,owner.matches(':hover,:focus-within,.story-active'));
 owner.addEventListener('pointerenter',sync);
 owner.addEventListener('pointerleave',sync);
 owner.addEventListener('focusin',sync);
 owner.addEventListener('focusout',()=>queueMicrotask(sync));
});
reduced.addEventListener('change',()=>{
 if(reduced.matches)artifactMotions.forEach((state,owner)=>setArtifactMotion(owner,false));
});
// Reveal touch/narrow-screen objects on scroll, including the standalone portrait.
const touchStory=matchMedia('(hover: none), (pointer: coarse), (max-width: 600px)');
const autoRevealExhibits=[...document.querySelectorAll('#chapters .exhibit')];
function updateStory(){
 const galleryRect=gallery.getBoundingClientRect();
 autoRevealExhibits.forEach(exhibit=>{
  const rect=exhibit.querySelector('.artifact').getBoundingClientRect();
  const visibleWidth=Math.max(0,Math.min(rect.right,galleryRect.right)-Math.max(rect.left,galleryRect.left));
  const nearCentre=Math.abs(rect.left+rect.width/2-(galleryRect.left+gallery.clientWidth/2))<gallery.clientWidth*.3;
  // Keep the photo real while it is visible beside the About Me copy.
  const active=exhibit.id==='profile'?visibleWidth>=Math.min(rect.width,gallery.clientWidth)*.4:nearCentre;
  exhibit.classList.toggle('story-active',touchStory.matches&&active);
  setArtifactMotion(exhibit,exhibit.matches(':hover,:focus-within,.story-active'));
 });
}
gallery.addEventListener('scroll',updateStory,{passive:true});
window.addEventListener('resize',updateStory);
// Measure every detail at its actual width and reserve a fixed shared baseline.
let storyLayoutFrame=0;
function fitStoryLayout(){
 const evaluation=document.querySelector('#step-story .evaluation-line');
 if(evaluation){
  evaluation.style.removeProperty('font-size');
  if(matchMedia('(min-width:1001px)').matches){
   const size=parseFloat(getComputedStyle(evaluation).fontSize);
   if(evaluation.scrollWidth>evaluation.clientWidth)evaluation.style.fontSize=`${Math.floor(size*evaluation.clientWidth/evaluation.scrollWidth*100)/100}px`;
  }
 }
 const currentLift=parseFloat(gallery.style.getPropertyValue('--story-lift'))||0;
 const styles=getComputedStyle(gallery);
 const gap=parseFloat(styles.getPropertyValue('--story-gap'))||16;
 const offset=parseFloat(styles.getPropertyValue('--exhibit-offset'))||0;
 const lift=Math.max(0,...storyExhibits.map(exhibit=>{
  const baseBottom=gallery.clientHeight/2+exhibit.offsetHeight/2+offset;
  return Math.ceil(baseBottom+gap+exhibit.querySelector('.hover-story').offsetHeight+8-gallery.clientHeight+24);
 }));
 if(lift!==currentLift)gallery.style.setProperty('--story-lift',`${lift}px`);
 gallery.scrollTop=0;
}
function scheduleStoryLayout(){
 cancelAnimationFrame(storyLayoutFrame);
 storyLayoutFrame=requestAnimationFrame(fitStoryLayout);
}
const storyLayoutObserver=new ResizeObserver(scheduleStoryLayout);
storyLayoutObserver.observe(gallery);
storyExhibits.forEach(exhibit=>storyLayoutObserver.observe(exhibit.querySelector('.hover-story')));
document.fonts.ready.then(scheduleStoryLayout);
scheduleStoryLayout();
touchStory.addEventListener('change',updateStory);
updateStory();
const targets=[$('#home'),...document.querySelectorAll('.exhibit'),$('#about-info')];
let target=gallery.scrollLeft,frame=0,navigating=false;
const clamp=n=>Math.max(0,Math.min(n,gallery.scrollWidth-gallery.clientWidth));
// Integrate every wheel delta without quantizing the position into slides.
function animate(){const delta=target-gallery.scrollLeft;if(Math.abs(delta)<3){gallery.scrollLeft=target;frame=0;return;}gallery.scrollLeft+=delta*.19;frame=requestAnimationFrame(animate);}
function moveTo(x){if(navigating)stop();target=clamp(x);if(reduced.matches){stop();gallery.scrollLeft=clamp(x);return;}if(!frame)frame=requestAnimationFrame(animate);}
function stop(){cancelAnimationFrame(frame);frame=0;navigating=false;target=gallery.scrollLeft;}
// Click navigation uses a timed journey; wheel scrolling retains its short response.
function navigateTo(x,onArrival){
 stop();
 const start=gallery.scrollLeft,end=clamp(x),distance=end-start;
 target=end;
 if(reduced.matches||Math.abs(distance)<2){gallery.scrollLeft=end;onArrival?.();return;}
 const duration=Math.min(2400,1000+Math.abs(distance)*.28);
 let started;
 navigating=true;
 function tick(now){
  started??=now;
  const t=Math.min(1,(now-started)/duration);
  const eased=t*t*t*(t*(t*6-15)+10);
  gallery.scrollLeft=start+distance*eased;
  if(t<1)frame=requestAnimationFrame(tick);
  else{frame=0;navigating=false;onArrival?.();}
 }
 frame=requestAnimationFrame(tick);
}
function go(i){navigateTo(targets[i].offsetLeft-(i?gallery.clientWidth*.16:0));}
gallery.addEventListener('wheel',e=>{if(dialog.open||e.ctrlKey)return;e.preventDefault();if(navigating)stop();const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;const unit=e.deltaMode===1?16:e.deltaMode===2?gallery.clientWidth:1;moveTo((frame?target:gallery.scrollLeft)+delta*unit);},{passive:false});
gallery.addEventListener('touchstart',stop,{passive:true});gallery.addEventListener('pointerdown',stop,{passive:true});
document.addEventListener('keydown',e=>{if(dialog.open||e.target.closest('.hover-story')||e.altKey||e.metaKey||e.ctrlKey)return;if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();if(navigating)stop();moveTo(e.key==='Home'?0:e.key==='End'?gallery.scrollWidth:(frame?target:gallery.scrollLeft)+(e.key==='ArrowRight'?180:-180));}});
let archiveOrigin=null,archiveId=null,closing=false;
const archiveMotion={duration:700,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'};
function show(id,trigger){
 if(closing)return;
 const c=id==='resume'?{tag:'2014 — NOW',title:'完整经历',subtitle:'孔令楠',lead:'',sections:[]}:cases[id];
 if(!c)return;
 stop();
 const opening=!dialog.open;
 if(opening)archiveOrigin={element:trigger||document.activeElement,scroll:gallery.scrollLeft,id};
 archiveId=id;
 const source=opening&&trigger?.classList.contains('artifact')?trigger.getBoundingClientRect():null;
 const visualId=items.some(i=>i.id===id)?id:({competilens:'sydney',miniver:'sydney',tools:'profile',life:'profile',resume:'profile'}[id]||'profile');
 const item=items.find(i=>i.id===visualId);
 const metrics=(c.metrics||[]).slice(0,3);
 const reading=c.presentation==='reading';
 const body=id==='resume'?resumeRows.map(([date,org,role,key])=>`<div class="timeline-row"><span>${date}</span><button data-case="${key}">${org} ↗<small>${role}</small></button></div>`).join(''):c.sections.map((s,i)=>reading?`<section class="archive-reading"><h3>${s.title}</h3><p>${s.text}</p></section>`:`<details class="archive-section"><summary><span class="section-index">${String(i+1).padStart(2,'0')}</span><span>${s.title}</span><span class="section-toggle" aria-hidden="true">+</span></summary><p>${s.text}</p></details>`).join('');
 $('#detail-content').innerHTML=`<div class="archive-layout${reading?' reading-archive':''}"><figure class="archive-visual"><div class="archive-art" aria-hidden="true">${objectMarkup(item)}</div>${reading?'':`<figcaption><span>${item.year}</span><span>${item.label}</span></figcaption>`}</figure><div class="archive-copy"><p class="tag">${c.tag}</p><h2 id="archive-title">${c.title}</h2><p class="archive-role">${c.subtitle}</p>${c.lead?`<p class="archive-lead">${c.lead}</p>`:''}${metrics.length?`<div class="metrics">${metrics.map(([v,l])=>`<div><strong>${v}</strong><small>${l}</small></div>`).join('')}</div>`:''}<div class="archive-sections">${body}</div>${c.note?`<p class="archive-note">${c.note}</p>`:''}${c.related?.length?`<nav class="related" aria-label="相关经历">${c.related.map(key=>`<button data-case="${key}">${cases[key].subtitle} ↗</button>`).join('')}</nav>`:''}</div></div>`;
 renderAssets($('#detail-content'));
 const visual=$('.archive-art .artifact');
 visual.removeAttribute('data-case');visual.removeAttribute('aria-label');visual.disabled=true;visual.tabIndex=-1;
 document.body.classList.add('archive-open');
 if(opening)dialog.showModal();
 dialog.scrollTop=0;
 $('#close').focus({preventScroll:true});
 if(!reduced.matches){
  const dest=visual.getBoundingClientRect();
  const from=source&&source.right>0&&source.left<innerWidth?`translate(${source.x-dest.x+(source.width-dest.width)/2}px,${source.y-dest.y+(source.height-dest.height)/2}px) scale(${source.width/dest.width},${source.height/dest.height})`:'translateY(20px) scale(.96)';
  visual.animate([{transform:from},{transform:'none'}],archiveMotion);
  $('.archive-copy').animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{...archiveMotion,delay:opening?150:0});
  if(opening)dialog.animate([{backgroundColor:'rgba(255,255,255,0)'},{backgroundColor:'#fff'}],{duration:350});
 }
}
async function closeArchive(){
 if(closing||!dialog.open)return;
 closing=true;
 const visual=$('.archive-art .artifact'),origin=archiveOrigin;
 document.body.classList.remove('archive-open');
 if(!reduced.matches){
  const source=origin?.id===archiveId&&origin.element?.classList.contains('artifact')?origin.element.getBoundingClientRect():null;
  const dest=visual.getBoundingClientRect();
  const to=source?`translate(${source.x-dest.x+(source.width-dest.width)/2}px,${source.y-dest.y+(source.height-dest.height)/2}px) scale(${source.width/dest.width},${source.height/dest.height})`:'translateY(12px) scale(.98)';
  visual.getAnimations().forEach(a=>a.cancel());
  visual.animate([{transform:'none',opacity:1},{transform:to,opacity:source?1:0}],{...archiveMotion,duration:450});
  $('.archive-copy').getAnimations().forEach(a=>a.cancel());
  $('.archive-copy').animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'});
  await dialog.animate([{backgroundColor:'#fff'},{backgroundColor:'rgba(255,255,255,0)'}],{duration:450,fill:'forwards'}).finished;
 }
 dialog.close();dialog.getAnimations().forEach(a=>a.cancel());
 origin?.element?.focus({preventScroll:true});
 gallery.scrollLeft=origin?.scroll??gallery.scrollLeft;target=gallery.scrollLeft;
 closing=false;archiveOrigin=null;
}
$('#close').replaceChildren(createElement(ArrowLeft,{width:24,height:24,'aria-hidden':'true'}));
$('#close').setAttribute('aria-label','返回物品展览');
$('#close').title='返回物品展览';
dialog.setAttribute('aria-labelledby','archive-title');
dialog.addEventListener('cancel',e=>{e.preventDefault();closeArchive();});
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-case]');
 if(b){
  if(b.classList.contains('in-bag')||b.closest('.capability-nav')){
   const destination=document.getElementById(b.dataset.case);
   if(destination){
    navigateTo(destination.offsetLeft-(gallery.clientWidth-destination.offsetWidth)/2,()=>destination.querySelector('.artifact').focus({preventScroll:true}));
   }
  }else if(b.closest('.exhibit.has-story,.exhibit.is-preview,.about-panel')){b.focus({preventScroll:true});}
  else show(b.dataset.case,b);
 }
 const p=e.target.closest('[data-page]');if(p)go(Number(p.dataset.page));
});
$('#close').onclick=closeArchive;
window.addEventListener('resize',stop);
