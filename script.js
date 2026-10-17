// Html elements
const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const code = "const draw = (img) => { for (let y = 0; y < h; y++) { ctx.fillText(c, x, y); } }; ";
const colsSlider = document.getElementById('cols');
const colsValue = document.getElementById('colsValue');
const modeSelect = document.getElementById('mode');
const ideCheckbox = document.getElementById("ide");
const downloadBtn = document.getElementById("download");
const charsSelect = document.getElementById("chars");
const RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
let image = null;

const SYNTAX = [
  [224, 108, 117], // rot
  [209, 154, 102], // orange
  [229, 192, 123], // gelb
  [215, 201, 167], // beige
  [86, 182, 194],  // türkis
  [229, 229, 229], // weiß
  [92, 99, 112],   // grau
  [45, 49, 57],    // dunkelgrau
];

function nearestSyntax(r, g, b) {
  let best = SYNTAX[0];
  let bestDist = Infinity;

  for (const c of SYNTAX) {
    const dist = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = c;
    }
  }
  return `rgb(${best[0]}, ${best[1]}, ${best[2]})`;
}

function getColor(r, g, b) {
  const mode = modeSelect.value;
  const light = (r + g + b) / 3;

  if (mode === "matrix") {
    return `rgb(0, ${light}, 0)`;
  }
  if (mode === "mono") {
    return `rgb(${light}, ${light}, ${light})`;
  }
  if (mode === "syntax") {
    return nearestSyntax(r, g, b);
  }
  return `rgb(${r}, ${g}, ${b})`;
  
}

function drawFrame(rows, charH, top) {
    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(0, 0, canvas.width, top);

    const dots = [
        { color: "#ff5f57", x: 16 },
        { color: "#febc2e", x: 34 },
        { color: "#28c840", x: 52 }
    ];
    for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, top / 2, 6, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
    }

    ctx.font = "13px monospace";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#cccccc";
    ctx.fillText("pacscore.js", 70, top / 2);

    ctx.font = "14px monospace";
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.fillStyle = "#555555";
    for (let y = 0; y < rows; y++) {
        ctx.fillText(String(y + 1).padStart(3), 42, top + y * charH);
    }
    ctx.textAlign = "left";
}

// file uploaing
function draw() {
    if (!image) return;
    const cols = Number(colsSlider.value);

    // canvas size
    const rows = Math.round(cols * (image.height / image.width) * 0.5);
    const small = document.createElement("canvas");
    small.width = cols;
    small.height = rows;
    const sctx = small.getContext("2d");
    sctx.drawImage(image, 0, 0, cols, rows);
    const pixels = sctx.getImageData(0, 0, cols, rows).data;

    ctx.font = "bold 14px monospace";
    const charW = ctx.measureText("M").width;
    const charH = 16;

    const top = ideCheckbox.checked ? 40 : 0;
    const left = ideCheckbox.checked ? 50 : 0;
    canvas.width = left + cols * charW;
    canvas.height = top + rows * charH;
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (ideCheckbox.checked) {
        drawFrame(rows, charH, top);
    }

    ctx.font = "bold 14px monospace";
    ctx.textBaseline = "top";

    let i = 0;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const p = (y * cols + x) * 4;
            const r = pixels[p];
            const g = pixels[p + 1];
            const b = pixels[p + 2];

            ctx.fillStyle = getColor(r, g, b);
            const light = (r + g + b) / 3;
            let char;

            if (charsSelect.value === "ascii") {
                const Index = Math.floor((light / 255) * (RAMP.length - 1));
                char = RAMP[Index];
            } else {
                char = code[i % code.length];
            }

            if (char === " ") {
                ctx.fillText(char, left + x * charW, top + y * charH);
            }
            i++;
        }
    }
    canvas.toBlob((blob) => (lastBlob = blob), "image/png");
}

upload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    image = await createImageBitmap(file);
    draw();

});

colsSlider.addEventListener("input", () => {
  colsValue.textContent = colsSlider.value;
  draw();
});

modeSelect.addEventListener("change", draw);

ideCheckbox.addEventListener("change", draw);

    let lastBlob = null;

    downloadBtn.addEventListener("click", async() => {
      if (!lastBlob) {
        alert("upload image first");
        return;
      }

      const file = new File([lastBlob], "code-art.png", { type: "image/png" });
      const isMobile = matchMedia("(pointer: coarse)").matches;

      if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
        } catch (error) {

        }
        return;
      }

      const url = URL.createObjectURL(lastBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "code-art.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
});
