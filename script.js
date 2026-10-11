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
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const rows = Math.round(cols * (image.height / image.width) * 0.5);
    const small = document.createElement("canvas");
    small.width = cols;
    small.height = rows;
    const sctx = small.getContext("2d");
    sctx.drawImage(image, 0, 0, cols, rows);
    const pixels = sctx.getImageData(0, 0, cols, rows).data;

    const charW = 8;
    const charH = 16;
    canvas.width = cols * charW;
    canvas.height = rows * charH;
    ctx.fillstyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold 14px monospace`;
    ctx.textBaseline = "top";

    
});