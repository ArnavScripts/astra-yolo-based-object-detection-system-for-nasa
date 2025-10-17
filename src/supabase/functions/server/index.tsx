import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ce7e8b87/health", (c) => {
  return c.json({ status: "ok" });
});

// Get model configuration
app.get("/make-server-ce7e8b87/model-config", async (c) => {
  try {
    const config = await kv.get("model_config");
    return c.json({ 
      success: true, 
      config: config || { 
        modelEndpoint: "",
        apiKey: "",
        modelType: "custom" // custom, roboflow, huggingface
      } 
    });
  } catch (error) {
    console.log("Error fetching model config:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Save model configuration
app.post("/make-server-ce7e8b87/model-config", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("model_config", body);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error saving model config:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Helper function to prepare request for different API types
function prepareAPIRequest(config: any, imageData: string) {
  const modelType = config.modelType || "custom";
  let url = config.modelEndpoint;
  let headers: Record<string, string> = {};
  let body: any = {};

  switch (modelType) {
    case "roboflow":
      // Roboflow API format
      // URL should be like: https://detect.roboflow.com/project-id/version
      // API key goes in query params
      if (config.apiKey) {
        url = `${config.modelEndpoint}?api_key=${config.apiKey}`;
      }
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      // Roboflow expects base64 image without the data:image prefix
      const base64Data = imageData.includes('base64,') 
        ? imageData.split('base64,')[1] 
        : imageData;
      body = base64Data;
      break;

    case "huggingface":
      // Hugging Face Inference API format
      // URL: https://api-inference.huggingface.co/models/model-name
      headers["Authorization"] = `Bearer ${config.apiKey}`;
      headers["Content-Type"] = "application/json";
      // Hugging Face can accept base64 in inputs field
      body = {
        inputs: imageData
      };
      break;

    case "custom":
    default:
      // Custom endpoint - flexible format
      headers["Content-Type"] = "application/json";
      if (config.apiKey) {
        headers["Authorization"] = `Bearer ${config.apiKey}`;
        headers["X-API-Key"] = config.apiKey;
      }
      body = {
        image: imageData,
        imageData: imageData,
        inputs: imageData
      };
      break;
  }

  return { url, headers, body };
}

// Helper function to normalize detection results
function normalizeDetections(result: any, modelType: string): any[] {
  let detections: any[] = [];

  switch (modelType) {
    case "roboflow":
      // Roboflow returns { predictions: [...] }
      detections = result.predictions || [];
      // Normalize format: { class, confidence, x, y, width, height }
      return detections.map((det: any) => ({
        className: det.class || det.className,
        confidence: det.confidence,
        bbox: {
          x: det.x - (det.width / 2), // Roboflow uses center coordinates
          y: det.y - (det.height / 2),
          width: det.width,
          height: det.height
        }
      }));

    case "huggingface":
      // Hugging Face object detection returns array of objects
      // Format varies by model, common format: [{ score, label, box: { xmin, ymin, xmax, ymax } }]
      detections = Array.isArray(result) ? result : result.detections || [];
      return detections.map((det: any) => {
        const box = det.box || {};
        return {
          className: det.label || det.class || det.className,
          confidence: det.score || det.confidence,
          bbox: {
            x: box.xmin || box.x || 0,
            y: box.ymin || box.y || 0,
            width: (box.xmax - box.xmin) || box.width || 0,
            height: (box.ymax - box.ymin) || box.height || 0
          }
        };
      });

    case "custom":
    default:
      // Try to handle various custom formats
      detections = result.detections || result.predictions || result;
      if (!Array.isArray(detections)) {
        return [];
      }
      return detections.map((det: any) => {
        let bbox = det.bbox || det.box || det.bounding_box || {};
        
        // Handle different bbox formats
        if (det.x !== undefined && det.y !== undefined) {
          bbox = {
            x: det.x - (det.width / 2),
            y: det.y - (det.height / 2),
            width: det.width,
            height: det.height
          };
        }
        
        return {
          className: det.class || det.className || det.label || det.name,
          confidence: det.confidence || det.score || det.probability,
          bbox: {
            x: bbox.x || bbox.x1 || 0,
            y: bbox.y || bbox.y1 || 0,
            width: bbox.width || (bbox.x2 - bbox.x1) || 0,
            height: bbox.height || (bbox.y2 - bbox.y1) || 0
          }
        };
      });
  }
}

// YOLO Model Inference Endpoint
app.post("/make-server-ce7e8b87/detect", async (c) => {
  try {
    const body = await c.req.json();
    const { imageData } = body;

    if (!imageData) {
      return c.json({ success: false, error: "No image data provided" }, 400);
    }

    // Get model configuration
    const config = await kv.get("model_config");
    
    if (!config || !config.modelEndpoint) {
      // This is expected behavior, not an error - don't log it
      return c.json({ 
        success: false, 
        error: "Model endpoint not configured. Please configure your model in the Setup tab." 
      }, 400);
    }

    console.log(`Calling ${config.modelType || 'custom'} model endpoint:`, config.modelEndpoint);

    // Prepare request based on model type
    const { url, headers, body: requestBody } = prepareAPIRequest(config, imageData);

    // Call the external YOLO model API
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Model API error:", errorText);
      return c.json({ 
        success: false, 
        error: `Model API returned status ${response.status}: ${errorText}` 
      }, response.status);
    }

    const result = await response.json();
    console.log("Model inference successful");

    // Normalize detections based on model type
    const detections = normalizeDetections(result, config.modelType || 'custom');

    return c.json({ 
      success: true, 
      detections: detections
    });

  } catch (error) {
    console.log("Error in detect endpoint:", error);
    return c.json({ 
      success: false, 
      error: `Detection error: ${String(error)}` 
    }, 500);
  }
});

// Batch detection endpoint
app.post("/make-server-ce7e8b87/detect-batch", async (c) => {
  try {
    const body = await c.req.json();
    const { images } = body;

    if (!images || !Array.isArray(images)) {
      return c.json({ success: false, error: "Invalid images array" }, 400);
    }

    const config = await kv.get("model_config");
    
    if (!config || !config.modelEndpoint) {
      // This is expected behavior, not an error - don't log it
      return c.json({ 
        success: false, 
        error: "Model endpoint not configured. Please configure your model in the Setup tab." 
      }, 400);
    }

    // Process images in batch
    const results = await Promise.all(
      images.map(async (imageData) => {
        try {
          const { url, headers, body: requestBody } = prepareAPIRequest(config, imageData);

          const response = await fetch(url, {
            method: "POST",
            headers,
            body: typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody),
          });

          if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
          }

          const result = await response.json();
          const detections = normalizeDetections(result, config.modelType || 'custom');

          return { 
            success: true, 
            detections: detections
          };
        } catch (error) {
          return { success: false, error: String(error), detections: [] };
        }
      })
    );

    return c.json({ success: true, results });

  } catch (error) {
    console.log("Error in batch detect endpoint:", error);
    return c.json({ 
      success: false, 
      error: String(error) 
    }, 500);
  }
});

Deno.serve(app.fetch);
