// Html elements
const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const code = "const draw = (img) => { for (let y = 0; y < h; y++) { ctx.fillText(c, x, y); } }; ";
const colsSlider = document.getElementById('cols');
const colsValue = document.getElementById('colsValue');
const modeSelect = document.getElementById('mode');
let image = null;

function getColor(r, g, b) {
  const mode = modeSelect.value;
  const light = (r + g + b) / 3;

  if (mode === "matrix") {
    return `rgb(0, ${light}, 0)`;
  }
  if (mode === "mono") {
    return `rgb(${light}, ${light}, ${light})`;
  }
  return `rgb(${r}, ${g}, ${b})`;

  if (mode === "invert") {
    return `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
  } 
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

    canvas.width = cols * charW;
    canvas.height = rows * charH;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            ctx.fillText(code[i % code.length], x * charW, y * charH);
            i++;
        }
    }
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

