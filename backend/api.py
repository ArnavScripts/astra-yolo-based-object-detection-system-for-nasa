from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import numpy as np
import cv2
from ultralytics import YOLO
from pathlib import Path
import yaml
import os
from typing import List, Any

app = FastAPI(title="YOLO Local API")

# Allow CORS for local development. For dev it's easiest to allow all origins;
# in production set explicit origins instead of '*'.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ImagePayload(BaseModel):
    imageData: str


class BatchPayload(BaseModel):
    images: List[str]


def load_model():
    this_dir = Path(__file__).parent
    # Try common model files first
    candidates = [this_dir / 'yolo11n.pt', this_dir / 'yolov8m.pt']
    detect_path = this_dir / 'runs' / 'detect'
    if detect_path.exists():
        train_folders = [f for f in os.listdir(detect_path) if (detect_path / f).is_dir() and f.startswith('train')]
        if train_folders:
            # choose latest
            train_folders = sorted(train_folders, key=lambda f: (detect_path / f).stat().st_mtime, reverse=True)
            candidate = detect_path / train_folders[0] / 'weights' / 'best.pt'
            if candidate.exists():
                candidates.insert(0, candidate)

    for c in candidates:
        if Path(c).exists():
            print(f"Loading model from {c}")
            return YOLO(str(c))

    # fallback: try reading yolo_params.yaml
    params = this_dir / 'yolo_params.yaml'
    if params.exists():
        with open(params, 'r') as f:
            data = yaml.safe_load(f)
            if data and data.get('weights'):
                w = Path(data.get('weights'))
                if w.exists():
                    return YOLO(str(w))

    raise FileNotFoundError('No YOLO model found in backend directory')


MODEL = None


def ensure_model():
    global MODEL
    if MODEL is None:
        MODEL = load_model()
    return MODEL


def decode_data_url(data_url: str):
    if ',' in data_url:
        header, b64 = data_url.split(',', 1)
    else:
        b64 = data_url
    try:
        img_bytes = base64.b64decode(b64)
        arr = np.frombuffer(img_bytes, dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        raise ValueError('Invalid image data') from e


def extract_detections(result) -> List[Any]:
    detections = []
    names = result.names if hasattr(result, 'names') else {}
    # result.boxes: iterate
    for box in result.boxes:
        try:
            cls_id = int(box.cls[0]) if hasattr(box, 'cls') else int(box.cls)
        except Exception:
            cls_id = 0
        conf = float(box.conf[0]) if hasattr(box, 'conf') else (float(box.conf) if hasattr(box, 'conf') else 0.0)
        # xyxy
        if hasattr(box, 'xyxy'):
            coords = box.xyxy[0].tolist()
            x1, y1, x2, y2 = coords
            w = x2 - x1
            h = y2 - y1
            bbox = {"x": float(x1), "y": float(y1), "width": float(w), "height": float(h)}
        elif hasattr(box, 'xywhn'):
            # normalized center format
            x_center, y_center, width, height = box.xywhn[0].tolist()
            bbox = {"x": float(x_center - width / 2), "y": float(y_center - height / 2), "width": float(width), "height": float(height)}
        else:
            bbox = {"x": 0, "y": 0, "width": 0, "height": 0}

        detections.append({
            "class": names.get(cls_id, str(cls_id)),
            "confidence": conf,
            "bbox": bbox,
        })
    return detections


@app.post('/detect')
async def detect(payload: ImagePayload):
    # Normal POST handler for detections. Preflight (OPTIONS) requests are
    # handled automatically by CORSMiddleware when configured above.
    try:
        img = decode_data_url(payload.imageData)
    except ValueError:
        raise HTTPException(status_code=400, detail='Invalid image data')

    model = ensure_model()
    # ultralytics accepts numpy images
    results = model.predict(img, conf=0.25)
    if len(results) == 0:
        return {"success": True, "detections": []}
    result = results[0]
    detections = extract_detections(result)

    # Create predictions dir and save annotated image + labels
    base = Path(__file__).parent
    preds_dir = base / 'predictions'
    images_dir = preds_dir / 'images'
    labels_dir = preds_dir / 'labels'
    images_dir.mkdir(parents=True, exist_ok=True)
    labels_dir.mkdir(parents=True, exist_ok=True)

    # annotated image (result.plot()) -> encode to jpeg
    annotated = result.plot()
    _, img_encoded = cv2.imencode('.jpg', annotated)
    img_bytes = img_encoded.tobytes()
    # filename
    fname = f"pred_{int(Path().stat().st_mtime) if Path().exists() else int(os.time())}_{int(np.random.randint(1e6))}.jpg"
    # safer filename: use timestamp
    import time
    fname = f"pred_{int(time.time())}.jpg"
    img_path = images_dir / fname
    with open(img_path, 'wb') as f:
        f.write(img_bytes)

    # write label file (simple format: class_id x_center y_center width height normalized)
    label_name = Path(fname).with_suffix('.txt').name
    label_path = labels_dir / label_name
    with open(label_path, 'w') as f:
        for box in result.boxes:
            try:
                cls_id = int(box.cls[0]) if hasattr(box, 'cls') else int(box.cls)
            except Exception:
                cls_id = 0
            if hasattr(box, 'xywhn'):
                x_center, y_center, width, height = box.xywhn[0].tolist()
            else:
                x_center = y_center = width = height = 0
            f.write(f"{cls_id} {x_center} {y_center} {width} {height}\n")

    # make data URL for annotated image to return
    import base64
    data_url = 'data:image/jpeg;base64,' + base64.b64encode(img_bytes).decode('ascii')

    return {"success": True, "detections": detections, "annotated": data_url, "saved": str(img_path.name)}


@app.post('/detect-batch')
async def detect_batch(payload: BatchPayload):
    model = ensure_model()
    all_results = []
    for data_url in payload.images:
        try:
            img = decode_data_url(data_url)
        except ValueError:
            all_results.append({"success": False, "detections": []})
            continue
        results = model.predict(img, conf=0.25)
        if len(results) == 0:
            all_results.append({"success": True, "detections": []})
            continue
        result = results[0]
        detections = extract_detections(result)
        all_results.append({"success": True, "detections": detections})

    return {"success": True, "results": all_results}



@app.get('/predictions')
async def list_predictions(request: Request):
    base = Path(__file__).parent
    preds_dir = base / 'predictions'
    images_dir = preds_dir / 'images'
    labels_dir = preds_dir / 'labels'
    items = []
    if images_dir.exists():
        for img in sorted(images_dir.iterdir(), key=lambda p: p.stat().st_mtime, reverse=True):
            name = img.name
            label_file = labels_dir / Path(name).with_suffix('.txt').name
            detections = []
            if label_file.exists():
                with open(label_file, 'r') as f:
                    for line in f:
                        parts = line.strip().split()
                        if len(parts) >= 5:
                            cid = int(parts[0])
                            x, y, w, h = map(float, parts[1:5])
                            detections.append({
                                'class': str(cid),
                                'confidence': 1.0,
                                'bbox': {'x': x - w / 2, 'y': y - h / 2, 'width': w, 'height': h},
                            })
            items.append({'image': f'/predictions/images/{name}', 'name': name, 'detections': detections, 'timestamp': int(img.stat().st_mtime)})
    return {'success': True, 'predictions': items}


from fastapi.responses import FileResponse


@app.get('/predictions/images/{name}')
async def get_prediction_image(name: str, request: Request = None):
    base = Path(__file__).parent
    path = base / 'predictions' / 'images' / name
    if not path.exists():
        raise HTTPException(status_code=404, detail='Not found')
    return FileResponse(path)


@app.get('/predictions/labels/{name}')
async def get_prediction_label(name: str):
    base = Path(__file__).parent
    path = base / 'predictions' / 'labels' / name
    if not path.exists():
        raise HTTPException(status_code=404, detail='Not found')
    with open(path, 'r') as f:
        content = f.read()
    return {'success': True, 'label': content}
