/* Camera capture and UI stay on the page; inference uses one worker frame at a time. */
class PalmOnlyDetector {
  constructor(video, canvas) {
    Object.assign(this, {video, canvas, ctx: canvas.getContext('2d'), stream: null,
      model: null, worker: null, ready: false, hands: [], generation: 0,
      lastVideoTime: -1, lastInference: -Infinity, interval: 50, avgMs: 0,
      errors: 0, delegate: '-', backend: '-', hadContent: false, sampleTime: -1,
      resultAt: 0, resultGap: 100, pending: false, mirror: true});
    this.input = document.createElement('canvas');
    this.inputContext = this.input.getContext('2d', {alpha: false});
    const invalidate = () => {this.canvasCache = null; this.videoCache = null; this.hands = [];};
    window.addEventListener('resize', invalidate);
    document.addEventListener('fullscreenchange', invalidate);
  }
  cachedRect(el, key) {
    const now = performance.now();
    if (!this[key+'Cache'] || now-this[key+'At'] > 400) {
      this[key+'Cache'] = el.getBoundingClientRect(); this[key+'At'] = now;
    }
    return this[key+'Cache'];
  }
  setMirror(value) {
    this.mirror = value; this.video.style.transform = value ? 'scaleX(-1)' : 'none';
    this.hands = [];
  }
  async initEngine(options, generation) {
    if (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap === 'function') {
      let worker;
      try {
        worker = new Worker('./hand-worker.js'); this.worker = worker;
        await new Promise((resolve, reject) => {
          const finish = (error) => {
            clearTimeout(timer); this.cancelInit = null;
            error ? reject(error) : resolve();
          };
          const timer = setTimeout(() => finish(Error('Waktu muat sensor habis.')), 45000);
          this.cancelInit = () => finish(Error('Pemuatan kamera dibatalkan.'));
          worker.onerror = () => finish(Error('Worker sensor tidak tersedia.'));
          worker.onmessage = ({data}) => {
            if (data.type === 'ready') {this.delegate = data.delegate; finish();}
            else if (data.type === 'init-error') finish(Error(data.message));
          };
          worker.postMessage({type: 'init', options});
        });
        if (generation !== this.generation) {worker.terminate(); return;}
        this.backend = 'Worker';
        worker.onerror = () => this.failSensor('Sensor terhenti. Pilih CPU lalu muat ulang kamera.');
        worker.onmessage = ({data}) => {
          if (generation !== this.generation || !this.ready) return;
          this.pending = false;
          if (data.type === 'result') this.acceptResult(data.landmarks, data.timestamp, data.ms);
          else if (data.type === 'frame-error') this.onInferenceError();
        };
        return;
      } catch (error) {
        worker?.terminate();
        if (generation !== this.generation) throw error;
        this.worker = null;
      }
    }
    this.backend = 'Kompatibilitas';
    const {createHandModel} = await import('./sensor-engine.js');
    // A timed-out or cancelled model must be closed even if loading later succeeds.
    let expired = false, timer;
    try {
      const loaded = createHandModel(options).then(result => {
        if (expired || generation !== this.generation) {result.model.close(); throw Error('Pemuatan dibatalkan.');}
        return result;
      });
      const result = await Promise.race([loaded, new Promise((_, reject) => {
        timer = setTimeout(() => {expired = true; reject(Error('Sensor belum selesai dimuat. Periksa internet atau pasang model lokal.'));}, 45000);
      })]);
      this.model = result.model; this.delegate = result.delegate;
    } finally {clearTimeout(timer);}
  }
  async start(options = {}) {
    this.stop(); const generation = this.generation;
    if (!navigator.mediaDevices?.getUserMedia) throw Error('Kamera memerlukan HTTPS dan browser yang mendukungnya.');
    const camera = options.camera || 'user';
    const selection = camera.startsWith('device:') ? {deviceId: {exact: camera.slice(7)}} :
      {facingMode: {ideal: camera === 'environment' ? 'environment' : 'user'}};
    const constraints = [
      {width: {ideal: 640}, height: {ideal: 480}, frameRate: {ideal: 30, max: 30}, ...selection},
      {...selection}
    ];
    // Prefer the requested facing direction over resolution when it is exposed.
    // USB cameras often do not report facingMode, so retain an ideal fallback.
    if (!camera.startsWith('device:')) constraints.unshift({
      width: {ideal: 640}, height: {ideal: 480}, frameRate: {ideal: 30, max: 30},
      facingMode: {exact: camera === 'environment' ? 'environment' : 'user'}
    }, {facingMode: {exact: camera === 'environment' ? 'environment' : 'user'}});
    let stream, lastError;
    for (const video of constraints) {
      try {stream = await navigator.mediaDevices.getUserMedia({audio: false, video}); break;}
      catch (error) {lastError = error; if (['NotAllowedError','SecurityError'].includes(error.name)) break;}
    }
    if (!stream) throw lastError || Error('Kamera tidak ditemukan.');
    if (generation !== this.generation) {stream.getTracks().forEach(t => t.stop()); return false;}
    this.stream = stream; this.video.srcObject = stream;
    try {
      await this.video.play();
      if (generation !== this.generation) return false;
      const track = stream.getVideoTracks()[0]; this.settings = track.getSettings();
      this.cameraLabel = track.label || 'Kamera';
      this.setMirror(this.settings.facingMode ? this.settings.facingMode !== 'environment' : camera !== 'environment');
      track.onended = () => {if (generation === this.generation) this.failSensor('Kamera terputus. Sambungkan lalu muat ulang.');};
      await this.initEngine({numHands: options.numHands || 1, preference: options.preference || 'auto'}, generation);
      if (generation !== this.generation) return false;
      this.canvasCache = null; this.videoCache = null; this.error = null; this.errors = 0;
      this.lastVideoTime = -1; this.lastInference = -Infinity; this.sampleTime = -1;
      this.resultAt = 0; this.resultGap = 100; this.avgMs = 0; this.interval = 50;
      this.ready = true; return true;
    } catch (error) {if (generation === this.generation) this.stop(); throw error;}
  }
  stop() {
    this.generation++; this.ready = false; this.hands = []; this.pending = false;
    this.cancelInit?.(); this.cancelInit = null;
    this.worker?.terminate(); this.worker = null;
    this.model?.close(); this.model = null;
    this.stream?.getTracks().forEach(track => track.stop()); this.stream = null;
    this.video.srcObject = null; this.draw();
  }
  failSensor(message) {this.ready = false; this.hands = []; this.error = message; this.pending = false;}
  onInferenceError() {
    this.hands = []; this.pending = false;
    if (++this.errors >= 3) this.failSensor('Sensor bermasalah. Pilih CPU lalu muat ulang kamera, atau gunakan sentuh.');
  }
  getVideoDisplayBox() {
    const rect = this.cachedRect(this.video, 'video');
    const vw = this.video.videoWidth || 640, vh = this.video.videoHeight || 480;
    const scale = Math.max(rect.width/vw, rect.height/vh);
    return {renderW: vw*scale, renderH: vh*scale,
      offsetX: rect.left+(rect.width-vw*scale)/2, offsetY: rect.top+(rect.height-vh*scale)/2};
  }
  isValidPalmGeometry(lm) {
    if (!lm || lm.length !== 21) return false;
    const length = Math.hypot(lm[9].x-lm[0].x, lm[9].y-lm[0].y);
    const width = Math.hypot(lm[17].x-lm[5].x, lm[17].y-lm[5].y);
    return length > .012 && length < .65 && width > .01 && width < .65;
  }
  acceptResult(landmarks, timestamp, ms) {
    const now = performance.now();
    this.resultGap = this.resultAt ? this.resultGap*.7 + (now-this.resultAt)*.3 : Math.max(50, now-timestamp);
    this.resultAt = now; this.sampleTime = timestamp;
    this.avgMs = this.avgMs ? this.avgMs*.8 + ms*.2 : ms;
    this.interval = Math.max(50, Math.min(200, this.avgMs*1.15));
    this.errors = 0;
    if (now-timestamp > 500) {this.hands = []; return;}
    const box = this.getVideoDisplayBox(), old = [...this.hands];
    this.hands = (landmarks || []).filter(lm => this.isValidPalmGeometry(lm)).map(lm => {
      const points = lm.map(p => ({x: box.offsetX+(this.mirror ? 1-p.x : p.x)*box.renderW,
        y: box.offsetY+p.y*box.renderH}));
      const ids = [0,5,9,13,17];
      let x = ids.reduce((sum,i) => sum+points[i].x,0)/5;
      let y = ids.reduce((sum,i) => sum+points[i].y,0)/5;
      const match = old.findIndex(hand => Math.hypot(hand.x-x,hand.y-y) < this.video.clientWidth*.12);
      if (match !== -1) {const previous = old.splice(match,1)[0]; x = previous.x*.15+x*.85; y = previous.y*.15+y*.85;}
      return {x, y, points, lastSeen: timestamp};
    });
  }
  prepareInput() {
      // Enforce a real cap, even if a USB camera ignores the ideal constraints.
      const scale = Math.min(1, 640/this.video.videoWidth, 480/this.video.videoHeight);
      const w = Math.max(1, Math.round(this.video.videoWidth*scale));
      const h = Math.max(1, Math.round(this.video.videoHeight*scale));
      if (this.input.width !== w || this.input.height !== h) {this.input.width = w; this.input.height = h;}
      this.inputContext.drawImage(this.video, 0, 0, w, h);
      return this.input;
  }
  async sendFrame(timestamp) {
    const generation = this.generation, worker = this.worker;
    this.pending = true; this.pendingAt = timestamp;
    try {
      const bitmap = await createImageBitmap(this.prepareInput());
      if (generation !== this.generation || worker !== this.worker || !this.ready) {bitmap.close(); return;}
      try {worker.postMessage({type: 'frame', bitmap, timestamp}, [bitmap]);}
      catch (error) {bitmap.close(); throw error;}
    } catch (error) {if (generation === this.generation) this.onInferenceError();}
  }
  readHands(now) {
    if (!this.ready || this.video.readyState < 2) {this.hands = []; return [];}
    const watchdog = this.resultAt ? 3000 : 20000; // First GPU frame may compile shaders.
    if (this.pending && now-this.pendingAt > watchdog) this.failSensor('Sensor tidak merespons. Pilih CPU lalu muat ulang, atau gunakan sentuh.');
    if (this.ready && !this.pending && now-this.lastInference >= this.interval && this.video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.video.currentTime; this.lastInference = now;
      if (this.worker) this.sendFrame(now);
      else {
        try {
          const start = performance.now();
          const result = this.model.detectForVideo(this.prepareInput(), now);
          this.acceptResult(result.landmarks, now, performance.now()-start);
        } catch (error) {this.onInferenceError();}
      }
    }
    const fresh = Math.min(500, Math.max(200, this.resultGap*2+this.avgMs));
    this.hands = this.hands.filter(hand => performance.now()-hand.lastSeen < fresh);
    return this.hands;
  }
  statusText() {
    if (!this.ready) return this.error || 'Sensor belum siap.';
    const fps = this.resultAt && performance.now()-this.resultAt < 1500 ? (1000/this.resultGap).toFixed(1) : '0';
    return `${this.hands.length} telapak · ${fps} deteksi/dtk · ${Math.round(this.avgMs)} ms · ${this.delegate}/${this.backend}`;
  }

  hitTest(rects,hands){
    const hits=new Set();
    for(const hand of hands){let chosen=-1,best=Infinity;
      rects.forEach((r,i)=>{const pad=Math.min(r.width,r.height)*.04;
        if(hand.x>=r.left+pad&&hand.x<=r.right-pad&&hand.y>=r.top+pad&&hand.y<=r.bottom-pad){const distance=Math.hypot(hand.x-(r.left+r.right)/2,hand.y-(r.top+r.bottom)/2);if(distance<best){chosen=i;best=distance;}}});
      if(chosen!==-1)hits.add(chosen);
    }
    return hits.size===1?[...hits][0]:-1;
  }
  hitTestCircles(circles,hands){
    const hits=new Set();
    for(const hand of hands){let chosen=-1,best=Infinity;
      circles.forEach((c,i)=>{if(c.r<2)return;const d=Math.hypot(hand.x-c.x,hand.y-c.y);if(d<=c.r*.88&&d<best){chosen=i;best=d;}});
      if(chosen!==-1)hits.add(chosen);
    }
    return hits.size===1?[...hits][0]:-1;
  }
  draw(){
    const has=this.hands.length>0;
    if(!has&&!this.hadContent)return;this.hadContent=has;
    const r=this.cachedRect(this.canvas,'canvas');
    // Batasi resolusi kanvas (layar IFP 4K sangat berat bila kanvas ikut resolusi layar)
    const ratio=Math.min(window.devicePixelRatio||1,2,1280/Math.max(1,r.width));
    const width=Math.max(1,Math.round(r.width*ratio)),height=Math.max(1,Math.round(r.height*ratio));if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}
    const c=this.ctx;c.setTransform(ratio,0,0,ratio,0,0);c.clearRect(0,0,r.width,r.height);
    if(!has)return;
    const connections=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
    for(const hand of this.hands){c.strokeStyle='#74f3ceaa';c.lineWidth=Math.max(1.5,r.width/600);for(const [a,b]of connections){c.beginPath();c.moveTo(hand.points[a].x-r.left,hand.points[a].y-r.top);c.lineTo(hand.points[b].x-r.left,hand.points[b].y-r.top);c.stroke();}
      const radius=Math.max(6,r.width*.009);c.beginPath();c.fillStyle='#ffd66b';c.arc(hand.x-r.left,hand.y-r.top,radius,0,Math.PI*2);c.fill();c.strokeStyle='#fff';c.lineWidth=2;c.stroke();}
  }
}
// Unité sensor: waktu tahan hanya bertambah ketika target benar-benar terdeteksi.
class HoldSelector {
  constructor(duration=2000){this.duration=duration;this.reset();this.needsRelease=false;this.quietMs=0;}
  reset(){this.target=-1;this.elapsed=0;this.gap=0;this.lastSample=-1;}
  requireRelease(){this.reset();this.needsRelease=true;this.quietMs=0;}
  step(target,delta,enabled=true,sampleTime){
    const dt=Math.min(100,Math.max(0,delta));
    if(this.needsRelease){this.quietMs=target===-1?this.quietMs+dt:0;if(this.quietMs>=400){this.needsRelease=false;this.quietMs=0;}return -1;}
    if(!enabled){this.reset();return -1;}
    if(target===-1){this.lastSample=-1;this.gap+=dt;if(this.gap>450)this.reset();return -1;}
    // Count only distinct camera results; a cached cursor or frozen video cannot answer.
    let credit=dt;
    if(sampleTime!==undefined){
      if(sampleTime===this.lastSample||sampleTime<0)return -1;
      credit=this.lastSample<0?0:Math.max(0,sampleTime-this.lastSample);
      if(credit>500){this.reset();credit=0;}
      this.lastSample=sampleTime;
    }
    if(target!==this.target){this.target=target;this.elapsed=0;}else{this.elapsed+=credit;}
    this.gap=0;return this.elapsed>=this.duration?this.target:-1;
  }
  get progress(){return Math.min(1,this.elapsed/this.duration);}
}
