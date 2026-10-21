/* Academia: contenido y presentación independientes del simulador. */
(function(){
"use strict";
function moduleView(s,c) {
  return '<div class="panel academy-lead"><h3>Lecciones completas de este bloque</h3><p>Entra en cada capítulo, revisa la explicación, razona el caso y valida el ejemplo. El progreso se conecta con el checklist original.</p></div>'+
    '<div class="academy-list">'+s.objectives.map(function(o){
      var l=c.lessons[o.id],p=Number(c.state.objectives[o.id]||0);
      return '<a class="academy-link" href="#/lesson/'+o.id+'"><span class="academy-id">'+o.id+'</span><span class="academy-link-text"><strong>'+c.esc(o.title)+'</strong><small>'+c.esc(l?l.why:'Próximamente')+'</small></span><span class="academy-mark">'+(p===2?'✓':p===1?'◐':'→')+'</span></a>';
    }).join('')+'</div>';
}
function indexView(c) {
  return c.head('ACADEMIA / APRENDIZAJE','45 lecciones para la Professional','Los nueve dominios desarrollados. Estudia la explicación, analiza el código, resuelve un caso y registra tus conocimientos sin salir del campus.')+
    '<div class="callout info"><strong>Método recomendado</strong><p>Parte de los fundamentos, decide ante un escenario y contrasta la solución. Los ejemplos de código se validan en Databricks, no en esta web; cada fragmento explica sus prerrequisitos.</p></div>'+
    c.DATA.sections.map(function(s){
      return '<section class="academy-domain">'+c.sectionBar(s.id+' · '+c.esc(s.name),c.badge(s.weight+'% del examen','accent'))+moduleView(s,c)+'</section>';
    }).join('');
}
function lessonView(id,c) {
  var l=c.lessons[id],o=c.allObjectives.find(function(x){return x.id===id});
  if(!o || !l)return c.notFound();
  var sec=c.DATA.sections.find(function(x){return x.id===o.domain});
  var index=c.allObjectives.findIndex(function(x){return x.id===id});
  var prev=c.allObjectives[index-1],next=c.allObjectives[index+1];
  var state=Number(c.state.objectives[id]||0);
  var labs=c.DATA.labs.filter(function(x){return x.objectiveIds.includes(id)});
  var status='<select class="status-select" data-objective="'+id+'" aria-label="Estado de aprendizaje">'+
    '<option value="0" '+(state===0?'selected':'')+'>○ Pendiente</option>'+
    '<option value="1" '+(state===1?'selected':'')+'>◐ En estudio</option>'+
    '<option value="2" '+(state===2?'selected':'')+'>✓ Dominado</option></select>';
  var notes='<div class="note-box"><label for="academy-note-'+id+'">MIS NOTAS · GUARDADO AUTOMÁTICO</label><textarea id="academy-note-'+id+'" data-note="'+id+'" placeholder="Ideas, dudas, ejemplos y errores que quieras repasar…">'+c.esc(c.state.notes[id]||'')+'</textarea></div>';
  var articles=
    '<section class="panel academy-article"><span class="academy-kicker">01 / FUNDAMENTOS</span><h2>Qué necesitas entender</h2><p>'+c.esc(l.why)+'</p>'+
      '<div class="academy-fabric"><strong>Databricks y Fabric</strong><p>'+c.esc(sec.fabric)+'</p></div></section>'+
    '<section class="panel academy-article"><span class="academy-kicker">02 / PROFUNDIDAD TÉCNICA</span><h2>Mecanismos y límites</h2>'+
      l.mechanics.map(function(x,i){return '<div class="academy-paragraph"><span>'+String(i+1).padStart(2,'0')+'</span><p>'+c.esc(x)+'</p></div>'}).join('')+'</section>'+
    '<section class="panel academy-article"><span class="academy-kicker">03 / PRODUCCIÓN</span><h2>Criterios de decisión</h2>'+
      l.steps.map(function(x,i){return '<div class="academy-check"><span>✓</span><p>'+c.esc(x)+'</p></div>'}).join('')+'</section>'+
    '<section class="academy-article"><span class="academy-kicker">04 / EJEMPLO</span><h2>Implementación y código</h2>'+
      c.codeHtml({title:l.title,language:l.example.language,code:l.example.code,comment:l.example.note})+'</section>'+
    '<section class="panel academy-article"><span class="academy-kicker">05 / CASO RAZONADO</span><h2>Pon a prueba el criterio</h2><p class="academy-question">'+c.esc(l.challenge.question)+'</p>'+
      '<details class="academy-solution"><summary>Mostrar explicación razonada</summary><p>'+c.esc(l.challenge.answer)+'</p></details></section>'+
    '<section class="panel academy-article"><span class="academy-kicker">06 / CONSOLIDACIÓN</span><h2>Lo que no debes olvidar</h2>'+
      '<p><strong>Error habitual:</strong> '+c.esc(o.trap)+'</p><p><strong>Ejercicio:</strong> '+c.esc(o.exercise)+'</p>'+notes+'</section>';
  var side='<aside class="academy-aside"><div class="panel"><div class="panel-heading">OBJETIVO '+id+'</div>'+
    c.badge(sec.weight+'% del examen','accent')+'<h3>Tu estado</h3>'+status+
    '<div class="divider"></div><button type="button" class="button small ghost" data-action="bookmark" data-value="'+id+'">'+(c.state.bookmarks.includes(id)?'★ Quitar favorito':'☆ Añadir a repaso')+'</button>'+
    '<div class="divider"></div><h4>Documentación</h4>'+c.links(l.docs.concat(sec.links.slice(0,2)))+
    '<div class="divider"></div><h4>Laboratorios</h4>'+
    (labs.length?labs.map(function(x){return '<a class="academy-mini" href="#/labs/'+x.id+'">'+x.id+' · '+c.esc(x.title)+' ↗</a>'}).join(''):'<p class="muted small">Aplica el ejercicio guiado de este objetivo.</p>')+
    '<div class="divider"></div><a class="academy-mini" href="#/modules/'+sec.id+'?focus='+id+'">Checklist oficial ↗</a></div></aside>';
  var pager='<div class="academy-pager">'+(prev?'<a class="button ghost" href="#/lesson/'+prev.id+'">← '+prev.id+'</a>':'<span></span>')+
    (next?'<a class="button primary" href="#/lesson/'+next.id+'">'+next.id+' · Siguiente →</a>':'<a class="button primary" href="#/academy">Volver a Academia →</a>')+'</div>';
  return c.head('LECCIÓN '+id+' · '+c.esc(sec.name),l.title,'Explicación técnica, decisiones, ejemplo de código, caso práctico, referencias y notas personales.')+
    '<div class="academy-actions"><a href="#/academy" class="button small ghost">← Academia</a><a href="#/modules/'+sec.id+'" class="button small ghost">Bloque '+sec.id+'</a>'+
    c.badge(state===2?'DOMINADO':state===1?'EN ESTUDIO':'PENDIENTE',state===2?'success':'')+'</div>'+
    '<div class="academy-layout"><article class="academy-content">'+articles+pager+'</article>'+side+'</div>';
}
window.DE_ACADEMY_UI={module:moduleView,index:indexView,lesson:lessonView};
})();