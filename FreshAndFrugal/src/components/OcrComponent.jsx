// src/components/OcrComponent.jsx
import { useState } from "react";
import Tesseract from "tesseract.js";

export default function OcrComponent() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const runOCR = () => {
    if (!image) return;

    Tesseract.recognize(image, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      }
    })
      .then(({ data: { text } }) => {
        setText(text);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h2>OCR with Tesseract.js</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={runOCR}>Extract Text</button>

      {progress > 0 && <p>Progress: {progress}%</p>}
      {text && <p>Extracted Text: {text}</p>}
      {image && <img src={image} alt="Uploaded" style={{ maxWidth: "400px" }} />}
    </div>
  );
}