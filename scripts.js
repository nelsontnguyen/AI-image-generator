const apiKey = "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";

const maxImages = 4; //This variable won't change
let selectedImageNumber = null;

// Function to generate a random number between min and max (this is inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to disable the generate button during processing
function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

// Function to enable the generate button during processing
function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}

// Function to clear the current display grid 
function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

// Function to create images
async function createImages(input) {
    // Disable the generate button
    disableGenerateButton();

    // Clear the current image grid
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImages; i++) {
        //Generate a random number between 1 and 100 and append to the prompt
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );
        
        if (!response.ok) {
            alert(`Error: ${response.statusText}`);
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt =  `art-${i+1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null;
}

document.getElementById("generate").addEventListener
('click', () => {
    const input = document.getElementById("user-prompt").value;
    createImages(input);
});

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a"); // This accesses the href attribute of a in html
    link.href = imgUrl;
    link.download = `image-${imageNumber+1}.jpg`; // we save this as the address for the jpeg
    link.click();
}


