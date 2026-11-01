// Classic worker: MediaPipe 0.10.14 loads its WASM helper with importScripts.
let model;
self.onmessage = async ({data}) => {
  if (data.type === 'init') {
    try {
      const {createHandModel} = await import('./sensor-engine.js');
      const result = await createHandModel({...data.options, canvas: new OffscreenCanvas(1, 1)});
      model = result.model;
      self.postMessage({type: 'ready', delegate: result.delegate});
    } catch (error) { self.postMessage({type: 'init-error', message: error.message}); }
  } else if (data.type === 'frame') {
    try {
      const start = performance.now();
      const result = model.detectForVideo(data.bitmap, data.timestamp);
      self.postMessage({type: 'result', timestamp: data.timestamp,
        ms: performance.now() - start, landmarks: result.landmarks});
    } catch (error) { self.postMessage({type: 'frame-error', message: error.message}); }
    finally { data.bitmap.close(); }
  }
};
