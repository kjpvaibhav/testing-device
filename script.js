const infoList = document.getElementById("info-list");
function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const deviceMemory = navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Not available";
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  const touchSupport =
    "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  // Try to extract browser name/version (basic)
  let browserName = "Unknown";
  let browserVersion = "";

  if (/chrome|crios|crmo/i.test(userAgent)) {
    browserName = "Chrome";
    browserVersion = userAgent.match(/(chrome|crios)\/(\d+(\.\d+)?)/i)?.[2] || "";
  } else if (/firefox|fxios/i.test(userAgent)) {
    browserName = "Firefox";
    browserVersion = userAgent.match(/firefox\/(\d+(\.\d+)?)/i)?.[1] || "";
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browserName = "Safari";
    browserVersion = userAgent.match(/version\/(\d+(\.\d+)?)/i)?.[1] || "";
  } else if (/edg/i.test(userAgent)) {
    browserName = "Edge";
    browserVersion = userAgent.match(/edg\/(\d+(\.\d+)?)/i)?.[1] || "";
  }

  addInfo("Browser", `${browserName} ${browserVersion}`);
  addInfo("Platform", platform);
  addInfo("Language", language);
  addInfo("Screen Resolution", `${screenWidth} x ${screenHeight}`);
  addInfo("Device Memory", deviceMemory);
  addInfo("User Agent", userAgent);
  addInfo("Touch Support", touchSupport ? "Yes" : "No");
}

function addInfo(label, value) {
  const li = document.createElement("li");
  li.textContent = `${label}: ${value}`;
  infoList.appendChild(li);
}
getBrowserInfo();
// Location
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

// Internet speed
const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (conn) {
  addInfo("Internet Downlink", `${conn.downlink} Mbps`);
  addInfo("Effective Connection Type", conn.effectiveType);
} else {
  addInfo("Internet Info", "Not supported");
}

// Accelerometer & Gyroscope
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

// Magnetometer (Experimental API, only works on HTTPS + newer devices)
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

// Camera - Mic check
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
