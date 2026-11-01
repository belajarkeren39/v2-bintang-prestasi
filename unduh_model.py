# Jalankan SEKALI di komputer yang punya internet:  python unduh_model.py
# Mengunduh model & mesin MediaPipe ke folder lokal agar game cepat dan tidak butuh internet.
import urllib.request, os
B = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14"
files = {
 B + "/vision_bundle.mjs": "vendor/mediapipe/vision_bundle.mjs",
 B + "/wasm/vision_wasm_internal.js": "vendor/mediapipe/wasm/vision_wasm_internal.js",
 B + "/wasm/vision_wasm_internal.wasm": "vendor/mediapipe/wasm/vision_wasm_internal.wasm",
 B + "/wasm/vision_wasm_nosimd_internal.js": "vendor/mediapipe/wasm/vision_wasm_nosimd_internal.js",
 B + "/wasm/vision_wasm_nosimd_internal.wasm": "vendor/mediapipe/wasm/vision_wasm_nosimd_internal.wasm",
 "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task": "model/hand_landmarker.task",
}
for url, dest in files.items():
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    print("Unduh", dest)
    urllib.request.urlretrieve(url, dest)
print("Selesai. Unggah ulang seluruh folder ke hosting (GitHub Pages / server lokal).")
