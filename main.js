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
  document.querySelectorAll('.reveal,.step').forEach(function(el){io.observe(el)});

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
