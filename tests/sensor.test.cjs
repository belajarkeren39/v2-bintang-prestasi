const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function fixture(getUserMedia){
  let now=1000;
  const context={drawImage(){},setTransform(){},clearRect(){}};
  const canvas=()=>({width:0,height:0,getContext:()=>context,getBoundingClientRect:()=>({left:0,top:0,width:1600,height:900})});
  const scope={performance:{now:()=>now},window:{addEventListener(){},devicePixelRatio:1},document:{addEventListener(){},createElement:canvas},navigator:{mediaDevices:{getUserMedia}},setTimeout,clearTimeout};
  vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(__dirname,'../palm.js'),'utf8')+';this.Detector=PalmOnlyDetector;this.Selector=HoldSelector;',scope);
  const video={style:{},play:async()=>{},videoWidth:1920,videoHeight:1080,clientWidth:1600,readyState:2,currentTime:1,getBoundingClientRect:canvas().getBoundingClientRect};
  const tracker=new scope.Detector(video,canvas());tracker.initEngine=async()=>{};
  return {tracker,video,scope,Selector:scope.Selector,clock:value=>now=value};
}
function media(facingMode='user'){
  const track={stopped:false,label:'Test camera',stop(){this.stopped=true;},getSettings:()=>({facingMode,width:640,height:480})};
  return {track,stream:{getTracks:()=>[track],getVideoTracks:()=>[track]}};
}
test('front camera is requested and mirrored by default; stop closes tracks',async()=>{
  const m=media(),calls=[];const {tracker,video}=fixture(async c=>{calls.push(c);return m.stream;});
  await tracker.start();assert.equal(calls[0].video.facingMode.exact,'user');assert.equal(calls[0].audio,false);
  assert.equal(video.style.transform,'scaleX(-1)');tracker.stop();assert(m.track.stopped);assert.equal(video.srcObject,null);
});
test('front direction survives a resolution rejection',async()=>{
  const calls=[],m=media();const {tracker}=fixture(async c=>{calls.push(c);if(calls.length===1)throw Object.assign(Error(),{name:'OverconstrainedError'});return m.stream;});
  await tracker.start();assert.equal(calls[1].video.facingMode.exact,'user');assert.equal(calls[1].video.width,undefined);
});
test('USB camera without facingMode gets a soft fallback',async()=>{
  const m=media(undefined),calls=[];const {tracker}=fixture(async c=>{calls.push(c);if(c.video.facingMode?.exact)throw Object.assign(Error(),{name:'OverconstrainedError'});return m.stream;});
  await tracker.start();assert.equal(calls.length,3);assert.equal(calls[2].video.facingMode.ideal,'user');
});
test('explicit USB selection never silently switches to another device',async()=>{
  const calls=[];const {tracker}=fixture(async c=>{calls.push(c);throw Object.assign(Error(),{name:'NotFoundError'});});
  await assert.rejects(tracker.start({camera:'device:usb-2'}));assert(calls.every(c=>c.video.deviceId.exact==='usb-2'));
});
test('permission denial is not retried',async()=>{
  let count=0;const {tracker}=fixture(async()=>{count++;throw Object.assign(Error(),{name:'NotAllowedError'});});
  await assert.rejects(tracker.start());assert.equal(count,1);
});
test('back camera uses unmirrored coordinates',async()=>{
  const m=media('environment');const {tracker,video}=fixture(async()=>m.stream);
  await tracker.start({camera:'environment'});assert.equal(video.style.transform,'none');assert.equal(tracker.mirror,false);
});
test('late permission response after stop closes its stream',async()=>{
  let resolve;const m=media();const {tracker}=fixture(()=>new Promise(r=>resolve=r));
  const starting=tracker.start();tracker.stop();resolve(m.stream);assert.equal(await starting,false);assert(m.track.stopped);assert.equal(tracker.ready,false);
});
test('capture cap applies even when camera delivers 1080p',()=>{
  const {tracker}=fixture();const input=tracker.prepareInput();assert.equal(input.width,640);assert.equal(input.height,360);
});
test('frozen samples do not fill hold, slow fresh samples do',()=>{
  const {Selector}=fixture();let s=new Selector(1500);for(let i=0;i<100;i++)assert.equal(s.step(0,33,true,100),-1);
  s=new Selector(1500);let result;for(let t=0;t<=1800;t+=300)result=s.step(0,33,true,t);assert.equal(result,0);
});
test('missing frames do not earn dwell credit; long gaps reset',()=>{
  const {Selector}=fixture(),s=new Selector(1500);s.step(0,33,true,0);s.step(0,33,true,300);s.step(-1,33,true,400);s.step(0,33,true,500);assert.equal(s.elapsed,300);
  s.step(0,33,true,1200);assert.equal(s.elapsed,0);
});
test('stale inference results cannot move the cursor',()=>{
  const {tracker,clock}=fixture();clock(2000);tracker.hands=[{x:1,y:1}];tracker.acceptResult([],1000,900);assert.equal(tracker.hands.length,0);
});
test('mapping accounts for cover crop and mirror',()=>{
  const {tracker,clock}=fixture();clock(1000);tracker.video.videoWidth=640;tracker.video.videoHeight=480;
  const lm=Array.from({length:21},()=>({x:.25,y:.5}));lm[0].y=.6;lm[5].x=.2;lm[17].x=.3;
  tracker.acceptResult([lm],990,10);assert(Math.abs(tracker.hands[0].x-1200)<1);
  tracker.setMirror(false);tracker.acceptResult([lm],995,10);assert(Math.abs(tracker.hands[0].x-400)<1);
});
test('only one frame is in flight; stop discards a pending bitmap',async()=>{
  const {tracker,video,scope,clock}=fixture();let resolve,created=0,posted=0,closed=0;
  scope.createImageBitmap=()=>{created++;return new Promise(r=>resolve=r);};
  tracker.ready=true;tracker.worker={postMessage(){posted++;},terminate(){}};
  for(let n=0;n<20;n++){clock(1000+n*60);video.currentTime=n+1;tracker.readHands(1000+n*60);}
  assert.equal(created,1);assert.equal(posted,0);tracker.stop();resolve({close(){closed++;}});
  await new Promise(setImmediate);assert.equal(posted,0);assert.equal(closed,1);
});
