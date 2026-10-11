// Html elements
const upload = document.getElementById('upload');
const canvas = document.getElementById
const ctx = canvas.getContext('2d');

// file uploaing
upload.addEventlistener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // image upload
    const image = await createImageBitmap(file);
    console.log("Image-Size: ", image.width, "x", image.height);

    // canvas size
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
});