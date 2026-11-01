// Shared by the classic worker and the compatibility path on the main thread.
export async function createHandModel({numHands = 1, preference = 'auto', canvas} = {}) {
  const cdn = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
  const sources = [
    {bundle: new URL('./vendor/mediapipe/vision_bundle.mjs', import.meta.url).href,
      wasm: new URL('./vendor/mediapipe/wasm', import.meta.url).href,
      model: new URL('./model/hand_landmarker.task', import.meta.url).href},
    {bundle: cdn + '/vision_bundle.mjs', wasm: cdn + '/wasm',
      model: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'}
  ];
  let lastError;
  for (const source of sources) {
    try {
      const {FilesetResolver, HandLandmarker} = await import(source.bundle);
      const files = await FilesetResolver.forVisionTasks(source.wasm);
      for (const delegate of preference === 'cpu' ? ['CPU'] : ['GPU', 'CPU']) {
        try {
          const model = await HandLandmarker.createFromOptions(files, {
            ...(canvas ? {canvas} : {}),
            baseOptions: {modelAssetPath: source.model, delegate}, runningMode: 'VIDEO',
            numHands, minHandDetectionConfidence: .5,
            minHandPresenceConfidence: .5, minTrackingConfidence: .5
          });
          return {model, delegate};
        } catch (error) { lastError = error; }
      }
    } catch (error) { lastError = error; }
  }
  throw lastError || Error('Model sensor tidak dapat dimuat.');
}
