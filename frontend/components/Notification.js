// components/Notification.js
import { useEffect, useState } from "react";

export default function Notification({ type = "success", message, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setVisible(true);

    const timer = setTimeout(() => {
      // Fade out
      setVisible(false);

      // Then actually remove it
      setTimeout(onClose, 500); // wait fade out to finish
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`notification ${type} ${visible ? "show" : "hide"}`}>
      {message}
    </div>
  );
}
