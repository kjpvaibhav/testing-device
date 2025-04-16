const infoList = document.getElementById("info-list");

function addInfo(label, value) {
  const li = document.createElement("li");
  li.textContent = `${label}: ${value}`;
  infoList.appendChild(li);
}

// 📍 Location
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      addInfo("Location", `Lat: ${latitude}, Lon: ${longitude}`);
    },
    err => {
      addInfo("Location", `Permission denied or unavailable`);
    }
  );
} else {
  addInfo("Location", "Not supported");
}

// 🌐 Internet speed
const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (conn) {
  addInfo("Internet Downlink", `${conn.downlink} Mbps`);
  addInfo("Effective Connection Type", conn.effectiveType);
} else {
  addInfo("Internet Info", "Not supported");
}

// 📱 Accelerometer & Gyroscope
if (window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", (e) => {
    const acc = e.accelerationIncludingGravity;
    if (acc && acc.x !== null) {
      addInfo("Accelerometer", `X: ${acc.x.toFixed(2)} Y: ${acc.y.toFixed(2)} Z: ${acc.z.toFixed(2)}`);
    } else {
      addInfo("Accelerometer", "Available but not returning values");
    }
  }, { once: true });
} else {
  addInfo("Accelerometer", "Not supported");
}

// 🧭 Magnetometer (Experimental API, only works on HTTPS + newer devices)
if ('Magnetometer' in window) {
  try {
    const mag = new Magnetometer();
    mag.addEventListener('reading', () => {
      addInfo("Magnetometer", `X: ${mag.x.toFixed(2)}, Y: ${mag.y.toFixed(2)}, Z: ${mag.z.toFixed(2)}`);
      mag.stop();
    });
    mag.start();
  } catch (err) {
    addInfo("Magnetometer", `Error or permission denied`);
  }
} else {
  addInfo("Magnetometer", "Not supported");
}

// 📷 Camera / 🎤 Mic check
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      addInfo("Camera", "Accessible");
      addInfo("Microphone", "Accessible");
      stream.getTracks().forEach(track => track.stop()); // stop the stream
    })
    .catch(err => {
      addInfo("Camera", "Permission denied or unavailable");
      addInfo("Microphone", "Permission denied or unavailable");
    });
} else {
  addInfo("Camera & Microphone", "Not supported");
}
