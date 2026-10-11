// Html elements
const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const code = "const draw = (img) => { for (let y = 0; y < h; y++) { ctx.fillText(c, x, y); } }; ";
const cols = 120;

// file uploaing
upload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // image upload
    const image = await createImageBitmap(file);
    console.log("Image-Size: ", image.width, "x", image.height);

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

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillText(code[i % code.length], x * charW, y * charH);
            i++;
        }
    }
});