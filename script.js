const MENU = {
  koshary: [
    {id:'k-reg', name:'Regular Koshary', desc:'Rice, lentils, pasta, chickpeas, crispy onions, tomato sauce.', price:55},
    {id:'k-lg', name:'Large Koshary', desc:'The regular, but bigger appetite, bigger bowl.', price:75},
    {id:'k-king', name:'El King Size', desc:'Was 160 EGP, 130 EGP this week only.', price:130},
    {id:'k-xl', name:'Extra Large Koshary', desc:"Chef's new special. Extra yummieness included.", price:100},
  ],
  combo: [
    {id:'c-tiger', name:'El Lols Tiger Combo (Spicy)', desc:'2 spicy King Koshary + 1 liter Pepsi free.', price:190},
    {id:'c-feast', name:'The Family Feast', desc:'4 regular koshary + 4 Pepsi (330 ml). Feeds the whole family.', price:280},
    {id:'c-tiger-mild', name:'El Lols Tiger Combo (Not Spicy)', desc:'2 classic King Koshary, no spice, + 1 liter Pepsi free.', price:190},
  ],
  extras: [
    {id:'e-onion', name:'Extra Crispy Onions', desc:'Because there is no such thing as too much.', price:10},
    {id:'e-daqa', name:"Extra Da'a (Garlic Sauce)", desc:'A little goes a long way. We give you a lot.', price:8},
    {id:'e-spicy', name:'Extra Spicy Sauce', desc:'For the brave.', price:8},
    {id:'e-dawood', name:'Dawood Basha Topping', desc:'Mini meatballs in tomato sauce.', price:35},
  ],
  drinks: [
    {id:'d-pepsi', name:'Pepsi (1 Litre)', desc:'Ice cold 1 litre bottle.', price:20},
    {id:'d-karkade', name:'Karkade', desc:'Cold hibiscus tea.', price:18},
    {id:'d-omali', name:'Om Ali', desc:'Warm bread pudding dessert.', price:45},
    {id:'d-rozblaban', name:'Roz Blaban', desc:'Creamy Egyptian rice pudding, served cold with cinnamon.', price:30},
  ]
};

const BRANCHES = [
  {id:'b-cfc', name:'CFC (Cairo Festival City)', area:'New Cairo', eta:'25–35 min', q:'Cairo Festival City Mall, New Cairo'},
  {id:'b-mad', name:'Madinaty Strip Mall', area:'Madinaty', eta:'25–35 min', q:'Madinaty Strip Mall, Madinaty, Egypt'},
  {id:'b-moe', name:'Mall of Egypt', area:'6th of October', eta:'30–40 min', q:'Mall of Egypt, 6th of October City'},
  {id:'b-golf', name:'Golf City Mall', area:'Golf City', eta:'30–40 min', q:'Golf City Mall, Egypt'},
  {id:'b-maadi', name:'Maadi Corniche', area:'Maadi', eta:'20–30 min', q:'Maadi Corniche, Cairo'},
  {id:'b-down', name:'Downtown Cairo', area:'Downtown', eta:'35–45 min', q:'Downtown Cairo, Egypt'},
];

const SPICE_ITEMS=['k-reg','k-lg','k-king','k-xl'];
let spice={};
function keyOf(id){ return SPICE_ITEMS.includes(id) ? id+'|'+(spice[id]||'mild') : id; }
function baseId(k){ return k.split('|')[0]; }
function vLabel(k){ const v=k.split('|')[1]; return v ? (v==='spicy'?' (Spicy)':' (Not spicy)') : ''; }
function spiceHTML(id){
  const s=spice[id]||'mild';
  return `<div class="spice" id="spice-${id}"><button class="sp ${s==='mild'?'on':''}" onclick="setSpice('${id}','mild')">Not spicy</button><button class="sp hot ${s==='spicy'?'on':''}" onclick="setSpice('${id}','spicy')">🌶 Spicy</button></div>`;
}
function setSpice(id,v){
  spice[id]=v;
  const box=document.getElementById('spice-'+id);
  if(box){ const [a,b]=box.children; a.classList.toggle('on',v==='mild'); b.classList.toggle('on',v==='spicy'); }
  renderCtrl(id);
}
let cart = {}; // key -> qty (koshary keys look like k-reg|spicy)
let selectedBranch = null;

function allItems(){ return [...MENU.koshary, ...MENU.combo, ...MENU.extras, ...MENU.drinks]; }
function itemById(id){ return allItems().find(i=>i.id===id); }

const dots=(c,r,pts)=>pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${c}"/>`).join('');
const onions=(d)=>`<path d="${d}" stroke="#8C5A14" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
const sparkle=(x,y)=>`<path d="M${x} ${y-8}L${x+2} ${y-2}L${x+8} ${y}L${x+2} ${y+2}L${x} ${y+8}L${x-2} ${y+2}L${x-8} ${y}L${x-2} ${y-2}Z" fill="#fff" opacity=".9"/>`;

function bowl(x,y,s,o={}){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-60 0Q-56 50 0 52Q56 50 60 0Z" fill="#FFFDF8" stroke="#B8902B" stroke-width="3"/>
  <path d="M-40 30Q0 38 40 30" stroke="#D4AF37" stroke-width="3" fill="none"/>
  <path d="M-58 2Q-40 -36 0 -38Q40 -36 58 2Z" fill="#F0DCA6"/>
  ${dots('#6B4423',3,[[-40,-6],[-25,-14],[-10,-6],[20,-8],[38,-5],[5,-20],[-30,-22]])}
  ${dots('#D9A55B',4.5,[[-46,-2],[-15,-22],[30,-18],[46,-3],[-2,-10]])}
  <path d="M-35 -12q6 -8 12 0M10 -14q6 -8 12 0M30 -4q6 -8 12 0M-12 -28q6 -6 12 0" stroke="#E9B949" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-24" rx="20" ry="8" fill="${o.spicy?'#A32A08':'#C1440E'}"/>
  ${o.meat?dots('#7A3B1E',7,[[-28,-30],[-12,-36],[8,-38],[26,-30]]):''}
  ${onions('M-22 -34l10 -8M-6 -38l4 -10M8 -36l14 -6M18 -30l12 -4M-30 -24l-10 -6')}
  </g>`;
}
function cup(x,y,fill,inner){
  return `<g transform="translate(${x},${y})"><path d="M-22 0h44l-6 40h-32z" fill="#fff" stroke="#B8902B" stroke-width="3"/>${inner}<ellipse cx="0" cy="0" rx="22" ry="5" fill="${fill}" stroke="#B8902B" stroke-width="2"/></g>`;
}

const PHOTOS={
 "e-dawood": "images/dawood-basha.jpg",
 "c-tiger": "images/tiger-combo.jpg",
 "c-feast": "images/family-feast.jpg",
 "d-rozblaban": "images/roz-blaban.jpg",
 "c-tiger-mild": "images/tiger-combo.jpg",
 "e-daqa": "images/garlic-sauce.jpg",
 "e-spicy": "images/spicy-sauce.jpg",
 "e-onion": "images/crispy-onions.jpg",
 "d-pepsi": "images/pepsi-1-litre.jpg",
 "d-omali": "images/om-ali.jpg",
 "d-karkade": "images/karkade.jpg",
 "k-xl": "images/koshary-extra-large.jpg",
 "k-king": "images/koshary-king-size.jpg",
 "k-lg": "images/koshary-large.jpg",
 "k-reg": "images/koshary-regular.jpg"
};
const LIT={'c-feast':'4 Koshary + 4 Pepsi','d-pepsi':'1 L','c-tiger':'🌶 Spicy · 1 L Pepsi','c-tiger-mild':'Not spicy · 1 L Pepsi'};
function art(id){
  const pk=id;
  if(PHOTOS[pk]){const it=itemById(id);return `<img loading="lazy" decoding="async" class="${id==='d-pepsi'?'contain':''}" src="${PHOTOS[pk]}" alt="${it?it.name:''}">${LIT[id]?`<span class="lit">${LIT[id]}</span>`:''}`;}
  const S=(inner)=>`<svg viewBox="0 0 200 130" aria-hidden="true">${inner}</svg>`;
  const A={
    'k-reg':()=>S(bowl(100,72,.8)),
    'k-lg':()=>S(bowl(100,70,.95)),
    'k-king':()=>S(bowl(100,68,1.08)+sparkle(28,28)+sparkle(174,40)),
    'k-xl':()=>S(bowl(100,68,1.15,{meat:true})+sparkle(24,26)+sparkle(178,34)+sparkle(160,110)),
    'c-tiger':()=>S(bowl(48,74,.5)+bowl(112,74,.5,{spicy:true})+
      `<rect x="164" y="30" width="22" height="80" rx="9" fill="#1F4E9E" stroke="#B8902B" stroke-width="2"/><rect x="169" y="20" width="12" height="14" rx="3" fill="#C1440E"/><rect x="164" y="58" width="22" height="22" fill="#fff"/>`+sparkle(20,24)),
    'e-onion':()=>S(`<ellipse cx="100" cy="98" rx="62" ry="10" fill="#E4BE6A"/>`+onions('M50 92l20 -22M66 96l18 -30M84 90l8 -34M100 96l0 -40M112 90l-6 -30M126 96l-16 -26M142 92l-24 -20M76 84l12 -20M118 86l-14 -18')),
    'e-daqa':()=>S(cup(100,50,'#FFF7E3','<path d="M-16 10h32l-3 22h-26z" fill="#FFF7E3"/>')+`<path d="M78 45q22 -22 44 0" stroke="#4A3418" stroke-width="0" fill="none"/>`),
    'e-spicy':()=>S(cup(100,50,'#C1440E','<path d="M-16 10h32l-3 22h-26z" fill="#C1440E"/>')+`<path d="M140 40q20 6 24 30q-16 -4 -30 -12z" fill="#C1440E"/><path d="M140 40q4 -8 10 -10" stroke="#3E5C2B" stroke-width="3" fill="none"/>`),
    'e-dawood':()=>S(`<g transform="translate(100,60) scale(.85)"><path d="M-60 0Q-56 50 0 52Q56 50 60 0Z" fill="#FFFDF8" stroke="#B8902B" stroke-width="3"/><ellipse cx="0" cy="0" rx="58" ry="14" fill="#C1440E"/>${dots('#7A3B1E',9,[[-30,-8],[-8,-12],[16,-8],[36,-4],[-2,4],[-40,4]])}</g>`),
    'd-pepsi':()=>S(cup(100,40,'#1F4E9E','<path d="M-19 8h38l-4 32h-30z" fill="#1F4E9E"/><rect x="-14" y="18" width="28" height="10" fill="#fff"/>')+`<path d="M108 40l14 -30" stroke="#C1440E" stroke-width="4" stroke-linecap="round"/>`),
    'd-karkade':()=>S(cup(100,40,'#9B1B30','<path d="M-19 8h38l-4 32h-30z" fill="#9B1B30"/><rect x="-10" y="16" width="9" height="9" rx="2" fill="#fff" opacity=".6"/><rect x="2" y="24" width="9" height="9" rx="2" fill="#fff" opacity=".6"/>')+sparkle(150,40)),
    'd-rozblaban':()=>S(`<g transform="translate(100,64) scale(.9)"><path d="M-60 0Q-56 50 0 52Q56 50 60 0Z" fill="#FFFDF8" stroke="#B8902B" stroke-width="3"/><ellipse cx="0" cy="0" rx="58" ry="14" fill="#FFFFFF" stroke="#E4D5B8" stroke-width="2"/>${dots('#B8722C',2.2,[[-30,-3],[-12,-6],[8,-2],[28,-5],[0,4],[-40,3],[38,3],[-20,5],[18,6]])}${dots('#6B2D5C',3.2,[[-24,-1],[14,-4],[-4,2],[32,1]])}</g>`+sparkle(30,30)+sparkle(170,44)),
    'd-omali':()=>S(`<g transform="translate(100,64) scale(.85)"><path d="M-60 0Q-56 50 0 52Q56 50 60 0Z" fill="#FFFDF8" stroke="#B8902B" stroke-width="3"/><ellipse cx="0" cy="0" rx="58" ry="14" fill="#F6E7C1"/>${dots('#B8722C',3,[[-30,-2],[-10,-6],[10,0],[30,-4],[0,4],[-42,4],[42,4]])}${dots('#F3C26B',3.5,[[-20,4],[20,6],[-4,-8]])}</g>`+sparkle(28,30)+sparkle(172,44)),
  };
  return (A[id]||A['k-reg'])();
}

function renderMenu(){
  const map = {koshary:'cat-koshary', combo:'cat-combo', extras:'cat-extras', drinks:'cat-drinks'};
  for(const cat in map){
    const el = document.getElementById(map[cat]);
    el.innerHTML = MENU[cat].map(item=>`
      <div class="item">
        <div class="pic">${art(item.id)}</div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        ${SPICE_ITEMS.includes(item.id)?spiceHTML(item.id):''}
        <div class="row">
          <span class="price">${item.price} EGP</span>
          <div id="ctrl-${item.id}"></div>
        </div>
      </div>
    `).join('');
  }
  allItems().forEach(item=>renderCtrl(item.id));
}

function renderCtrl(id){
  const el = document.getElementById('ctrl-'+id);
  const qty = cart[keyOf(id)]||0;
  if(qty===0){
    el.innerHTML = `<button class="add-btn" onclick="addItem('${id}')">Add +</button>`;
  } else {
    el.innerHTML = `<div class="qty-ctrl">
      <button onclick="changeQty('${id}',-1)">−</button>
      <span>${qty}</span>
      <button onclick="changeQty('${id}',1)">+</button>
    </div>`;
  }
}

function addItem(id){ const k=keyOf(id); cart[k]=(cart[k]||0)+1; renderCtrl(id); renderCart(); }
function changeQty(id,delta){
  const k=keyOf(id);
  cart[k]=(cart[k]||0)+delta;
  if(cart[k]<=0) delete cart[k];
  renderCtrl(id); renderCart();
}

function renderCart(){
  const items = Object.keys(cart);
  const wrap = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const totalQty = items.reduce((s,id)=>s+cart[id],0);
  countEl.textContent = totalQty;
  if(items.length===0){
    wrap.innerHTML = '<div class="empty-cart">Your cart is empty.<br>Add some koshary!</div>';
    checkoutBtn.disabled = true;
  } else {
    wrap.innerHTML = items.map(id=>{
      const it = itemById(baseId(id)); const qty = cart[id];
      return `<div class="cart-line">
        <div><div class="name">${it.name}${vLabel(id)}</div><div class="sub">${qty} × ${it.price} EGP</div></div>
        <div class="price">${qty*it.price} EGP</div>
      </div>`;
    }).join('');
    checkoutBtn.disabled = false;
  }
  const total = items.reduce((s,id)=>s+cart[id]*itemById(baseId(id)).price,0);
  totalEl.textContent = total + ' EGP';
}

function renderBranches(){
  const wrap = document.getElementById('branchList');
  wrap.innerHTML = BRANCHES.map(b=>`
    <div class="branch" id="${b.id}" onclick="selectBranch('${b.id}')">
      <h3>${b.name} <span class="tick">✓</span></h3>
      <p>${b.area}</p>
      <span class="eta">🛵 ${b.eta}</span>
      <a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.q)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">📍 Open in Maps</a>
    </div>
  `).join('');
}

function selectBranch(id){
  selectedBranch = BRANCHES.find(b=>b.id===id);
  document.querySelectorAll('.branch').forEach(el=>el.classList.remove('selected'));
  document.getElementById(id).classList.add('selected');
}

// drawer
const overlay = document.getElementById('overlay');
const drawer = document.getElementById('drawer');
document.getElementById('cartBtn').onclick = ()=>{ overlay.classList.add('open'); drawer.classList.add('open'); };
document.getElementById('closeDrawer').onclick = closeDrawer;
overlay.onclick = closeDrawer;
function closeDrawer(){ overlay.classList.remove('open'); drawer.classList.remove('open'); }

// checkout modal
const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutModal = document.getElementById('checkoutModal');

document.getElementById('checkoutBtn').onclick = ()=>{
  closeDrawer();
  showCheckoutForm();
};

function showCheckoutForm(){
  const branchOptions = BRANCHES.map(b=>`<option value="${b.id}">${b.name} — ${b.eta}</option>`).join('');
  checkoutModal.innerHTML = `
    <h2>Checkout</h2>
    ${selectedBranch ? `<div class="mini-branch-note">Picked up branch selection: <strong>${selectedBranch.name}</strong></div>` : ''}
    <div class="field">
      <label for="nameInput">Your name</label>
      <input id="nameInput" type="text" placeholder="e.g. Youssef">
    </div>
    <div class="field">
      <label for="phoneInput">Phone number</label>
      <input id="phoneInput" type="tel" placeholder="01xxxxxxxxx">
    </div>
    <div class="field">
      <label for="branchSelect">Deliver from branch</label>
      <select id="branchSelect">${branchOptions}</select>
    </div>
    <div class="field">
      <label for="addrInput">Delivery address</label>
      <input id="addrInput" type="text" placeholder="Street, building, floor">
    </div>
    <button class="checkout-btn" onclick="placeOrder()">Place order — pay on delivery</button>
  `;
  if(selectedBranch){
    checkoutOverlay.querySelector ? null : null;
  }
  checkoutOverlay.classList.add('open');
  // preselect branch dropdown if one was chosen on the page
  if(selectedBranch){ document.getElementById('branchSelect').value = selectedBranch.id; }
}

function placeOrder(){
  const name = document.getElementById('nameInput').value.trim() || 'friend';
  const branchId = document.getElementById('branchSelect').value;
  const branch = BRANCHES.find(b=>b.id===branchId);
  showTracker(name, branch);
  cart = {}; renderMenu(); renderCart();
}

function showTracker(name, branch){
  checkoutModal.innerHTML = `
    <div class="tracker">
      <div class="big-emoji">🛵</div>
      <h2>Thanks, ${name}!</h2>
      <p style="color:var(--ink-soft)">Your order is on its way from <strong>${branch.name}</strong>.</p>
      <div class="steps">
        <div class="fill" id="fill"></div>
        <div class="step" id="s1"><div class="dot">1</div><span>Placed</span></div>
        <div class="step" id="s2"><div class="dot">2</div><span>Preparing</span></div>
        <div class="step" id="s3"><div class="dot">3</div><span>On the way</span></div>
        <div class="step" id="s4"><div class="dot">4</div><span>Delivered</span></div>
      </div>
      <div class="eta-box" id="etaBox">Estimated arrival: ${branch.eta}</div>
      <p style="font-size:.78rem; color:var(--ink-soft); margin-top:16px;">This is a demo order — nothing was actually cooked or delivered.</p>
      <button class="checkout-btn" style="margin-top:10px; background:var(--ink-soft);" onclick="closeCheckout()">Close</button>
    </div>
  `;
  const stages = [
    {id:'s1', fill:0},
    {id:'s2', fill:33, delay:1200},
    {id:'s3', fill:66, delay:3200},
    {id:'s4', fill:100, delay:5500},
  ];
  document.getElementById('s1').classList.add('active');
  stages.forEach(st=>{
    if(st.delay){
      setTimeout(()=>{
        document.getElementById(st.id).classList.add('active');
        document.getElementById('fill').style.width = st.fill+'%';
        if(st.id==='s4'){
          document.getElementById('etaBox').textContent = '🎉 Delivered — enjoy your koshary!';
        }
      }, st.delay);
    }
  });
}

function closeCheckout(){ checkoutOverlay.classList.remove('open'); }
checkoutOverlay.addEventListener('click', (e)=>{ if(e.target===checkoutOverlay) closeCheckout(); });

renderMenu();
renderCart();
renderBranches();

// ---- "Install as app" banner (phones only) ----
(function(){
  const bar=document.getElementById('installBar'); if(!bar) return;
  if(window.matchMedia('(display-mode: standalone)').matches||navigator.standalone) return;
  try{ if(localStorage.getItem('ellols-install-x')) return; }catch(e){}
  const ua=navigator.userAgent, ios=/iphone|ipad|ipod/i.test(ua), mobile=/android|iphone|ipad|ipod/i.test(ua);
  if(!mobile) return;
  const txt=document.getElementById('installTxt'), btn=document.getElementById('installBtn'); let dp=null;
  window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); dp=e; txt.textContent='Install the El Lols app'; btn.style.display=''; bar.hidden=false; });
  if(ios){ txt.textContent='To install: tap Share, then Add to Home Screen'; btn.style.display='none'; bar.hidden=false; }
  else setTimeout(()=>{ if(bar.hidden){ txt.textContent='To install: open the browser menu, then Add to Home screen'; btn.style.display='none'; bar.hidden=false; } },2500);
  btn.onclick=async()=>{ if(dp){ dp.prompt(); await dp.userChoice; bar.hidden=true; } };
  document.getElementById('installX').onclick=()=>{ bar.hidden=true; try{ localStorage.setItem('ellols-install-x','1'); }catch(e){} };
})();

if('serviceWorker' in navigator && location.protocol.startsWith('http')){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
