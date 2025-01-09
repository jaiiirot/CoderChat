<script>
  import { onMount } from "svelte";
  import Quagga from "quagga";
  let textCopy = false;
  let _scannerIsRunning = false;
  let lastScanTime = 0;
  let _selectedCameraId = null;
  let _selectedCameraLabel = "Front Camera"; // Initial label

  function controlL(text) {
    let newtext = text;
    newtext = newtext.replace(/\$/g, "L");
    newtext = newtext.replace(/\@/g, "L");
    newtext = newtext.replace(/\?/g, "L");

    newtext = newtext.replace(/\!/g, "0");
    newtext = newtext.replace(/-/g, "0");
    newtext = newtext.replace(/\^/g, "0");

    return newtext;
  }

  function startScanner() {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#scanner-container"),
          constraints: {
            width: 640,
            height: 480,
            facingMode: _selectedCameraId,
          },
        },
        decoder: {
          readers: ["ean_reader"],
          debug: {
            showCanvas: false,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true,
            },
          },
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }

        console.log("Initialization finished. Ready to start");
        Quagga.start();

        _scannerIsRunning = true;
      }
    );

    Quagga.onDetected(function (result) {
      const currentTime = Date.now();
      if (currentTime - lastScanTime > 2000) {
        lastScanTime = currentTime;
        textCopy = true;
        setTimeout(() => {
          textCopy = false;
        }, 2000);
        document.getElementById("result").value = controlL(
          result.codeResult.code
        );
        navigator.clipboard
          .writeText(result.codeResult.code)
          .then(() => {
            console.log("Metin panoya kopyalandı: " + inputValue);
          })
          .catch((error) => {
            console.error("Panoya kopyalama başarısız: " + error);
          });
        let context = new AudioContext();
        let oscillator = context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = 800;
        oscillator.connect(context.destination);
        oscillator.start();

        setTimeout(() => {
          oscillator.stop();
        }, 150);
      }
    });
  }

  // Start/stop scanner
  function toggleScanner() {
    if (_scannerIsRunning) {
      Quagga.stop();
    } else {
      startScanner();
    }
  }

  function switchCamera() {
    _selectedCameraId =
      _selectedCameraId === "environment" ? "user" : "environment";
    _selectedCameraLabel =
      _selectedCameraId === "environment" ? "Front Camera" : "Rear Camera";
    if (_scannerIsRunning) {
      Quagga.stop();
      startScanner();
    }
  }

  onMount(() => {
    startScanner();
  });
</script>

<aside class="bg-white w-min h-min">
  {#if textCopy == true}
    <div class="message">
      <div class="success">Barcode Copied</div>
    </div>
  {/if}
  <div id="scanner-container" class="flex">
    <button on:click={switchCamera} class="cameraaa" aria-label="Switch Camera">
      <i class="fa-thin fa-camera-rotate"></i>
    </button>
    <div class="target"></div>

    <button id="btn" on:click={toggleScanner}>
      {_scannerIsRunning ? "Stop Scanner" : "Start Scanner"}
    </button>
  </div>
  <input id="result" type="text" class="2xl color-white" />
</aside>
