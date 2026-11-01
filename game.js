'use strict';
const $=id=>document.getElementById(id);
function shuffled(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
function clone(value){return JSON.parse(JSON.stringify(value));}
function createEl(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function validateBank(bank){
  if(!Array.isArray(bank)||bank.length>300)return 'File harus berisi daftar, maksimal 300 soal.';
  const ids=new Set();
  for(const q of bank){
    if(!q||typeof q.id!=='string'||!q.id.trim()||ids.has(q.id))return 'Setiap soal harus mempunyai ID yang berbeda.';
    ids.add(q.id);
    if(!['Mudah','Sedang','Sulit'].includes(q.difficulty))return 'Tingkat soal harus Mudah, Sedang, atau Sulit.';
    if(typeof q.question!=='string'||!q.question.trim()||q.question.length>400)return 'Pertanyaan harus diisi, maksimal 400 karakter.';
    if(!Array.isArray(q.options)||q.options.length!==4||q.options.some(v=>typeof v!=='string'||!v.trim()||v.length>200)||new Set(q.options.map(v=>v.trim().toLowerCase())).size!==4)return 'Setiap soal perlu empat pilihan berbeda, maksimal 200 karakter per pilihan.';
    if(!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>3)return 'Kunci jawaban harus bernilai 0–3.';
    if(typeof q.explanation!=='string'||!q.explanation.trim()||q.explanation.length>600)return 'Setiap soal perlu pembahasan, maksimal 600 karakter.';
  }
  if(['Mudah','Sedang','Sulit'].some(level=>bank.filter(q=>q.difficulty===level).length<8))return 'Sediakan minimal 8 soal untuk setiap tingkat.';
  return '';
}
class GameAudio {
  constructor(){this.muted=true;this.context=null;}
  init(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!this.context&&Audio)this.context=new Audio();this.context?.resume().catch(()=>{});}catch(error){}}
  play(correct=true){if(this.muted)return;this.init();if(!this.context)return;const now=this.context.currentTime;const notes=correct?[523.25,659.25,783.99]:[330,261.63];notes.forEach((hz,i)=>{const oscillator=this.context.createOscillator(),gain=this.context.createGain();oscillator.type='triangle';oscillator.frequency.value=hz;gain.gain.setValueAtTime(0,now+i*.09);gain.gain.linearRampToValueAtTime(.09,now+i*.09+.02);gain.gain.exponentialRampToValueAtTime(.001,now+i*.09+.2);oscillator.connect(gain);gain.connect(this.context.destination);oscillator.start(now+i*.09);oscillator.stop(now+i*.09+.22);});}
}
class AchievementGame {
  constructor(){
    this.state='home';this.players=[];this.history=[];this.bank=clone(DEFAULT_QUESTION_BANK);this.config={mode:'solo',difficulty:'Mudah',control:'touch',hold:2000,reach:'seated'};
    try{const saved=JSON.parse(localStorage.getItem('bintang_prestasi_bank_v1'));if(saved&&!validateBank(saved))this.bank=saved;}catch(error){}
    this.audio=new GameAudio();this.tracker=new PalmOnlyDetector($('camera'),$('hand-canvas'));this.practice=new HoldSelector();this.practiceDone=false;this.lastFrame=performance.now();this.tourneyIndex=0;this.tourneyScores=[];this.savedFocus=null;this.wire();
    this.loop=this.loop.bind(this);requestAnimationFrame(this.loop);
  }
  async refreshCameras(){
    try{
      const select=$('camera-source'),selected=select.value;
      const devices=await navigator.mediaDevices.enumerateDevices();
      select.querySelectorAll('[data-camera]').forEach(el=>el.remove());
      devices.filter(d=>d.kind==='videoinput'&&d.deviceId).forEach((d,i)=>{const option=createEl('option','',d.label||('Kamera '+(i+1)));option.value='device:'+d.deviceId;option.dataset.camera='1';select.append(option);});
      select.value=selected;
    }catch(error){/* Front/back presets still work if device enumeration is restricted. */}
  }
  screen(name){['home','calibration','play','results'].forEach(id=>$(id).classList.toggle('hidden',name!==id));this.state=name;$('stage').classList.toggle('camera-active',this.config.control==='camera'&&['calibration','play'].includes(name)&&Boolean(this.tracker.stream));}
  toast(message){$('toast').textContent=message;$('toast').classList.remove('hidden');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>$('toast').classList.add('hidden'),4200);}
  openModal(id){this.savedFocus=document.activeElement;$(id).classList.remove('hidden');$(id).querySelector('button,select,input')?.focus();}
  closeModal(id){$(id).classList.add('hidden');this.savedFocus?.focus?.();}
  wire(){
    $('start').onclick=()=>{this.audio.init();this.config={mode:$('mode').value,difficulty:$('difficulty').value,control:$('control').value,hold:Number($('hold-time').value),reach:$('reach').value};if(this.config.control==='camera'){this.practice=new HoldSelector(this.config.hold);this.practiceDone=false;$('practice-label').textContent='Arahkan telapak ke sini';$('practice').classList.remove('ready');$('camera-status').textContent='Aktifkan kamera untuk mulai latihan.';this.screen('calibration');}else this.startSession();};
    $('enable-camera').onclick=async()=>{const button=$('enable-camera');button.disabled=true;$('camera-source').disabled=true;$('sensor-mode').disabled=true;$('camera-status').textContent='Memuat kamera dan sensor telapak…';try{const ready=await this.tracker.start({camera:$('camera-source').value,preference:$('sensor-mode').value,numHands:['duel','coop'].includes(this.config.mode)?2:1});if(this.state!=='calibration'){this.tracker.stop();return;}if(ready){await this.refreshCameras();$('mirror-camera').textContent=this.tracker.mirror?'Cermin: aktif':'Cermin: mati';$('camera-status').textContent='Kamera siap: '+this.tracker.cameraLabel+'. Tampilkan telapak hingga titik kuning muncul.';$('stage').classList.add('camera-active');this.practice=new HoldSelector(this.config.hold);this.practiceDone=false;$('practice-label').textContent='Arahkan telapak ke sini';$('practice').classList.remove('ready');}}catch(error){const messages={NotAllowedError:'Izin kamera belum diberikan. Izinkan kamera di browser atau gunakan sentuh.',NotFoundError:'Kamera tidak ditemukan. Sambungkan kamera atau gunakan sentuh.',NotReadableError:'Kamera sedang digunakan aplikasi lain. Tutup aplikasi tersebut lalu coba lagi.',SecurityError:'Kamera diblokir. Buka game lewat https:// (bukan file://).',OverconstrainedError:'Kamera tidak cocok dengan pengaturan. Muat ulang kamera.'};$('camera-status').textContent=messages[error.name]||error.message;this.tracker.stop();$('stage').classList.remove('camera-active');}finally{button.disabled=false;$('camera-source').disabled=false;$('sensor-mode').disabled=false;button.textContent='↻ Muat ulang kamera';}};
    $('camera-source').onchange=$('sensor-mode').onchange=()=>{if(this.state==='calibration'&&!$('enable-camera').disabled)$('enable-camera').click();};
    $('mirror-camera').onclick=()=>{this.tracker.setMirror(!this.tracker.mirror);$('mirror-camera').textContent=this.tracker.mirror?'Cermin: aktif':'Cermin: mati';this.practice.reset();};
    $('hold-time').onchange=()=>{this.config.hold=Number($('hold-time').value);this.practice=new HoldSelector(this.config.hold);this.practiceDone=false;$('practice').classList.remove('ready');$('practice-label').textContent='Arahkan telapak ke sini';};
    $('reach').onchange=()=>this.config.reach=$('reach').value;
    $('practice').onclick=()=>{this.toast('Untuk berlatih kamera, arahkan titik kuning ke kotak. Sentuh tetap tersedia saat bermain.');};
    $('begin-camera-game').onclick=()=>{if(!this.tracker.ready){this.toast('Aktifkan kamera hingga sensor siap, atau pilih Main dengan sentuh saja.');return;}this.startSession();};
    $('use-touch').onclick=()=>{this.config.control='touch';$('control').value='touch';this.tracker.stop();this.startSession();};
    $('calib-back').onclick=()=>this.goHome();$('results-home').onclick=()=>this.goHome();$('again').onclick=()=>{if(this.config.control==='camera'){this.screen('calibration');$('camera-status').textContent='Aktifkan kembali kamera, lalu masuk permainan.';}else this.startSession();};
    $('pause').onclick=()=>this.pause();$('resume').onclick=()=>this.resume();$('restart').onclick=()=>{$('pause-modal').classList.add('hidden');this.startSession();};$('quit').onclick=()=>this.goHome();$('live-touch').onclick=()=>{this.config.control='touch';this.tracker.stop();$('stage').classList.remove('camera-active');$('live-touch').classList.add('hidden');this.updateControlHint();this.toast('Kontrol sentuh / mouse / keyboard aktif.');};
    $('next-turn').onclick=()=>{$('turn-modal').classList.add('hidden');this.launchRound();};
    $('open-guide').onclick=()=>this.openModal('guide-modal');$('open-bank').onclick=()=>{this.renderBank();this.openModal('bank-modal');};document.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>this.closeModal(button.dataset.close));
    $('bank-filter').onchange=()=>this.renderBank();$('export-bank').onclick=()=>this.downloadBank();$('import-bank').onchange=event=>this.importBank(event);$('reset-bank').onclick=()=>{if(!window.confirm('Pulihkan 75 soal bawaan? Ekspor dahulu jika ingin menyimpan perubahan.'))return;this.bank=clone(DEFAULT_QUESTION_BANK);this.saveBank();this.renderBank();$('bank-status').textContent='75 soal bawaan dipulihkan.';};
    document.querySelectorAll('.sound-btn').forEach(button=>button.onclick=()=>{this.audio.muted=!this.audio.muted;this.audio.init();button.textContent=this.audio.muted?'♪':'♫';button.setAttribute('aria-label',this.audio.muted?'Aktifkan suara':'Matikan suara');button.title=this.audio.muted?'Suara mati':'Suara aktif';this.audio.play();});
    document.querySelectorAll('.fullscreen-btn').forEach(button=>button.onclick=async()=>{try{if(document.fullscreenElement){await document.exitFullscreen();}else{if(!document.documentElement.requestFullscreen){this.toast('Layar penuh tidak tersedia di browser ini. Putar perangkat mendatar.');return;}await document.documentElement.requestFullscreen();try{await screen.orientation?.lock?.('landscape');}catch(error){}}}catch(error){this.toast('Gunakan fitur layar penuh browser atau putar perangkat mendatar.');}});
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&this.state==='play')this.pause();});
    window.addEventListener('resize',()=>{this.players.forEach(p=>p.selector.requireRelease());this.tracker.hands=[];});
    window.addEventListener('keydown',event=>{
      const modal=[...document.querySelectorAll('.modal')].find(el=>!el.classList.contains('hidden'));
      if(modal){if(event.key==='Tab'){const controls=[...modal.querySelectorAll('button,input,select,textarea,a[href]')].filter(el=>!el.disabled&&el.offsetParent!==null);const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}if(event.key==='Escape'){if(modal.id==='pause-modal')this.resume();else if(['guide-modal','bank-modal'].includes(modal.id))this.closeModal(modal.id);}return;}
      if(this.state!=='play'||event.repeat||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
      if(event.key==='Escape'){this.pause();return;}
      const key=event.key.toUpperCase(),p1={Q:0,W:1,A:2,S:3,'1':0,'2':1,'3':2,'4':3},p2={I:0,O:1,K:2,L:3};
      if(key in p1){event.preventDefault();this.answer(0,p1[key]);}else if(key in p2){event.preventDefault();this.answer(this.players.length===2?1:0,p2[key]);}
    });
  }
  buildQuestions(){const pool=shuffled(this.bank.filter(q=>q.difficulty===this.config.difficulty)).slice(0,8);return pool.map(q=>{const options=shuffled(q.options.map((text,index)=>({text,correct:index===q.correctIndex})));return{...clone(q),options:options.map(o=>o.text),correctIndex:options.findIndex(o=>o.correct)};});}
  startSession(){
    const validation=validateBank(this.bank);if(validation){this.toast(validation);return;}
    this.history=[];this.packet=this.buildQuestions();this.tourneyIndex=0;this.tourneyScores=[];this.comScore=0;
    const accuracy={Mudah:.6,Sedang:.7,Sulit:.8}[this.config.difficulty];this.comAnswers=this.packet.map(()=>Math.random()<accuracy);
    $('stage').classList.toggle('reach-standing',this.config.reach==='standing');
    if(this.config.mode==='tourney'){this.screen('play');$('players').replaceChildren();$('session-label').textContent='LOMBA 4 PEMAIN';$('turn-title').textContent='Giliran Pemain 1';this.state='turn';this.openModal('turn-modal');}else this.launchRound();
  }
  personalQuestions(){return shuffled(clone(this.packet)).map(q=>{const opts=shuffled(q.options.map((text,i)=>({text,correct:i===q.correctIndex})));return{...q,options:opts.map(o=>o.text),correctIndex:opts.findIndex(o=>o.correct)};});}
  makePlayer(name){const selector=new HoldSelector(this.config.hold);if(this.config.control==='camera')selector.requireRelease();return{name,questions:this.personalQuestions(),index:0,score:0,correct:0,reading:3000,time:40000,feedback:null,finished:false,selector};}
  launchRound(){
    const names=this.config.mode==='duel'?['P1 · Raka','P2 · Naya']:this.config.mode==='coop'?['Tim Raka & Naya']:this.config.mode==='tourney'?[`Pemain ${this.tourneyIndex+1}`]:['Raka · Pemain 1'];
    this.players=names.map(name=>this.makePlayer(name));if(this.players.length===2){for(let i=0;i<8&&this.players[0].questions[0].id===this.players[1].questions[0].id;i++)this.players[1].questions=this.personalQuestions();}this.screen('play');$('players').classList.toggle('duel',this.players.length===2);$('players').replaceChildren();
    $('session-label').textContent=`${this.config.difficulty==='Sulit'?'Menantang':this.config.difficulty} · Hak & Kewajiban${this.config.mode==='tourney'?` · Giliran ${this.tourneyIndex+1}/4`:''}`;
    this.players.forEach((p,i)=>this.renderPlayer(p,i));this.updateControlHint();this.updateComputer();this.lastFrame=performance.now();
  }
  renderPlayer(p,index){
    const panel=createEl('section','player');panel.id=`player-${index}`;panel.setAttribute('aria-label',p.name);
    panel.innerHTML=`<div class="player-top"><span class="player-name"></span><span class="player-count"></span><span class="player-points"></span></div><div class="question-box"><div class="question-meta"><span class="question-context"></span><span class="timer"></span></div><h2 class="question-text"></h2></div><div class="answer-area"></div><div class="feedback hidden" role="status"></div>`;
    $('players').append(panel);p.el=panel;p.buttons=[];
    for(let q=0;q<4;q++){const button=createEl('button','answer bubble b'+q);button.innerHTML=`<span class="answer-letter">${'ABCD'[q]}</span><span class="answer-text"></span><span class="answer-key">${index===0?'QWAS'[q]:'IOKL'[q]}</span><i class="answer-progress"></i>`;button.onclick=()=>this.answer(index,q);button.onpointerenter=e=>{if(e.pointerType==='mouse')button.dataset.hover='1';};button.onpointerleave=()=>{delete button.dataset.hover;};panel.querySelector('.answer-area').append(button);p.buttons.push(button);}
    this.showQuestion(p,index);
  }
  showQuestion(p,index){
    const q=p.questions[p.index];p.el.querySelector('.player-name').textContent=p.name;p.el.querySelector('.player-count').textContent=`Misi ${Math.min(p.index+1,p.questions.length)}/${p.questions.length}`;p.el.querySelector('.player-points').textContent=`✦ ${p.score}`;
    p.el.querySelector('.question-text').textContent=q.question;p.el.querySelector('.question-context').textContent=`${q.context||'Hak & kewajiban'} · ${q.id}`;p.el.querySelector('.timer').textContent='Baca dulu · 3 dtk';
    p.buttons.forEach((button,i)=>{button.querySelector('.answer-text').textContent=q.options[i];button.setAttribute('aria-label',`${'ABCD'[i]}. ${q.options[i]}`);button.classList.remove('correct','wrong','active-hold');button.querySelector('.answer-progress').style.width='0%';button.disabled=true;button.style.setProperty('--hold',0);button.style.setProperty('--i',i);button.removeAttribute('data-ready');button.classList.remove('enter');void button.offsetWidth;button.classList.add('enter');});p.bubbles=null;p.el.classList.remove('answered');
    p.el.querySelector('.feedback').className='feedback hidden';p.nextButton=null;
  }
  answer(index,choice){
    const p=this.players[index];if(this.state!=='play'||!p||p.finished||p.feedback||p.reading>0)return false;
    const q=p.questions[p.index],correct=choice===q.correctIndex;p.score+=correct?100:0;p.correct+=correct?1:0;p.feedback={correct,choice,left:correct?1700:2500};p.el.classList.add('answered');p.selector.requireRelease();this.audio.play(correct);
    this.history.push({player:p.name,question:q.question,chosen:choice===-1?'Waktu habis':q.options[choice],answer:q.options[q.correctIndex],correct,explanation:q.explanation});
    if(['solo','coop'].includes(this.config.mode)){this.comScore+=this.comAnswers[p.index]?100:0;this.updateComputer();}
    p.el.querySelector('.player-points').textContent=`✦ ${p.score}`;p.buttons.forEach((button,i)=>{button.disabled=true;button.classList.toggle('correct',i===q.correctIndex);button.classList.toggle('wrong',i===choice&&!correct);button.classList.remove('active-hold');button.querySelector('.answer-progress').style.width='0%';});
    const feedback=p.el.querySelector('.feedback');feedback.className='feedback '+(correct?'correct':'wrong');feedback.replaceChildren(createEl('h3','',correct?'✦ Benar! +100 poin':choice===-1?'⏱ Waktu habis':'✕ Belum tepat'));if(!correct)feedback.append(createEl('p','',`Jawaban: ${q.options[q.correctIndex]}`));
    p.nextButton=null;feedback.classList.remove('hidden');return true;
  }
  nextQuestion(index){const p=this.players[index];if(this.state!=='play'||!p?.feedback||p.finished)return;p.index++;p.feedback=null;p.selector.requireRelease();if(p.index>=p.questions.length){p.finished=true;p.nextButton=null;const feedback=p.el.querySelector('.feedback');feedback.className='feedback';feedback.replaceChildren(createEl('h3','',`✦ ${p.score} poin terkumpul!`),createEl('p','','Menunggu teman menyelesaikan misinya…'));this.checkComplete();}else{p.reading=3000;p.time=40000;this.showQuestion(p,index);}}
  checkComplete(){if(!this.players.every(p=>p.finished))return;if(this.config.mode==='tourney'){const p=this.players[0];this.tourneyScores.push({name:p.name,score:p.score,correct:p.correct});if(this.tourneyIndex<3){this.tourneyIndex++;this.state='turn';$('turn-title').textContent=`Giliran Pemain ${this.tourneyIndex+1}`;this.openModal('turn-modal');return;}}this.finish();}
  layoutBubbles(p,w,h){
    const camera=this.config.control==='camera',d=Math.min(h*.82,Math.sqrt(.4*w*h/Math.PI)),r=d/2,base=w*(camera?.045:.065),old=p.bubbles;
    p.bubbles=p.buttons.map((el,i)=>{
      let b;
      if(old){const kx=w/p.aw,ky=h/p.ah;b={...old[i],x:old[i].x*kx,y:old[i].y*ky,vx:old[i].vx*kx,vy:old[i].vy*ky};}
      else{const angle=Math.random()*Math.PI*2,k=.8+Math.random()*.4;b={k,ph:Math.random()*6.283,x:w*(i+.5)/4,y:Math.min(h-r,Math.max(r,h*(i%2?.68:.32))),vx:Math.cos(angle)*base*k,vy:Math.sin(angle)*base*k};}
      b.r=r;b.sp=base*b.k;
      el.style.setProperty('--d',`${d}px`);
      const len=el.querySelector('.answer-text').textContent.length;
      el.querySelector('.answer-text').style.fontSize=`${d*Math.min(.125,Math.max(.055,.776/Math.sqrt(len)))}px`;
      el.dataset.ready='1';return b;
    });
    p.aw=w;p.ah=h;
  }
  moveBubbles(p,delta){
    const area=p.el.querySelector('.answer-area'),w=area.clientWidth,h=area.clientHeight;if(!w||!h)return;
    if(!p.bubbles||p.aw!==w||p.ah!==h)this.layoutBubbles(p,w,h);
    const calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches,camera=this.config.control==='camera',dt=Math.min(.1,delta/1000),t=performance.now()/1000,bs=p.bubbles;
    // Keep the target still while the child holds a palm over it.
    if(camera&&p.selector.target!==-1&&p.reading<=0)return;
    bs.forEach((b,i)=>{
      const el=p.buttons[i];let slow=p.reading>0?.55:1;if(calm)slow=.12;
      if(el.dataset.hover||(camera&&p.selector.target===i&&p.selector.elapsed>0))slow=Math.min(slow,.2);
      const mag=Math.hypot(b.vx,b.vy)||1,next=mag+(b.sp*slow-mag)*Math.min(1,dt*4);
      b.vx*=next/mag;b.vy*=next/mag;b.x+=b.vx*dt;b.y+=b.vy*dt;
    });
    for(let i=0;i<bs.length;i++)for(let j=i+1;j<bs.length;j++){
      const a=bs[i],c=bs[j],dx=c.x-a.x,dy=c.y-a.y,dist=Math.hypot(dx,dy)||.01,min=a.r+c.r+2;
      if(dist<min){const nx=dx/dist,ny=dy/dist,push=(min-dist)/2;a.x-=nx*push;a.y-=ny*push;c.x+=nx*push;c.y+=ny*push;const rel=(a.vx-c.vx)*nx+(a.vy-c.vy)*ny;if(rel>0){a.vx-=rel*nx;a.vy-=rel*ny;c.vx+=rel*nx;c.vy+=rel*ny;}}
    }
    bs.forEach((b,i)=>{
      if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx);}else if(b.x>w-b.r){b.x=w-b.r;b.vx=-Math.abs(b.vx);}
      if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy);}else if(b.y>h-b.r){b.y=h-b.r;b.vy=-Math.abs(b.vy);}
      const ox=calm?0:Math.sin(t*1.3+b.ph)*b.r*.05,oy=calm?0:Math.cos(t*1.1+b.ph*1.7)*b.r*.05;
      p.buttons[i].style.transform=`translate3d(${b.x-b.r+ox}px,${b.y-b.r+oy}px,0)`;
    });
  }
  updateComputer(){const active=['solo','coop'].includes(this.config.mode);$('com-score').textContent=active?`Komputer ✦ ${this.comScore}`:'';}
  updateControlHint(){const camera=this.config.control==='camera';$('control-hint').textContent=camera?`Arahkan titik kuning · tahan ${this.config.hold/1000} dtk · tarik tangan untuk batal`:(this.players.length===2?'Sentuh · P1: Q/W/A/S · P2: I/O/K/L':'Sentuh gelembung jawaban · Keyboard: Q / W / A / S');$('live-touch').classList.toggle('hidden',!camera);$('camera-live').textContent=camera?'Menunggu telapak…':'Mode sentuh aktif';}
  pause(){if(this.state!=='play')return;this.state='paused';this.players.forEach(p=>p.selector.requireRelease());this.openModal('pause-modal');}
  resume(){if(this.state!=='paused')return;this.closeModal('pause-modal');this.state='play';this.lastFrame=performance.now();}
  goHome(){document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'));this.tracker.stop();$('stage').classList.remove('camera-active');this.players=[];this.screen('home');}
  finish(){
    this.screen('results');this.tracker.stop();const scores=this.config.mode==='tourney'?this.tourneyScores:this.players.map(p=>({name:p.name,score:p.score,correct:p.correct}));
    $('scoreboard').replaceChildren();for(const p of scores){const tile=createEl('div','score-tile');tile.append(createEl('span','',p.name),createEl('strong','',String(p.score)),createEl('span','',`${p.correct}/8 benar`));$('scoreboard').append(tile);}if(['solo','coop'].includes(this.config.mode)){const tile=createEl('div','score-tile');tile.append(createEl('span','','Komputer'),createEl('strong','',String(this.comScore)),createEl('span','','Lawan virtual'));$('scoreboard').append(tile);}
    const max=Math.max(...scores.map(p=>p.score));const best=scores.filter(p=>p.score===max);$('result-title').textContent=scores.length>1?(best.length>1?'Sama-sama hebat!':`${best[0].name} memimpin!`):max>=600?'Bintang teladan!':'Terus bertumbuh, bintang!';
    $('result-summary').textContent='Prestasi berarti terus belajar, jujur, dan peduli kepada orang lain.';$('review-list').replaceChildren();
    this.history.forEach((item,i)=>{const card=createEl('article','review-item');card.append(createEl('span',item.correct?'correct-label':'wrong-label',`${i+1}. ${item.player} · ${item.correct?'Benar':'Perlu dipelajari'}`),createEl('h4','',item.question),createEl('p','',`Pilihanmu: ${item.chosen}`),createEl('p','',`Jawaban: ${item.answer}`),createEl('p','',item.explanation));$('review-list').append(card);});
  }
  loop(now){
    if(now-this.lastFrame<30){requestAnimationFrame(this.loop);return;}
    const delta=Math.min(100,Math.max(0,now-this.lastFrame));this.lastFrame=now;
    if(['calibration','play'].includes(this.state)&&this.config.control==='camera')this.tracker.readHands(now);else this.tracker.hands=[];
    this.tracker.draw();
    if(now-(this.lastSensorStatus||0)>500){this.lastSensorStatus=now;if(this.state==='calibration')$('sensor-stats').textContent=this.tracker.statusText();if(this.state==='play'&&this.config.control==='camera')$('camera-live').textContent=this.tracker.statusText();}
    if(this.state==='calibration'&&this.tracker.ready&&!this.practiceDone){const target=this.tracker.hitTest([$ ('practice').getBoundingClientRect()],this.tracker.hands);const done=this.practice.step(target,delta,true,this.tracker.sampleTime);$('practice-bar').style.width=`${this.practice.progress*100}%`;$('practice-label').textContent=this.practice.target===0?'Tangan terbaca. Tahan sebentar…':'Arahkan telapak ke sini';if(done===0){this.practiceDone=true;$('practice-label').textContent='Siap! Kamu berhasil menahan tangan.';$('practice').classList.add('ready');this.audio.play();}}
    if(this.state==='play'){
      const camera=this.config.control==='camera';
      this.players.forEach((p,index)=>{
        if(p.finished)return;if(!p.feedback)this.moveBubbles(p,delta);let target=-1;
        if(camera){const panel=p.el.getBoundingClientRect();const hands=this.tracker.hands.filter(h=>h.x>=panel.left&&h.x<=panel.right);target=this.tracker.hitTestCircles(p.buttons.map(b=>{const r=b.getBoundingClientRect();return{x:(r.left+r.right)/2,y:(r.top+r.bottom)/2,r:r.width/2};}),hands);}
        if(p.feedback){p.feedback.left-=delta;if(p.feedback.left<=0)this.nextQuestion(index);return;}
        if(p.reading>0){p.reading=Math.max(0,p.reading-delta);p.el.querySelector('.timer').textContent=`Baca dulu · ${Math.ceil(p.reading/1000)} dtk`;if(p.reading===0)p.buttons.forEach(b=>b.disabled=false);p.selector.step(target,delta,false);return;}
        p.time=Math.max(0,p.time-delta);const timer=p.el.querySelector('.timer');timer.textContent=`◷ ${Math.ceil(p.time/1000)} dtk`;timer.classList.toggle('danger',p.time<10000);
        if(p.time===0){this.answer(index,-1);return;}
        if(camera){const chosen=p.selector.step(target,delta,true,this.tracker.sampleTime);p.buttons.forEach((b,i)=>{b.classList.toggle('active-hold',i===p.selector.target);b.style.setProperty('--hold',i===p.selector.target?p.selector.progress:0);b.querySelector('.answer-progress').style.width=i===p.selector.target?`${p.selector.progress*100}%`:'0%';});if(chosen!==-1)this.answer(index,chosen);}
      });
    }
    requestAnimationFrame(this.loop);
  }
  saveBank(){try{localStorage.setItem('bintang_prestasi_bank_v1',JSON.stringify(this.bank));return true;}catch(error){$('bank-status').textContent='Penyimpanan browser tidak tersedia. Ekspor JSON untuk menyimpan perubahan.';return false;}}
  renderBank(){
    const filter=$('bank-filter').value,rows=this.bank.filter(q=>filter==='ALL'||q.difficulty===filter);$('bank-list').replaceChildren();$('bank-status').textContent=`${rows.length} dari ${this.bank.length} soal · Perubahan tersimpan di browser ini.`;
    rows.forEach(q=>{const card=createEl('article','bank-item');card.append(createEl('strong','',`${q.id} · ${q.difficulty} · ${q.context||'Hak & kewajiban'}`));const question=createEl('textarea');question.value=q.question;question.maxLength=400;question.setAttribute('aria-label',`Pertanyaan ${q.id}`);card.append(question);
      const commit=(field,value,element)=>{const old=clone(q[field]);q[field]=value;const error=validateBank(this.bank);if(error){q[field]=old;if(element)element.value=old;$('bank-status').textContent=error;return;}if(this.saveBank())$('bank-status').textContent=`Perubahan ${q.id} tersimpan.`;};question.onchange=()=>commit('question',question.value.trim(),question);
      const options=createEl('div','bank-options');q.options.forEach((value,i)=>{const label=createEl('label');const radio=createEl('input');radio.type='radio';radio.name=`correct-${q.id}`;radio.checked=q.correctIndex===i;radio.setAttribute('aria-label',`Jadikan ${'ABCD'[i]} kunci ${q.id}`);radio.onchange=()=>commit('correctIndex',i);const input=createEl('input');input.value=value;input.maxLength=200;input.setAttribute('aria-label',`Opsi ${'ABCD'[i]} ${q.id}`);input.onchange=()=>{const edited=[...q.options];edited[i]=input.value.trim();const original=q.options[i];commit('options',edited);input.value=q.options[i]||original;};label.append(radio,createEl('span','','ABCD'[i]),input);options.append(label);});card.append(options);
      const explanation=createEl('textarea');explanation.value=q.explanation;explanation.maxLength=600;explanation.setAttribute('aria-label',`Pembahasan ${q.id}`);explanation.onchange=()=>commit('explanation',explanation.value.trim(),explanation);card.append(explanation);$('bank-list').append(card);
    });
  }
  downloadBank(){const url=URL.createObjectURL(new Blob([JSON.stringify(this.bank,null,2)],{type:'application/json'}));const a=createEl('a');a.href=url;a.download='bank-hak-kewajiban-kelas5.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async importBank(event){const file=event.target.files?.[0];if(!file)return;try{if(file.size>2000000)throw Error('File terlalu besar. Maksimal 2 MB.');const data=JSON.parse(await file.text());const error=validateBank(data);if(error)throw Error(error);this.bank=data;const saved=this.saveBank();this.renderBank();$('bank-status').textContent=saved?`${data.length} soal berhasil diimpor.`:'Soal berhasil diimpor untuk sesi ini. Ekspor untuk menyimpan perubahan.';}catch(error){$('bank-status').textContent=`Impor gagal: ${error.message}`;}event.target.value='';}
}
window.addEventListener('DOMContentLoaded',()=>{window.gameApp=new AchievementGame();});
