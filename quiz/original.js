/* Simulador original DE Professional 2026 · preguntas originales con referencias oficiales */
(function(){
"use strict";
const DATA_FILES=["01","02","03","04","05","06","07","08","09"].map(x=>"quiz/original/"+x+".json");
const STORAGE="de-pro-original-exam-v1";
const NAMES={"01":"Desarrollo Python y SQL","02":"Ingesta y adquisición","03":"Transformaciones y calidad","04":"Observabilidad","05":"Optimización y costes","06":"Seguridad y cumplimiento","07":"Gobierno y metadatos","08":"Depuración y despliegue","09":"Modelado"};
let bank=null,loading=null,root=null,showSolution=false,chooseCache=null,interval=null;
let state=load();
function load(){try{const s=JSON.parse(localStorage.getItem(STORAGE));return s&&typeof s==="object"?{session:s.session||null,history:Array.isArray(s.history)?s.history:[],progress:s.progress||{}}:{session:null,history:[],progress:{}}}catch{return {session:null,history:[],progress:{}}}}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch{}}
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=x=>esc(x).replace(/\x60([^\x60\n]+)\x60/g,"<code>$1</code>").replace(/\n/g,"<br>");
const byId=id=>bank?.find(q=>q.id===id);
const shuffle=x=>{const a=[...x];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const score=s=>{const arr=s.ids.map(id=>byId(id)).filter(Boolean);const answered=arr.filter(q=>s.answers[q.id]);const right=answered.filter(q=>s.answers[q.id]===q.answer);return {total:arr.length,answered:answered.length,correct:right.length,percent:arr.length?Math.round(right.length/arr.length*100):0}};
function shell(){return '<div class="oq" id="oq-root"><div id="oq-view" class="oq-view"><div class="panel"><h2>Preparando banco oficial inspirado en la documentación…</h2><p>60 preguntas originales.</p></div></div></div>'}
function setup(){
 const total=bank?.length||60,progressed=Object.values(state.progress).filter(x=>x.correct).length;
 return '<div class="oq-hero"><div><div class="eyebrow">SIMULADOR / CONTENIDO ORIGINAL 2026</div><h1>Data Engineer Professional</h1><p>60 preguntas nuevas creadas a partir de los escenarios, funciones y patrones de la documentación oficial, con explicaciones de las cuatro opciones y referencias para ampliar.</p><div class="oq-tags"><span>60 preguntas</span><span>45 objetivos</span><span>9 dominios</span><span>120 minutos</span></div></div><div class="oq-hero-side"><strong>'+progressed+' / '+total+'</strong><span>preguntas acertadas alguna vez en modo estudio</span></div></div>'+
 '<div class="oq-setup-grid"><section class="panel oq-setup-card"><div class="oq-mode-icon">◈</div><h2>Modo estudio</h2><p>Elige un bloque, responde y comprueba al momento. Se muestran motivos de acierto y de error en las cuatro opciones.</p>'+
 '<label>Bloque de especialización<select id="oq-area"><option value="all">Todos los bloques</option>'+Object.entries(NAMES).map(([k,v])=>'<option value="'+k+'">'+k+' · '+esc(v)+'</option>').join("")+'</select></label>'+
 '<button data-oq="start-study" class="button primary">Empezar a practicar →</button></section>'+
 '<section class="panel oq-setup-card"><div class="oq-mode-icon">⏱</div><h2>Simulacro completo</h2><p>60 preguntas, orden aleatorio y 120 minutos. Respuestas ocultas hasta finalizar; revisión detallada con puntuación por bloques.</p>'+
 '<div class="oq-timer-explainer">La calificación es orientativa: Databricks no publica la nota de corte oficial.</div>'+
 '<button data-oq="start-exam" class="button primary">Comenzar simulacro →</button></section></div>'+
 '<div class="oq-archive-link"><b>¿Quieres usar los tres bancos de 2025?</b><p>Se mantienen como biblioteca histórica con respuestas provisionales y avisos de revisión.</p><a class="button ghost" href="#/archive">Abrir archivo histórico (196) →</a></div>'+
 '<div class="oq-history panel"><h3>Últimos simulacros</h3>'+(!state.history.length?'<p class="muted">Todavía no hay intentos completados.</p>':state.history.slice(-5).reverse().map(x=>'<div class="oq-history-row"><span>'+esc(x.date.slice(0,10))+'</span><strong>'+x.correct+' / '+x.total+'</strong><span>'+x.percent+'% · '+x.minutes+' min</span></div>').join(""))+'</div>';
}
function start(mode,area){
 const ids=shuffle(mode==="exam"?bank:bank.filter(q=>area==="all"||q.domain===area)).map(q=>q.id);
 if(!ids.length)return;
 state.session={mode,area,ids,index:0,answers:{},checked:{},flags:{},startedAt:Date.now(),deadline:mode==="exam"?Date.now()+7200000:null,finished:false};
 showSolution=false;chooseCache=null;save();render();
}
function remaining(s){return Math.max(0,Math.ceil((s.deadline-Date.now())/1000))}
function timerText(s){if(s.mode!=="exam")return "SIN LÍMITE";const n=remaining(s);return String(Math.floor(n/3600)).padStart(2,"0")+":"+String(Math.floor(n%3600/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0")}
function current(){const s=state.session;return byId(s?.ids[s.index])}
function statusFor(s,q){return s.checked[q.id]?"checked":s.answers[q.id]?"selected":"pending"}
function question(){
 const s=state.session,q=current();if(!q)return '<div class="panel">No se ha encontrado esta pregunta.</div>';
 const reviewed=s.mode==="study"&&s.checked[q.id] || s.finished;
 const selected=s.answers[q.id]||null;
 const opts=q.options.map((option,i)=>{
   const key="ABCD"[i],active=selected===key;
   const correct=reviewed&&key===q.answer,wrong=reviewed&&active&&key!==q.answer,excluded=reviewed&&key!==q.answer&&!active;
   return '<button class="oq-option '+(active?"picked ":"")+(correct?"right ":"")+(wrong?"wrong ":"")+'" data-oq="pick" data-letter="'+key+'" aria-pressed="'+String(active)+'" '+(reviewed?"disabled":"")+'><b class="oq-letter">'+key+'</b><span>'+fmt(option)+'</span>'+(correct?'<b class="oq-check-symbol">✓</b>':wrong||excluded?'<b class="oq-cross-symbol">×</b>':"")+'</button>';
 }).join("");
 const checked=reviewed?'<div class="oq-answer-panel"><div class="oq-answer-title">'+(selected===q.answer?'<span class="oq-good">✓ Acertada</span>':'<span class="oq-bad">✕ '+(selected?"Incorrecta":"Sin responder")+'</span>')+' <small>Correcta: '+q.answer+'</small></div>'+
 '<p>'+fmt(q.explanation)+'</p><details '+(showSolution?"open":"")+'><summary>Por qué se descartan las otras opciones</summary>'+
 q.whyWrong.map((ex,i)=>q.answer==="ABCD"[i]?"":'<p><b class="oq-bad">× '+("ABCD"[i])+'</b> '+fmt(ex)+'</p>').join("")+'</details>'+
 '<a href="'+esc(q.source)+'" target="_blank" rel="noopener noreferrer" class="oq-official-link">Consultar documentación oficial ↗</a></div>':"";
 return '<div class="oq-question-card"><div class="oq-qhead"><span class="oq-identity">'+esc(q.id)+'</span><span>OBJETIVO '+esc(q.objective)+'</span><span>'+esc(q.difficulty.toUpperCase())+'</span><span>Pregunta '+(s.index+1)+' / '+s.ids.length+'</span></div>'+
 '<h2>'+fmt(q.stem)+'</h2>'+(q.code?'<div class="oq-code"><div class="oq-code-header"><span>FRAGMENTO · SQL / PYSPARK / YAML</span><button class="oq-copy" data-oq="copy" type="button">Copiar</button></div><pre><code>'+esc(q.code)+'</code></pre></div>':"")+
 '<div class="oq-options">'+opts+'</div>'+
 (!reviewed&&s.mode==="study"?'<div class="oq-check-row"><button class="button primary" data-oq="check" '+(!selected?"disabled":"")+'>Comprobar</button><small>Doble clic sobre una opción para comprobar</small></div>':
 !reviewed?'<p class="oq-exam-hint">Modo examen: puedes cambiar de respuesta hasta finalizar. No se muestran soluciones.</p>':"")+
 checked+'</div>';
}
function navigation(){
 const s=state.session;return '<div class="oq-nav"><button class="button ghost" data-oq="prev" '+(s.index===0?"disabled":"")+'>← Anterior</button>'+
 '<button class="button ghost" data-oq="flag">'+(s.flags[current().id]?"★ Marcada":"☆ Marcar para revisar")+'</button>'+
 '<button class="button primary" data-oq="next" '+(s.index===s.ids.length-1?"disabled":"")+'>Siguiente →</button></div>';
}
function grid(){
 const s=state.session;return '<div class="oq-sidebar"><h3>Mapa de respuestas</h3><p>Una casilla por pregunta. Los colores indican estado y, en estudio, acierto o error tras comprobar.</p><div class="oq-grid">'+s.ids.map((id,i)=>{const q=byId(id);const checked=s.checked[id]||s.finished,selected=s.answers[id];const cls=checked?(selected===q.answer?"correct":"incorrect"):selected?"answered":"pending";return '<button class="oq-grid-button '+cls+(s.index===i?" current":"")+(s.flags[id]?" flagged":"")+'" data-oq="goto" data-pos="'+i+'" title="'+esc(q.objective)+'">'+(i+1)+'</button>'}).join("")+'</div></div>';
}
function active(){
 const s=state.session,q=current(),st=score(s),width=Math.round(100*st.answered/st.total);
 return '<div class="oq-session-top"><div><div class="eyebrow">'+(s.mode==="exam"?"SIMULACRO / 120 MINUTOS":"ESTUDIO / CORRECCIÓN INMEDIATA")+'</div><h1>Professional 2026</h1></div><div class="oq-session-tools"><span class="oq-clock" id="oq-clock">'+timerText(s)+'</span><button class="button ghost small" data-oq="new">Nuevo intento</button><button class="button ghost small" data-oq="exit">Salir</button></div></div>'+
 '<div class="oq-track"><span>Contestadas '+st.answered+' / '+st.total+'</span><div class="oq-track-line"><i style="width:'+width+'%"></i></div><span>Bloque '+q.domain+' · '+esc(NAMES[q.domain])+'</span></div>'+
 '<div class="oq-layout"><div class="oq-main">'+question()+navigation()+
 '<div class="oq-finish-row"><button class="button ghost" data-oq="finish">Finalizar y ver resultados</button></div>'+'</div>'+grid()+'</div>';
}
function finish(auto=false){
 const s=state.session;if(!s||s.finished)return;
 if(!auto&&!confirm("¿Quieres finalizar el simulacro y ver la corrección? Quedarán "+(score(s).total-score(s).answered)+" preguntas sin responder."))return;
 s.finished=true;s.finishedAt=Date.now();
 const st=score(s);
 if(s.mode==="exam"){state.history.push({date:new Date().toISOString(),correct:st.correct,total:st.total,percent:st.percent,minutes:Math.min(120,Math.max(0,Math.round((s.finishedAt-s.startedAt)/60000)))});state.history=state.history.slice(-30)}
 save();render();
}
function summary(){
 const s=state.session,st=score(s),areaMap={};for(const id of s.ids){const q=byId(id);const a=(areaMap[q.domain] ||= {name:NAMES[q.domain],total:0,correct:0,answered:0});a.total++;if(s.answers[id])a.answered++;if(s.answers[id]===q.answer)a.correct++;}
 return '<div class="oq-results"><div class="oq-results-hero"><div class="eyebrow">RESULTADOS / '+(s.mode==="exam"?"SIMULACRO":"ESTUDIO")+'</div><h1>'+st.percent+'%</h1><h2>'+st.correct+' de '+st.total+' respuestas correctas</h2><p>Indicador de práctica original, no nota de corte oficial. Puedes revisar cada explicación y todas las opciones.</p>'+
 '<button class="button primary" data-oq="reset">Crear otro intento</button></div><div class="panel"><h3>Rendimiento por bloque</h3>'+
 Object.entries(areaMap).sort((a,b)=>a[0].localeCompare(b[0])).map(([id,x])=>'<div class="oq-domain-result"><div><strong>'+id+' · '+esc(x.name)+'</strong><span>'+x.correct+' / '+x.total+'</span></div><div class="oq-domain-bar"><i style="width:'+Math.round(100*x.correct/x.total)+'%"></i></div></div>').join("")+'</div>'+
 '<div class="panel oq-weak-topics"><h3>Objetivos que conviene repasar</h3><p class="muted">Las respuestas incorrectas o no contestadas tienen enlace directo a su lección de la Academia.</p>'+
 s.ids.filter(id=>s.answers[id]!==byId(id).answer).slice(0,15).map(id=>{const q=byId(id);return '<a class="oq-weak-link" href="#/lesson/'+q.objective+'"><span>'+esc(q.objective)+'</span><b>'+esc(q.title)+'</b><span>Repasar →</span></a>'}).join("")+
 (s.ids.every(id=>s.answers[id]===byId(id).answer)?'<p class="oq-good">No hay fallos en este intento.</p>':'')+
 '</div>'+'<div class="panel"><div class="oq-review-head"><h3>Revisión completa de respuestas</h3><p>Abre cualquier pregunta; las soluciones se mostrarán con los distractores.</p></div><div class="oq-review-grid">'+s.ids.map((id,i)=>'<button class="oq-review-num '+(s.answers[id]===byId(id).answer?"correct":"incorrect")+'" data-oq="review" data-pos="'+i+'">'+(i+1)+'</button>').join("")+'</div></div></div>';
}
function render(){
 root=document.querySelector("#oq-root");if(!root)return;
 if(state.session&&state.session.mode==="exam"&&!state.session.finished&&remaining(state.session)===0)finish(true);
 if(!root)return;const view=root.querySelector("#oq-view");if(!view)return;
 view.innerHTML=!state.session?setup():state.session.finished?summary():active();
}
function check(){
 const s=state.session,q=current();if(!s||!q||!s.answers[q.id]||s.checked[q.id]||s.mode!=="study")return;
 s.checked[q.id]=true;state.progress[q.id]={correct:s.answers[q.id]===q.answer,seen:new Date().toISOString()};
 save();render();
}
function pick(letter){
 const s=state.session,q=current();if(!q||s.checked[q.id]||s.finished)return;
 const now=Date.now();const dbl=s.mode==="study"&&chooseCache&&chooseCache.id===q.id&&chooseCache.letter===letter&&now-chooseCache.time<500;
 s.answers[q.id]=letter;chooseCache={id:q.id,letter,time:now};save();
 if(dbl){check();return;}
 root.querySelectorAll(".oq-option").forEach(el=>{const is=el.dataset.letter===letter;el.classList.toggle("picked",is);el.setAttribute("aria-pressed",String(is))});
 const b=root.querySelector('[data-oq="check"]');if(b)b.disabled=false;
 const num=root.querySelector('.oq-grid-button.current');if(num)num.classList.add("answered");
 const lbl=root.querySelector(".oq-track span");if(lbl)lbl.textContent="Contestadas "+score(s).answered+" / "+s.ids.length;
}
function onClick(event){
 const b=event.target.closest("[data-oq]");if(!b)return;
 const op=b.dataset.oq,s=state.session;
 if(op==="start-study"){const area=root.querySelector("#oq-area")?.value||"all";start("study",area)}
 else if(op==="start-exam")start("exam","all");
 else if(op==="pick")pick(b.dataset.letter);
 else if(op==="check")check();
 else if(op==="copy"){const q=current();if(q&&navigator.clipboard)navigator.clipboard.writeText(q.code).then(()=>{b.textContent="¡Copiado!"}).catch(()=>{});}
 else if(op==="next"&&s.index<s.ids.length-1){s.index++;showSolution=false;chooseCache=null;save();render()}
 else if(op==="prev"&&s.index>0){s.index--;showSolution=false;chooseCache=null;save();render()}
 else if(op==="goto"){s.index=Number(b.dataset.pos);showSolution=false;chooseCache=null;save();render()}
 else if(op==="flag"){s.flags[current().id]=!s.flags[current().id];save();render()}
 else if(op==="finish")finish();
 else if(op==="new"){if(confirm("¿Descartar este intento y volver al menú principal?")){state.session=null;save();render()}}
 else if(op==="exit"){if(confirm("¿Salir del intento actual? Podrás continuarlo más tarde o empezar otro.")){location.hash="#/academy"}}
 else if(op==="reset"){state.session=null;save();render()}
 else if(op==="review"){const n=Number(b.dataset.pos);s.index=n;state.session.review=true;save();renderReview();}
}
function renderReview(){
 const s=state.session;if(!s)return;root.querySelector("#oq-view").innerHTML='<div class="oq-review-banner"><button class="button ghost small" data-oq="back-results">← Volver a resultados</button><b>Revisión del simulacro</b></div><div class="oq-layout"><div class="oq-main">'+questionReview()+navigationReview()+'</div>'+grid()+'</div>';
}
function questionReview(){return question()}
function navigationReview(){const s=state.session;return '<div class="oq-nav"><button class="button ghost" data-oq="review-prev" '+(s.index===0?"disabled":"")+'>← Anterior</button><button class="button primary" data-oq="back-results">Ver resultados →</button><button class="button ghost" data-oq="review-next" '+(s.index===s.ids.length-1?"disabled":"")+'>Siguiente →</button></div>'}
function onClickReview(event){
 const b=event.target.closest("[data-oq]");if(!b||!state.session?.review)return false;
 const op=b.dataset.oq,s=state.session;
 if(op==="back-results"){s.review=false;s.finished=true;save();render();return true}
 if(op==="review-next"&&s.index<s.ids.length-1){s.index++;renderReview();return true}
 if(op==="review-prev"&&s.index>0){s.index--;renderReview();return true}
 if(op==="goto"){s.index=Number(b.dataset.pos);renderReview();return true}
 return false;
}
function ticker(){if(!state.session||state.session.mode!=="exam"||state.session.finished)return;
 const t=document.querySelector("#oq-clock");if(t)t.textContent=timerText(state.session);
 if(remaining(state.session)===0)finish(true)}
async function loadQuestions(){
 if(bank)return bank;
 if(!loading)loading=Promise.all(DATA_FILES.map(async file=>{
   const response=await fetch(file,{cache:"no-cache"});if(!response.ok)throw Error("No se pudo descargar "+file+": "+response.status);return (await response.json()).questions;
 })).then(arr=>{bank=arr.flat();if(bank.length!==60)throw Error("El banco debería tener 60 preguntas y tiene "+bank.length);return bank}).catch(err=>{loading=null;throw err});
 return loading;
}
async function mount(){
 root=document.querySelector("#oq-root");if(!root)return;
 if(!root.dataset.bound){root.dataset.bound="1";root.addEventListener("click",function(e){if(!onClickReview(e))onClick(e)});}
 try{await loadQuestions();if(!root||!root.isConnected||!location.hash.startsWith("#/simulator"))return;
 if(state.session?.review){renderReview()}else{render()}if(!interval)interval=setInterval(ticker,1000);
 }catch(e){if(root&&root.isConnected)root.querySelector("#oq-view").innerHTML='<div class="panel oq-error"><h2>Error al cargar preguntas originales</h2><p>'+esc(e.message)+'</p><p>Verifica que GitHub Pages haya publicado la carpeta quiz/original.</p></div>'}
}
if(window.addEventListener)window.addEventListener("keydown",function(e){
 if(!location.hash.startsWith("#/simulator")||!state.session||state.session.finished||e.altKey||e.ctrlKey||e.metaKey)return;
 if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName))return;
 const key=e.key.toLowerCase(),s=state.session;
 const options={"1":"A","2":"B","3":"C","4":"D","a":"A","b":"B","c":"C","d":"D"};
 if(options[key]){e.preventDefault();pick(options[key]);return;}
 if(key==="enter"&&s.mode==="study"){e.preventDefault();check();return;}
 if(key==="arrowright"||key==="n"){if(s.index<s.ids.length-1){s.index++;chooseCache=null;save();render()}e.preventDefault();return;}
 if(key==="arrowleft"||key==="p"){if(s.index>0){s.index--;chooseCache=null;save();render()}e.preventDefault();return;}
 if(key==="f"){s.flags[current().id]=!s.flags[current().id];save();render();e.preventDefault();}
});
window.DE_ORIGINAL_EXAM={shell,mount};
})();