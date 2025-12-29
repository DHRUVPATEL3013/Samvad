import axios from "axios";
import { useRef, useState } from "react";
import { API_BASE } from "../config";

function ChatInput({ token, recipient, getchats }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);

    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    }
  };

  const clearMedia = () => {
    setFile(null);
    setPreview(null);
    setText("");
    fileRef.current.value = "";
  };

  const send = async () => {
    if (!recipient) return;

    try {
      if (file) {
        const fd = new FormData();
        fd.append("phone", recipient);
        fd.append("caption", text);
        fd.append("file", file);

        await axios.post(`${API_BASE}/send-media`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });

        clearMedia();
      } else if (text.trim()) {
        await axios.post(
          `${API_BASE}/messages`,
          { phone: recipient, content: text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setText("");
      }

      getchats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat-input-wrapper">

      {file && (
        <div className="media-preview-overlay">
          {preview ? (
            <img src={preview} />
          ) : (
            <p>📎 {file.name}</p>
          )}
          <button onClick={clearMedia}>✕</button>
        </div>
      )}

      
      <div className="message-input-area">
        <input
          type="file"
          hidden
          ref={fileRef}
          onChange={handleFile}
        />

        <button onClick={() => fileRef.current.click()}>
            <img className="share-icon" src="https://img.icons8.com/?size=100&id=1501&format=png&color=000000" alt="Attach" />
        </button>

        <input
          className="message-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />

        <button className="send-btn" onClick={send}>➤</button>
      </div>
    </div>
  );
}

export default ChatInput;
