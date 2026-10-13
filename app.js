'use strict';
const config=window.EVENTS_CONFIG||{};
const gallery=document.querySelector('#gallery');
const count=document.querySelector('#gallery-count');
const more=document.querySelector('#more');
const lightbox=document.querySelector('#lightbox');
let portfolio=[], filtered=[], shown=8, current=0, lastTrigger=null;
const labels={birthday:'Birthdays',shower:'Showers & milestones',details:'The little extras'};
const featuredOrder=[4,18,9,1,15,5,12,7];
function portfolioRank(item){const number=Number(item.file.match(/(\d+)\./)[1]);const rank=featuredOrder.indexOf(number);return rank<0?featuredOrder.length+number:rank;}
function render(){
  gallery.replaceChildren();
  filtered.slice(0,shown).forEach((item,index)=>{
    const button=document.createElement('button');
    button.className='gallery-card';button.type='button';
    button.setAttribute('aria-label',`View ${item.title}`);
    const holder=document.createElement('div');holder.className='gallery-image';
    const img=document.createElement('img');img.src='/'+item.file;
    img.alt=item.title+' — event styling by Events by Emcee Co.';
    img.loading='lazy';img.width=640;img.height=853;
    const plus=document.createElement('span');plus.className='view-mark';
    plus.innerHTML='<svg class="ui-icon" viewBox="0 0 24 24"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/></svg>';
    plus.setAttribute('aria-hidden','true');holder.append(img,plus);
    const caption=document.createElement('div');caption.className='gallery-caption';
    const number=document.createElement('span');number.className='gallery-number';
    number.textContent=String(index+1).padStart(2,'0');number.setAttribute('aria-hidden','true');
    const words=document.createElement('div');words.className='gallery-words';
    const title=document.createElement('strong');title.textContent=item.title;
    const category=document.createElement('small');category.textContent=labels[item.category];
    words.append(title,category);caption.append(number,words);button.append(holder,caption);
    button.addEventListener('click',()=>{current=index;lastTrigger=button;showPhoto();lightbox.showModal();document.body.classList.add('modal-open');});
    gallery.append(button);
  });
  count.textContent=`Showing ${Math.min(shown,filtered.length)} of ${filtered.length} happy moments`;
  more.hidden=shown>=filtered.length;
}
function showPhoto(){const p=filtered[current];document.querySelector('#lightbox-image').src='/'+p.file;document.querySelector('#lightbox-image').alt=p.title;document.querySelector('#lightbox-title').textContent=`${p.title} · ${current+1} / ${filtered.length}`;document.querySelector('#lightbox-source').href=p.post;}
function movePhoto(direction){current=(current+direction+filtered.length)%filtered.length;showPhoto();}
fetch('/portfolio.json').then(r=>{if(!r.ok)throw Error('Portfolio unavailable');return r.json();}).then(data=>{portfolio=[...data].sort((a,b)=>portfolioRank(a)-portfolioRank(b));filtered=[...portfolio];render();}).catch(()=>{const p=document.createElement('p');p.textContent='See our latest celebrations on Instagram using the link below.';gallery.append(p);more.hidden=true;});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});filtered=portfolio.filter(p=>button.dataset.filter==='all'||p.category===button.dataset.filter);shown=8;render();}));
more.addEventListener('click',()=>{const previous=shown;shown+=8;render();gallery.children[previous]?.focus({preventScroll:true});});
document.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
document.querySelector('.lightbox-prev').addEventListener('click',()=>movePhoto(-1));
document.querySelector('.lightbox-next').addEventListener('click',()=>movePhoto(1));
lightbox.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastTrigger?.focus({preventScroll:true});});
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();movePhoto(-1);}if(e.key==='ArrowRight'){e.preventDefault();movePhoto(1);}});
const menu=document.querySelector('.menu-toggle'), mobile=document.querySelector('#mobile-nav');
function closeMenu(){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');}
menu.addEventListener('click',()=>{mobile.hidden=!mobile.hidden;menu.setAttribute('aria-expanded',String(!mobile.hidden));menu.setAttribute('aria-label',mobile.hidden?'Open menu':'Close menu');});
mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{const input=[...document.querySelectorAll('input[name="services"]')].find(i=>i.value===a.dataset.service);if(input)input.checked=true;}));
const dateInput=document.querySelector('input[type="date"]');const now=new Date();dateInput.min=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
document.querySelector('#year').textContent=now.getFullYear();
const hasEmail=typeof config.bookingEmail==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.bookingEmail);
if(hasEmail){document.querySelector('#form-note').textContent='Prepare an email with your event details. Your email app opens for you to review and send; this does not reserve a date.';}
if(config.calendarUrl){try{const u=new URL(config.calendarUrl);if(u.protocol==='https:'){const a=document.querySelector('#calendar-link');a.href=u.href;a.hidden=false;a.target='_blank';a.rel='noopener';}}catch{}}
document.querySelector('#inquiry-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const body=`Hello Events by Emcee Co.,\n\nI'd love to plan a celebration with you.\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nOccasion: ${data.get('occasion')}\nPreferred date: ${data.get('date')||'Still deciding'}\nLocation: ${data.get('location')||'To be discussed'}\nInterested in: ${data.getAll('services').join(', ')||'To be discussed'}\n\nMy ideas:\n${data.get('details')||'I would love your help finding a direction.'}\n\nPlease let me know about availability and next steps. Thank you!`;document.querySelector('#prepared-inquiry').value=body;document.querySelector('#inquiry-result').hidden=false;document.querySelector('#result-message').textContent=hasEmail?'Your inquiry is ready. Open your email draft, review it, and send when you’re ready.':'Your inquiry is ready. Copy these details and send them to us on Instagram.';if(hasEmail){const a=document.querySelector('#send-email');a.href=`mailto:${config.bookingEmail}?subject=${encodeURIComponent('Event inquiry: '+data.get('occasion'))}&body=${encodeURIComponent(body)}`;a.hidden=false;}document.querySelector('#inquiry-result').scrollIntoView({behavior:'smooth',block:'nearest'});});
document.querySelector('#copy-inquiry').addEventListener('click',async e=>{const area=document.querySelector('#prepared-inquiry');const button=e.currentTarget;try{await navigator.clipboard.writeText(area.value);button.textContent='Copied';}catch{area.focus();area.select();document.querySelector('#result-message').textContent='Select and copy the prepared details above, then send them on Instagram.';}});
