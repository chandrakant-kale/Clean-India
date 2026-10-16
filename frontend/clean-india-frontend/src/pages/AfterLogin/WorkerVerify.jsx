import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const QRScanner = ({ onScan, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [jsQRLoaded, setJsQRLoaded] = useState(false);

  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scanningRef = useRef(false);

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";

    script.onload = () => setJsQRLoaded(true);

    script.onerror = () => {
      console.error("Failed to load jsQR library");
      setError("Unable to load the QR decoder. Please try again.");
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const stopScanning = () => {
    scanningRef.current = false;
    setScanning(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const video = document.getElementById("qr-video");

    if (video) {
      video.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      scanningRef.current = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    if (!jsQRLoaded) {
      setError("QR decoder is loading. Please wait.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is unavailable in this browser.");
      return;
    }

    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      scanningRef.current = true;
      setScanning(true);

      const video = document.getElementById("qr-video");
      const canvas = document.getElementById("qr-canvas");

      if (!video || !canvas) {
        stopScanning();
        setError("Unable to initialize the scanner.");
        return;
      }

      video.srcObject = stream;

      await video.play();

      const context = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      let frameCount = 0;
      let lastDetectionTime = 0;

      const scanFrame = () => {
        if (!scanningRef.current) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
          );

          try {
            const imageData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );

            const code = window.jsQR(
              imageData.data,
              imageData.width,
              imageData.height,
              { inversionAttempts: "attemptBoth" }
            );

            if (code) {
              const now = Date.now();

              if (now - lastDetectionTime > 500) {
                lastDetectionTime = now;

                const qrData = code.data;
                const match = qrData.match(/\d{5}/);

                if (match) {
                  stopScanning();
                  onScan(match[0]);
                  return;
                }

                if (/^\d+$/.test(qrData) && qrData.length >= 5) {
                  const result = qrData.substring(0, 5);
                  stopScanning();
                  onScan(result);
                  return;
                }
              }
            }
          } catch (err) {
            console.error("QR detection error:", err);
          }
        }

        frameCount += 1;

        if (frameCount < 600 && scanningRef.current) {
          animationFrameRef.current =
            requestAnimationFrame(scanFrame);
        } else if (scanningRef.current) {
          stopScanning();
          setError("No QR code detected. Try entering the code manually.");
        }
      };

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    } catch (err) {
      console.error("Camera error:", err);
      stopScanning();
      setError("Camera access denied or unavailable.");
    }
  };

  const handleManualInput = () => {
    stopScanning();
    onScan(null);
  };

  const closeScanner = () => {
    stopScanning();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#252820]/75 p-4"
      onClick={closeScanner}
    >
      <section
        className="w-full max-w-lg overflow-hidden border border-[#DEDCD3] bg-[#F8F7F2]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="scanner-title"
      >
        <header className="flex items-start justify-between border-b border-[#DEDCD3] px-5 py-5 sm:px-7">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#626B4F]">
              Clean-India / Verification
            </p>

            <h2
              id="scanner-title"
              className="text-2xl font-semibold tracking-tight text-[#252820]"
            >
              Scan QR code
            </h2>

            <p className="mt-1 text-sm text-[#696A61]">
              Verify a waste collection using its five-digit code.
            </p>
          </div>

          <button
            type="button"
            onClick={closeScanner}
            aria-label="Close scanner"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#DEDCD3] text-[#252820] transition hover:bg-[#EFEEE6]"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                d="m6 6 12 12M18 6 6 18"
              />
            </svg>
          </button>
        </header>

        <div className="p-5 sm:p-7">
          {!scanning && !error && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center border border-[#DEDCD3] bg-[#EFEEE6] text-[#626B4F]">
                <svg
                  className="h-10 w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M14 14h3v3h-3zM20 14v2M14 20h2M20 19v2" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-[#252820]">
                Ready to scan
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#696A61]">
                Allow camera access and position the QR code inside the
                scanning frame.
              </p>

              <button
                type="button"
                onClick={startScanning}
                disabled={!jsQRLoaded}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-[#626B4F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#48533E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3" />
                  <rect x="8" y="8" width="8" height="8" rx="1" />
                </svg>

                {jsQRLoaded ? "Open camera" : "Loading QR decoder..."}
              </button>

              <button
                type="button"
                onClick={handleManualInput}
                className="mt-4 text-sm font-medium text-[#626B4F] underline underline-offset-4 transition hover:text-[#252820]"
              >
                Enter code manually
              </button>
            </div>
          )}

          {error && !scanning && (
            <div className="py-6">
              <div className="mb-4 border-l-4 border-[#C65B35] bg-[#EFEEE6] p-4">
                <p className="font-semibold text-[#252820]">
                  Scanner unavailable
                </p>
                <p className="mt-1 text-sm leading-6 text-[#696A61]">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={handleManualInput}
                className="w-full bg-[#626B4F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#48533E]"
              >
                Enter code manually
              </button>

              {jsQRLoaded && (
                <button
                  type="button"
                  onClick={startScanning}
                  className="mt-3 w-full border border-[#DEDCD3] px-5 py-3 text-sm font-semibold text-[#252820] transition hover:bg-[#EFEEE6]"
                >
                  Try camera again
                </button>
              )}
            </div>
          )}

          {scanning && (
            <div>
              <div className="relative overflow-hidden bg-[#252820]">
                <video
                  id="qr-video"
                  className="aspect-[4/3] w-full object-cover"
                  playsInline
                  muted
                />

                <canvas id="qr-canvas" className="hidden" />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative aspect-square w-[65%] max-w-64 border-2 border-[#D5A66D]">
                    <span className="absolute -left-0.5 -top-0.5 h-7 w-7 border-l-4 border-t-4 border-[#D5A66D]" />
                    <span className="absolute -right-0.5 -top-0.5 h-7 w-7 border-r-4 border-t-4 border-[#D5A66D]" />
                    <span className="absolute -bottom-0.5 -left-0.5 h-7 w-7 border-b-4 border-l-4 border-[#D5A66D]" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-7 w-7 border-b-4 border-r-4 border-[#D5A66D]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-b border-[#DEDCD3] py-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#626B4F] opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#626B4F]" />
                </span>

                <p className="text-sm text-[#696A61]">
                  Camera active. Looking for a QR code...
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeScanner}
                  className="border border-[#DEDCD3] px-4 py-3 text-sm font-semibold text-[#252820] transition hover:bg-[#EFEEE6]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleManualInput}
                  className="bg-[#626B4F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#48533E]"
                >
                  Enter manually
                </button>
              </div>
            </div>
          )}

          <p className="mt-5 border-t border-[#DEDCD3] pt-4 text-xs leading-5 text-[#858579]">
            Camera scanning requires permission from your browser. You can
            always use the manual verification option instead.
          </p>
        </div>
      </section>
    </div>
  );
};

export default function WorkerVerify() {
  const { user } = useAuth();

  const [verificationCode, setVerificationCode] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [inputMethod, setInputMethod] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      setQrImage(readerEvent.target.result);
      setInputMethod("upload");
      setMessage(
        "Image uploaded. Enter the five-digit code visible in the image."
      );
    };

    reader.onerror = () => {
      setMessage("Unable to read this image. Please try another file.");
    };

    reader.readAsDataURL(file);
  };

  const handleScanResult = (result) => {
    if (result === null) {
      setInputMethod("manual");
      setShowScanner(false);
      setMessage("Enter the five-digit verification code.");
    } else if (result) {
      setVerificationCode(result);
      setShowScanner(false);
      setInputMethod("scan");
      setMessage(
        "QR code scanned. Verify the collection to continue."
      );
    }
  };

  const startScanning = () => {
    setShowScanner(true);
    setQrImage(null);
    setMessage("");
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    if (user?.role !== "worker") {
      setMessage("Access denied. Worker role required.");
      return;
    }

    if (user?.workStatus !== "on-work") {
      setMessage(
        'You must be marked as "On Work" to verify waste collection.'
      );
      return;
    }

    if (!inputMethod) {
      setMessage(
        "Please scan a QR code, upload an image, or enter a code manually."
      );
      return;
    }

    if (!verificationCode || verificationCode.length !== 5) {
      setMessage("Please enter the five-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/waste/verify", {
        verificationCode,
        workerPhone: user.phone,
      });

      setMessage("Waste collection verified successfully!");
      setVerificationCode("");
      setQrImage(null);
      setInputMethod("");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Verification failed. Invalid code."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetMethod = () => {
    setInputMethod("");
    setQrImage(null);
    setVerificationCode("");
    setMessage("");
  };

  const messageIsSuccess = message.includes("successfully");
  const messageIsInformational =
    message.includes("uploaded") ||
    message.includes("Enter") ||
    message.includes("scanned");

  if (user?.role !== "worker") {
    return (
      <main className="min-h-[60vh] bg-[#F8F7F2] px-5 py-20 text-[#252820]">
        <div className="mx-auto max-w-xl border border-[#DEDCD3] bg-white p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C65B35]">
            Access restricted
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Worker access required
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#696A61]">
            This page is available only to registered collection workers.
          </p>
        </div>
      </main>
    );
  }

  if (user?.workStatus !== "on-work") {
    return (
      <main className="min-h-[60vh] bg-[#F8F7F2] px-5 py-12 sm:py-20">
        <section className="mx-auto max-w-2xl border border-[#DEDCD3] bg-white p-6 sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center border border-[#E6C6B7] bg-[#F8EEE9] text-[#C65B35]">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
            </svg>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#C65B35]">
            Worker status
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#252820]">
            Your shift is inactive
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-[#696A61]">
            You need to be marked as On Work before verifying a waste
            collection. Activate your work status from the worker controls
            before continuing.
          </p>

          <div className="mt-6 border-t border-[#DEDCD3] pt-5">
            <p className="text-xs uppercase tracking-wider text-[#858579]">
              Required status
            </p>
            <p className="mt-2 font-semibold text-[#626B4F]">
              On Work
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-8 text-[#252820] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 border-b border-[#DEDCD3] pb-7 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#626B4F]">
            Clean-India / Collection operations
          </p>

          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Verify collection
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#696A61]">
                Confirm a waste pickup using the citizen&apos;s
                five-digit verification code.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 border border-[#D5DDCB] bg-[#EEF0E8] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#626B4F]" />
              <span className="text-xs font-semibold text-[#48533E]">
                Shift active
              </span>
            </div>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="border border-[#DEDCD3] bg-white">
            <div className="border-b border-[#DEDCD3] px-5 py-5 sm:px-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#858579]">
                Collection verification
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                Confirm a pickup
              </h2>
            </div>

            <form
              onSubmit={handleVerify}
              className="space-y-6 p-5 sm:p-7"
            >
              {!inputMethod && (
                <div>
                  <p className="mb-4 text-sm leading-6 text-[#696A61]">
                    Choose how you want to provide the collection code.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={startScanning}
                      className="group flex min-h-36 flex-col items-start justify-between border border-[#626B4F] bg-[#626B4F] p-5 text-left text-white transition hover:bg-[#48533E]"
                    >
                      <svg
                        className="h-7 w-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <path d="M14 14h3v3h-3zM20 14v2M14 20h2M20 19v2" />
                      </svg>

                      <span>
                        <span className="block font-semibold">
                          Scan QR code
                        </span>
                        <span className="mt-1 block text-xs text-white/75">
                          Use your device camera
                        </span>
                      </span>
                    </button>

                    <label className="relative flex min-h-36 cursor-pointer flex-col items-start justify-between border border-[#DEDCD3] bg-[#F8F7F2] p-5 transition hover:border-[#626B4F]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        aria-label="Upload QR code image"
                      />

                      <svg
                        className="h-7 w-7 text-[#626B4F]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M12 16V4m-4 4 4-4 4 4" />
                        <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
                      </svg>

                      <span>
                        <span className="block font-semibold">
                          Upload image
                        </span>
                        <span className="mt-1 block text-xs text-[#696A61]">
                          View the code from a saved image
                        </span>
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setInputMethod("manual");
                        setMessage("Enter the five-digit verification code.");
                      }}
                      className="flex items-center gap-3 border border-[#DEDCD3] px-5 py-4 text-left transition hover:border-[#626B4F] hover:bg-[#F8F7F2] sm:col-span-2"
                    >
                      <svg
                        className="h-5 w-5 shrink-0 text-[#626B4F]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                      </svg>

                      <span>
                        <span className="block text-sm font-semibold">
                          Enter code manually
                        </span>
                        <span className="mt-1 block text-xs text-[#696A61]">
                          Type the five digits provided by the citizen
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {inputMethod === "upload" && qrImage && (
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold">
                      Uploaded QR image
                    </label>

                    <button
                      type="button"
                      onClick={resetMethod}
                      className="text-xs font-medium text-[#626B4F] underline underline-offset-4"
                    >
                      Choose another method
                    </button>
                  </div>

                  <div className="border border-[#DEDCD3] bg-[#F8F7F2] p-3">
                    <img
                      src={qrImage}
                      alt="Uploaded QR code"
                      className="mx-auto max-h-64 max-w-full object-contain"
                    />
                  </div>

                  <p className="mt-3 text-xs leading-5 text-[#696A61]">
                    Read the five-digit code displayed in the image and
                    enter it below.
                  </p>
                </div>
              )}

              {inputMethod && (
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label
                      htmlFor="verificationCode"
                      className="text-sm font-semibold"
                    >
                      Five-digit verification code
                    </label>

                    {inputMethod !== "upload" && (
                      <button
                        type="button"
                        onClick={resetMethod}
                        className="text-xs font-medium text-[#626B4F] underline underline-offset-4"
                      >
                        Change method
                      </button>
                    )}
                  </div>

                  <input
                    id="verificationCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(
                        event.target.value.replace(/\D/g, "").slice(0, 5)
                      )
                    }
                    placeholder="00000"
                    maxLength={5}
                    required
                    className="w-full border border-[#DEDCD3] bg-[#F8F7F2] px-4 py-5 text-center font-mono text-3xl tracking-[0.35em] text-[#252820] outline-none transition placeholder:text-[#C8C6BC] focus:border-[#626B4F] focus:ring-1 focus:ring-[#626B4F]"
                  />

                  <p className="mt-2 text-xs text-[#858579]">
                    {verificationCode.length} of 5 digits entered
                  </p>
                </div>
              )}

              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`border-l-4 px-4 py-3 text-sm leading-6 ${
                    messageIsSuccess
                      ? "border-[#626B4F] bg-[#EEF0E8] text-[#48533E]"
                      : messageIsInformational
                        ? "border-[#626B4F] bg-[#F2F1EA] text-[#48533E]"
                        : "border-[#C65B35] bg-[#F8EEE9] text-[#8B4028]"
                  }`}
                >
                  {message}
                </div>
              )}

              {inputMethod && (
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 5}
                  className="flex w-full items-center justify-center gap-2 bg-[#C65B35] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#A94A2B] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Verifying collection...
                    </>
                  ) : (
                    <>
                      Verify collection
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </form>
          </section>

          <aside className="space-y-4">
            <section className="border border-[#DEDCD3] bg-[#EFEEE6] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#626B4F]">
                Before you verify
              </p>

              <ol className="mt-5 space-y-5">
                {[
                  {
                    number: "01",
                    title: "Confirm the pickup",
                    detail: "Make sure the waste collection has taken place.",
                  },
                  {
                    number: "02",
                    title: "Check the code",
                    detail: "Use the code supplied for this specific collection.",
                  },
                  {
                    number: "03",
                    title: "Submit verification",
                    detail: "Enter all five digits to confirm the collection.",
                  },
                ].map((step) => (
                  <li key={step.number} className="flex gap-3">
                    <span className="pt-0.5 font-mono text-xs text-[#858579]">
                      {step.number}
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold text-[#252820]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-[#696A61]">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="border border-[#DEDCD3] bg-white p-5">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#626B4F]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M12 3 4 6v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>

                <div>
                  <h3 className="text-sm font-semibold">
                    Verification matters
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[#696A61]">
                    Only verify a collection after confirming that the
                    pickup has actually been completed.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {showScanner && (
          <QRScanner
            onScan={handleScanResult}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </main>
  );
}