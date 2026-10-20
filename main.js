(function(){
  var header=document.querySelector('.site-header');
  var progress=document.querySelector('.progress');
  var toTop=document.querySelector('.to-top');
  var parallax=[].slice.call(document.querySelectorAll('[data-parallax]'));

  function onScroll(){
    var y=window.scrollY;
    header.classList.toggle('scrolled',y>40);
    var h=document.documentElement.scrollHeight-window.innerHeight;
    if(progress)progress.style.width=(h>0?(y/h)*100:0)+'%';
    if(toTop)toTop.classList.toggle('show',y>700);
    parallax.forEach(function(el){
      var r=el.parentElement.getBoundingClientRect();
      if(r.bottom<0||r.top>window.innerHeight)return;
      var speed=parseFloat(el.getAttribute('data-parallax'))||.25;
      el.style.transform='translate3d(0,'+(-r.top*speed)+'px,0)';
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  if(toTop)toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

  // Mobile nav
  var burger=document.querySelector('.hamburger');
  burger.addEventListener('click',function(){
    var open=document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded',open);
    document.documentElement.style.overflow=open?'hidden':'';
  });
  document.querySelectorAll('.main-nav a').forEach(function(a){
    a.addEventListener('click',function(){document.body.classList.remove('nav-open');document.documentElement.style.overflow='';});
  });

  // Reveal on scroll
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.15,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal,.img-stack').forEach(function(el){io.observe(el)});

  // Counters
  var co=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target,end=parseFloat(el.getAttribute('data-count')),suf=el.getAttribute('data-suffix')||'',t0=null;
      function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1800,1);var v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(step);}
      requestAnimationFrame(step);co.unobserve(el);
    });
  },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){co.observe(el)});

  // FAQ
  document.querySelectorAll('.faq-item button').forEach(function(b){
    b.addEventListener('click',function(){
      var item=b.parentElement,ans=item.querySelector('.faq-answer'),open=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(o){o.classList.remove('open');o.querySelector('.faq-answer').style.maxHeight=null;o.querySelector('button').setAttribute('aria-expanded','false');});
      if(!open){item.classList.add('open');ans.style.maxHeight=ans.scrollHeight+'px';b.setAttribute('aria-expanded','true');}
    });
  });

  // Testimonials
  var slides=[].slice.call(document.querySelectorAll('.testi'));
  if(slides.length){
    var i=0,timer;
    function show(n){slides[i].classList.remove('active');i=(n+slides.length)%slides.length;slides[i].classList.add('active');}
    function auto(){clearInterval(timer);timer=setInterval(function(){show(i+1)},7000);}
    var prev=document.querySelector('[data-testi="prev"]'),next=document.querySelector('[data-testi="next"]');
    if(prev)prev.addEventListener('click',function(){show(i-1);auto();});
    if(next)next.addEventListener('click',function(){show(i+1);auto();});
    auto();
  }

  // Forms (mockup only)
  document.querySelectorAll('form[data-enquiry]').forEach(function(f){
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      f.style.display='none';
      var ok=f.parentElement.querySelector('.form-success');
      if(ok)ok.classList.add('show');
    });
  });

  // Clickable service cards preselect the enquiry type
  document.querySelectorAll('[data-service]').forEach(function(c){
    c.addEventListener('click',function(){
      var v=c.getAttribute('data-service');
      document.querySelectorAll('select[data-service-select]').forEach(function(s){
        [].slice.call(s.options).forEach(function(o){if(o.text===v)s.value=o.value||o.text;});
      });
    });
  });

  var yr=document.getElementById('year');if(yr)yr.textContent=new Date().getFullYear();
})();
