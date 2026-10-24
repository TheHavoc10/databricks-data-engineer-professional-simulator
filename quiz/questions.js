(function(){
"use strict";
const NAMES=["practica-2025.json","simulacro-1-2025.json","simulacro-2-2025.json"];
const AREAS={"01":"Desarrollo","02":"Ingesta","03":"Manipulación","04":"Monitorización","05":"Optimización","06":"Seguridad","07":"Gobierno","08":"Despliegue","09":"Modelado"};
const STORE="de-pro-questions-candidates-v1";
let questions=null,loading=null,root=null,currentIndex=0,filtered=[],showWhy=false;
let filters={bank:"all",area:"all",difficulty:"all",state:"all",search:""};
let picked={},attempts={};
try{const data=JSON.parse(localStorage.getItem(STORE)||"{}");picked=data.picked||{};attempts=data.attempts||{}}catch{}
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=s=>esc(s).replace(/\x60([^\x60\n]+)\x60/g,"<code>$1</code>").replace(/\n/g,"<br>");
const blocked=q=>(q.riskFlags||[]).some(x=>/ERROR DOCUMENTADO|SCD2:|Watermark:/.test(x));
function save(){try{localStorage.setItem(STORE,JSON.stringify({picked,attempts}))}catch{}}
function shell(){return '<div id="qa-root" class="qa-root"><div class="page-top"><div class="eyebrow">SIMULADOR · BIBLIOTECA BETA</div><h1>196 preguntas candidatas</h1><p class="lead">Banco abierto en revisión, con opciones y escenarios completos. Todavía no equivale a un simulacro oficial validado para 2026.</p></div><div class="qa-warn"><b>Atención:</b> el material original sigue el temario 2025 y algunas respuestas son incorrectas o están desactualizadas. Las preguntas conflictivas están bloqueadas. Los resultados miden coincidencia con la respuesta original, no tu preparación real.</div><div id="qa-view">Cargando las preguntas…</div></div>'}
function subset(){
 if(!questions)return [];
 const term=filters.search.toLowerCase().trim();
 return questions.filter(q=>(filters.bank==="all"||q.sourceBank===filters.bank)&&(filters.area==="all"||q.domain2026===filters.area)&&(filters.difficulty==="all"||q.difficulty===filters.difficulty)&&(filters.state==="all"||(filters.state==="pending"&&!attempts[q.id])||(filters.state==="blocked"&&blocked(q)))&&(!term||(q.id+" "+q.question+" "+q.scenario+" "+q.title).toLowerCase().includes(term)));
}
function selectors(){
 const banks=[...new Set(questions.map(q=>q.sourceBank))];
 function opts(options,val){return options.map(x=>'<option value="'+esc(x[0])+'" '+(val===x[0]?"selected":"")+'>'+esc(x[1])+'</option>').join("")}
 return '<div class="qa-filters"><label>Banco<select id="qa-bank">'+opts([["all","Todos los bancos"],...banks.map(x=>[x,x])],filters.bank)+'</select></label>'+
 '<label>Área 2026*<select id="qa-area">'+opts([["all","Todas"],...Object.entries(AREAS).map(([a,n])=>[a,a+" · "+n])],filters.area)+'</select></label>'+
 '<label>Dificultad<select id="qa-difficulty">'+opts([["all","Todas"],["easy","Fácil"],["medium","Media"],["hard","Alta"]],filters.difficulty)+'</select></label>'+
 '<label>Estado<select id="qa-state">'+opts([["all","Todas"],["pending","Sin responder"],["blocked","Incidencias"]],filters.state)+'</select></label>'+
 '<label class="qa-filter-search">Buscar<input id="qa-search" type="search" value="'+esc(filters.search)+'" placeholder="watermark, CDC…"></label></div>';
}
function questionView(q){
 const attempt=attempts[q.id],choice=picked[q.id],stop=blocked(q);
 const answers=Object.keys(q.choices).map(letter=>'<button type="button" class="qa-option'+(choice===letter?" selected":"")+(attempt&&q.proposedAnswer===letter?" right":"")+(attempt&&choice===letter&&!attempt.correct?" wrong":"")+'" data-qact="select" data-letter="'+letter+'" '+(attempt||stop?"disabled":"")+' aria-pressed="'+(choice===letter)+'"><b>'+letter+'</b><span>'+fmt(q.choices[letter])+'</span>'+(attempt&&q.proposedAnswer===letter?" ✓":attempt&&choice===letter&&!attempt.correct?" ✕":"")+'</button>').join("");
 let result='';
 if(stop){result='<div class="qa-warn"><b>Bloqueada por incidencia identificada:</b><p>'+esc(q.riskFlags.filter(x=>/ERROR DOCUMENTADO|SCD2:|Watermark:/.test(x)).join(" · "))+'</p></div>'}
 else if(attempt){result='<div class="qa-result '+(attempt.correct?"yes":"no")+'">'+(attempt.correct?"✓ Coincide":"✕ No coincide")+' con la respuesta propuesta por el autor ('+esc(q.proposedAnswer)+'). <b>Sin validación técnica.</b></div>'+
 '<button class="button ghost small" data-qact="explain">'+(showWhy?"Ocultar":"Mostrar")+' explicación original</button>'+
 (showWhy?'<div class="qa-explain">'+fmt(q.proposedExplanation||"Sin explicación disponible")+'</div>':"")}
 else result='<div class="qa-actions"><button class="button primary" data-qact="check" '+(!choice?"disabled":"")+'>Comprobar</button><span>Doble clic sobre una opción para comprobar</span></div>';
 return '<section class="qa-question"><div class="qa-qhead"><b>'+esc(q.id)+'</b><span>'+esc(AREAS[q.domain2026]||"Sin área")+'</span><span>'+esc(q.difficulty)+'</span><span>'+(currentIndex+1)+' / '+filtered.length+'</span></div>'+
 '<h2>'+fmt(q.question)+'</h2>'+(q.scenario?'<div class="qa-scenario"><b>Escenario</b><p>'+fmt(q.scenario)+'</p></div>':"")+
 '<div class="qa-options">'+answers+'</div>'+result+'<div class="qa-credit">© 2026 Suppaseth Charoenkarnka · MIT · <a href="'+esc(q.sourceUrl)+'" target="_blank" rel="noopener noreferrer">Ver origen ↗</a></div></section>';
}
function draw(){
 if(!root||!root.isConnected)return;
 filtered=subset();
 currentIndex=Math.min(Math.max(0,currentIndex),Math.max(0,filtered.length-1));
 const stats={completed:0,matches:0,errors:0,blocked:0};
 filtered.forEach(q=>{if(blocked(q))stats.blocked++;else if(attempts[q.id]){stats.completed++;if(attempts[q.id].correct)stats.matches++;else stats.errors++}});
 const q=filtered[currentIndex];
 root.querySelector("#qa-view").innerHTML=selectors()+
 '<div class="qa-stats"><b>'+filtered.length+' candidatas</b> · '+stats.completed+' contestadas · '+stats.matches+' coincidencias · '+stats.errors+' diferencias · '+stats.blocked+' bloqueadas <a href="https://github.com/TheHavoc10/databricks-data-engineer-professional-simulator/blob/main/quiz/INVENTARIO.md" target="_blank" rel="noopener noreferrer">Inventario completo ↗</a></div>'+
 (q?'<div class="qa-layout"><div class="qa-main">'+questionView(q)+
 '<div class="qa-page-buttons"><button class="button ghost" data-qact="prev" '+(currentIndex===0?"disabled":"")+'>← Anterior</button><button class="button primary" data-qact="next" '+(currentIndex===filtered.length-1?"disabled":"")+'>Siguiente →</button></div></div>'+
 '<aside class="qa-sidebar"><b>Mapa de preguntas</b><p>Verde = coincide con el autor; rojo = diferencia. No demuestra que la solución sea correcta.</p><div class="qa-grid">'+
 filtered.map((x,i)=>'<button data-qact="goto" data-idx="'+i+'" class="qa-griditem'+(i===currentIndex?" active":"")+(attempts[x.id]?(attempts[x.id].correct?" good":" bad"):"")+(blocked(x)?" blocked":"")+'" title="'+esc(x.id)+'">'+(i+1)+'</button>').join("")+
 '</div></aside></div>':'<div class="panel"><h3>Sin resultados</h3><p>Revisa los filtros seleccionados.</p></div>')+
 '<p class="qa-note">*La clasificación en 9 bloques está generada automáticamente y pendiente de validación. No se importan preguntas de bancos comerciales. El progreso de este archivo se guarda localmente, por separado del progreso de lecciones.</p>';
}
function check(){
 const q=filtered[currentIndex];
 if(!q||blocked(q)||!picked[q.id])return;
 if(!attempts[q.id]){attempts[q.id]={letter:picked[q.id],correct:picked[q.id]===q.proposedAnswer};save()}
 showWhy=false;draw();
}
function onClick(event){
 const b=event.target.closest("[data-qact]");if(!b)return;
 const act=b.dataset.qact,q=filtered[currentIndex];
 if(act==="select"&&q&&!blocked(q)&&!attempts[q.id]){picked[q.id]=b.dataset.letter;save();draw()}
 if(act==="check")check();
 if(act==="explain"){showWhy=!showWhy;draw()}
 if(act==="prev"&&currentIndex>0){currentIndex--;showWhy=false;draw()}
 if(act==="next"&&currentIndex<filtered.length-1){currentIndex++;showWhy=false;draw()}
 if(act==="goto"){currentIndex=Number(b.dataset.idx)||0;showWhy=false;draw()}
}
function onDouble(event){const b=event.target.closest("[data-qact=select]"),q=filtered[currentIndex];if(b&&q&&!blocked(q)&&!attempts[q.id]){picked[q.id]=b.dataset.letter;save();check()}}
function onFilter(event){
 const map={"qa-bank":"bank","qa-area":"area","qa-difficulty":"difficulty","qa-state":"state","qa-search":"search"};
 const key=map[event.target.id];if(!key)return;filters[key]=event.target.value;currentIndex=0;showWhy=false;draw();
}
async function getBank(){
 if(questions)return questions;
 if(!loading)loading=Promise.all(NAMES.map(async name=>{
  const res=await fetch("quiz/candidatos/"+name);
  if(!res.ok)throw Error(name+" no disponible ("+res.status+")");
  return (await res.json()).questions;
 })).then(xs=>{questions=xs.flat();if(questions.length!==196)throw Error("Inventario incompleto: "+questions.length+"/196");return questions}).catch(e=>{loading=null;throw e});
 return loading;
}
async function mount(){
 root=document.querySelector("#qa-root");if(!root)return;
 if(!root.dataset.bound){root.dataset.bound="1";root.addEventListener("click",onClick);root.addEventListener("dblclick",onDouble);root.addEventListener("change",onFilter);}
 try{await getBank();if(root&&root.isConnected&&location.hash.startsWith("#/simulator"))draw();}
 catch(e){if(root&&root.isConnected)root.querySelector("#qa-view").innerHTML='<div class="qa-warn"><b>Error al cargar:</b> '+esc(e.message)+'. Comprueba que el despliegue incluya la carpeta quiz/candidatos.</div>'}
}
window.DE_QUESTION_ARCHIVE={shell,mount};
})();