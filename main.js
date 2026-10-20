(function(){
  var header=document.querySelector('.site-header');
  var progress=document.querySelector('.progress');
  var toTop=document.querySelector('.to-top');
  var parallax=[].slice.call(document.querySelectorAll('[data-parallax]'));
  var lastY=0;

  function onScroll(){
    var y=window.scrollY;
    header.classList.toggle('scrolled',y>30);
    if(!document.body.classList.contains('nav-open')){
      header.classList.toggle('hide',y>lastY&&y>400);
    }
    lastY=y;
    var h=document.documentElement.scrollHeight-window.innerHeight;
    if(progress)progress.style.width=(h>0?y/h*100:0)+'%';
    if(toTop)toTop.classList.toggle('show',y>800);
    parallax.forEach(function(el){
      var r=el.parentElement.getBoundingClientRect();
      if(r.bottom<0||r.top>window.innerHeight)return;
      var s=parseFloat(el.getAttribute('data-parallax'))||.15;
      el.style.transform='translate3d(0,'+(-(r.top)*s-r.height*.08)+'px,0)';
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
  if(toTop)toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

  // Menu
  var burger=document.querySelector('.hamburger');
  function closeNav(){document.body.classList.remove('nav-open');burger.setAttribute('aria-expanded','false');document.documentElement.style.overflow='';}
  burger.addEventListener('click',function(){
    var open=!document.body.classList.contains('nav-open');
    if(open){document.body.classList.add('nav-open');header.classList.remove('hide');burger.setAttribute('aria-expanded','true');document.documentElement.style.overflow='hidden';}
    else closeNav();
  });
  document.querySelectorAll('.main-nav a').forEach(function(a){a.addEventListener('click',closeNav)});

  // Reveal
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.15,rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.reveal,.step').forEach(function(el){
    if(el.classList.contains('clip')){
      // clipped elements report zero visibility, so watch the parent
      var po=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){el.classList.add('in');po.disconnect();}})},{threshold:.1});
      po.observe(el.parentElement);
    } else io.observe(el);
  });
  // safety net: never leave an image hidden
  window.addEventListener('load',function(){setTimeout(function(){document.querySelectorAll('.clip.reveal').forEach(function(c){var r=c.parentElement.getBoundingClientRect();if(r.top<window.innerHeight)c.classList.add('in')})},400)});

  // Statement words light up as you scroll
  document.querySelectorAll('[data-words]').forEach(function(st){
    var html=st.innerHTML.replace(/(<em>)(.*?)(<\/em>)/g,function(m,a,b,c){return a+b.split(' ').map(function(w){return '<span class="w">'+w+'</span>'}).join(' ')+c;});
    var parts=html.split(/(<em>.*?<\/em>)/g).map(function(p){
      if(p.indexOf('<em>')===0)return p;
      return p.split(' ').map(function(w){return w?'<span class="w">'+w+'</span>':''}).join(' ');
    });
    st.innerHTML=parts.join('');
    var words=st.querySelectorAll('.w');
    function light(){
      var r=st.getBoundingClientRect(),vh=window.innerHeight;
      var p=Math.min(Math.max((vh*.85-r.top)/(r.height+vh*.35),0),1);
      var n=Math.round(p*words.length);
      words.forEach(function(w,i){w.classList.toggle('on',i<n)});
    }
    window.addEventListener('scroll',light,{passive:true});light();
  });

  // Counters
  var co=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target,end=parseFloat(el.getAttribute('data-count')),suf=el.getAttribute('data-suffix')||'',t0=null;
      function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1600,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step);}
      requestAnimationFrame(step);co.unobserve(el);
    });
  },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){co.observe(el)});

  // FAQ
  document.querySelectorAll('.faq-item button').forEach(function(b){
    b.addEventListener('click',function(){
      var item=b.parentElement,ans=item.querySelector('.faq-answer'),open=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(o){o.classList.remove('open');o.querySelector('.faq-answer').style.maxHeight=null;o.querySelector('button').setAttribute('aria-expanded','false')});
      if(!open){item.classList.add('open');ans.style.maxHeight=ans.scrollHeight+'px';b.setAttribute('aria-expanded','true')}
    });
  });

  // Clickable rows preselect enquiry type
  document.querySelectorAll('[data-service]').forEach(function(c){
    c.addEventListener('click',function(){
      var v=c.getAttribute('data-service');
      document.querySelectorAll('select[data-service-select]').forEach(function(s){
        [].slice.call(s.options).forEach(function(o){if(o.text===v)s.value=o.value||o.text});
      });
    });
  });

  // Forms (mockup)
  document.querySelectorAll('form[data-enquiry]').forEach(function(f){
    f.addEventListener('submit',function(ev){ev.preventDefault();f.style.display='none';var ok=f.parentElement.querySelector('.form-success');if(ok)ok.classList.add('show');});
  });

  var yr=document.getElementById('year');if(yr)yr.textContent=new Date().getFullYear();
})();

/* ===== Wow scroll effects ===== */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vh=function(){return window.innerHeight};
  var clamp=function(v,a,b){return Math.min(Math.max(v,a),b)};

  // 1. Masked word reveal on section headings (never the hero)
  document.querySelectorAll('section:not(.hero) h2, a.path h3').forEach(function(h){
    var out=[];
    h.childNodes.forEach(function(n){
      if(n.nodeType===3){n.textContent.split(/(\s+)/).forEach(function(t){out.push(/^\s+$/.test(t)||!t?t:'<span class="wl"><span class="wi">'+t+'</span></span>')});}
      else out.push(n.outerHTML);
    });
    h.innerHTML=out.join('');
    h.classList.add('split-h');
    h.querySelectorAll('.wi').forEach(function(w,i){w.style.transitionDelay=(i*0.06)+'s'});
  });
  var hio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');hio.unobserve(e.target)}})},{threshold:.3});
  document.querySelectorAll('.split-h').forEach(function(h){hio.observe(h)});

  // 2. Generic in-view classes for paths, rows, works, stats, cta
  var gio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');gio.unobserve(e.target)}})},{threshold:.18});
  document.querySelectorAll('a.path,a.row,a.work,.stats,.cta .container').forEach(function(el){gio.observe(el)});
  document.querySelectorAll('.index a.row').forEach(function(r,i){r.style.transitionDelay=(i%6*0.05)+'s'});

  // 3. Mark green sections for circle wipe
  document.querySelectorAll('section.bg-green').forEach(function(s){s.classList.add('wipe')});

  var bands=[].slice.call(document.querySelectorAll('.band'));
  var wipes=[].slice.call(document.querySelectorAll('.wipe'));
  var drift=[].slice.call(document.querySelectorAll('.w2,.w4,a.path .pimg'));
  var track=document.querySelector('.marquee-track');
  var mx=0,lastY=window.scrollY,vel=0;

  function frame(){
    var y=window.scrollY,h=vh();
    vel+=((y-lastY)-vel)*.12;lastY=y;

    if(!reduce){
      // band expands from inset to full bleed
      bands.forEach(function(b){
        var r=b.getBoundingClientRect();
        var p=clamp((h-r.top)/(h*.9),0,1);
        b.style.setProperty('--inset',((1-p)*9).toFixed(2)+'%');
      });
      // green sections grow from a circle
      wipes.forEach(function(s){
        var r=s.getBoundingClientRect();
        var p=clamp((h-r.top)/(h*.85),0,1);
        s.style.setProperty('--r',(12+p*90).toFixed(1)+'%');
      });
      // staggered columns drift at different speeds
      if(window.innerWidth>767)drift.forEach(function(el){
        var r=el.getBoundingClientRect();
        if(r.bottom<-200||r.top>h+200)return;
        var c=(r.top+r.height/2-h/2)/h;
        el.style.transform='translate3d(0,'+(c*-60).toFixed(1)+'px,0)';
      });
    }
    // marquee: base speed plus scroll velocity, direction follows scroll
    if(track){
      var half=track.scrollWidth/2;
      mx-=(0.6+Math.abs(vel)*0.35)*(vel<-0.5?-1:1);
      if(mx<=-half)mx+=half; if(mx>0)mx-=half;
      track.style.transform='translate3d('+mx+'px,0,0) skewX('+clamp(-vel*0.25,-10,10)+'deg)';
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // 4. Cursor follower
  if(window.matchMedia('(pointer:fine)').matches&&!reduce){
    var c=document.createElement('div');c.className='cursor';document.body.appendChild(c);
    var tx=0,ty=0,cx=0,cy=0;
    window.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY});
    (function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;c.style.transform='translate('+(cx-c.offsetWidth/2)+'px,'+(cy-c.offsetHeight/2)+'px)';requestAnimationFrame(loop)})();
    document.querySelectorAll('a,button').forEach(function(a){
      a.addEventListener('mouseenter',function(){c.classList.add('big')});
      a.addEventListener('mouseleave',function(){c.classList.remove('big')});
    });
  }
})();
