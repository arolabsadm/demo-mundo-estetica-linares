(function(){
'use strict';
var $=function(s){return document.querySelector(s)};

/* menú móvil */
var burger=$('#burger'),menu=$('#menu');
burger.addEventListener('click',function(){
  var o=menu.classList.toggle('open');
  burger.setAttribute('aria-expanded',o);
  burger.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú');
});
menu.addEventListener('click',function(e){if(e.target.tagName==='A'){menu.classList.remove('open');burger.setAttribute('aria-expanded',false);}});

/* reveal */
var els=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el,i){el.style.transitionDelay=(i%3)*70+'ms';io.observe(el)});
}else{els.forEach(function(el){el.classList.add('in')})}

/* calendario de ejemplo */
var today=new Date();today.setHours(0,0,0,0);
var view=new Date(today.getFullYear(),today.getMonth(),1);
var selDay=null,selSlot=null;
var meses=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var slotsEj=['Mañana temprano','Media mañana','Mediodía','Tarde','Última hora'];
function render(){
  $('#month').textContent=meses[view.getMonth()]+' '+view.getFullYear();
  var g=$('#calgrid');g.innerHTML='';
  ['L','M','X','J','V','S','D'].forEach(function(d){var s=document.createElement('div');s.className='dow';s.textContent=d;g.appendChild(s)});
  var first=(new Date(view.getFullYear(),view.getMonth(),1).getDay()+6)%7;
  for(var i=0;i<first;i++)g.appendChild(document.createElement('span'));
  var n=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();
  for(var d=1;d<=n;d++){
    var dt=new Date(view.getFullYear(),view.getMonth(),d),b=document.createElement('button');
    b.type='button';b.textContent=d;
    if(dt<=today||dt.getDay()===0)b.disabled=true;
    if(selDay&&+selDay===+dt)b.className='sel';
    (function(dt){b.addEventListener('click',function(){selDay=dt;selSlot=null;render();showSlots();})})(dt);
    g.appendChild(b);
  }
  $('#prev').disabled=(view.getFullYear()===today.getFullYear()&&view.getMonth()===today.getMonth());
}
function showSlots(){
  var box=$('#slots');box.innerHTML='';$('#book').disabled=true;$('#booknote').textContent='';
  if(!selDay){$('#slots-title').textContent='Elige un día para ver franjas de ejemplo';return}
  $('#slots-title').textContent='Franjas de ejemplo para el '+selDay.getDate()+' de '+meses[selDay.getMonth()]+':';
  slotsEj.forEach(function(t){
    var b=document.createElement('button');b.type='button';b.textContent=t;
    b.addEventListener('click',function(){selSlot=t;[].forEach.call(box.children,function(c){c.classList.remove('sel')});b.classList.add('sel');$('#book').disabled=false;});
    box.appendChild(b);
  });
}
$('#prev').addEventListener('click',function(){view=new Date(view.getFullYear(),view.getMonth()-1,1);render()});
$('#next').addEventListener('click',function(){view=new Date(view.getFullYear(),view.getMonth()+1,1);render()});
$('#book').addEventListener('click',function(){
  $('#booknote').innerHTML='Esto es solo un ejemplo: en tu web real la petición llegaría directamente a Ana Sílvia. Por ahora, <a href="tel:+34953658163">llámanos al 953 65 81 63</a>.';
});
render();

/* asistente de ejemplo (sin datos inventados) */
var resp={
 '¿Qué tratamientos hacéis?':'Hacemos faciales, corporales, láser, depilación, manos y pies (manicura) y pestañas y cejas. Si dudas cuál te conviene, te aconsejamos con calma.',
 '¿Cómo pido cita?':'Llámanos al <a href="tel:+34953658163">953 65 81 63</a>. En una web real aquí también podrías reservar con el calendario de arriba.',
 '¿Dónde estáis?':'En la C. Canalejas, 10, Loc 4 (Pasaje de Fas), 23700 Linares. <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=Mundo+Est%C3%A9tica+Linares+C.+Canalejas+10+Linares">Ver en el mapa</a>.',
 '¿Cuánto cuesta?':'Eso depende de cada tratamiento. Consúltanos por teléfono, <a href="tel:+34953658163">953 65 81 63</a>, y te lo explicamos.'
};
var log=$('#chatlog');
$('#chips').addEventListener('click',function(e){
  var q=e.target.getAttribute&&e.target.getAttribute('data-q');if(!q)return;
  var m=document.createElement('div');m.className='msg me';m.textContent=q;log.appendChild(m);
  var r=document.createElement('div');r.className='msg bot';r.innerHTML=resp[q];
  setTimeout(function(){log.appendChild(r);log.scrollTop=log.scrollHeight},450);
  log.scrollTop=log.scrollHeight;
});
})();
