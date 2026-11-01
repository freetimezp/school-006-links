const controls = {
    decoration: document.querySelector("#decorationSelect"),
    style: document.querySelector("#styleSelect"),
    color: document.querySelector("#colorSelect"),
    thickness: document.querySelector("#thicknessRange"),
    offset: document.querySelector("#offsetRange"),
};

const outputs = {
    color: document.querySelector("#colorValue"),
    thickness: document.querySelector("#thicknessValue"),
    offset: document.querySelector("#offsetValue"),
};

const previewLink = document.querySelector("#playgroundLink");
const generatedCSS = document.querySelector("#generatedCSS");
const copyButton = document.querySelector("#copyButton");
const copyFeedback = document.querySelector("#copyFeedback");
const resetButton = document.querySelector("#resetButton");

const defaultSettings = {
    decoration: "underline",
    style: "solid",
    color: "#ff8c9e",
    thickness: 2,
    offset: 5,
};

function getCurrentSettings() {
    return {
        decoration: controls.decoration.value,
        style: controls.style.value,
        color: controls.color.value,
        thickness: Number(controls.thickness.value),
        offset: Number(controls.offset.value),
    };
}

function createCSS(settings) {
    return `.playground-link {
    text-decoration-line: ${settings.decoration};
    text-decoration-style: ${settings.style};
    text-decoration-color: ${settings.color};
    text-decoration-thickness: ${settings.thickness}px;
    text-underline-offset: ${settings.offset}px;
}`;
}

function updatePlayground() {
    const settings = getCurrentSettings();

    // Update the live link.
    previewLink.style.textDecorationLine = settings.decoration;
    previewLink.style.textDecorationStyle = settings.style;
    previewLink.style.textDecorationColor = settings.color;
    previewLink.style.textDecorationThickness = `${settings.thickness}px`;
    previewLink.style.textUnderlineOffset = `${settings.offset}px`;

    // Update displayed values.
    outputs.color.textContent = settings.color.toUpperCase();
    outputs.thickness.textContent = `${settings.thickness}px`;
    outputs.offset.textContent = `${settings.offset}px`;

    // Update generated CSS.
    generatedCSS.textContent = createCSS(settings);

    // Clear previous copy feedback.
    copyFeedback.textContent = "";
}

function resetPlayground() {
    controls.decoration.value = defaultSettings.decoration;
    controls.style.value = defaultSettings.style;
    controls.color.value = defaultSettings.color;
    controls.thickness.value = defaultSettings.thickness;
    controls.offset.value = defaultSettings.offset;

    updatePlayground();
}

async function copyCSS() {
    const css = createCSS(getCurrentSettings());

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(css);
        } else {
            // Fallback for browsers without Clipboard API support.
            const temporaryTextarea = document.createElement("textarea");

            temporaryTextarea.value = css;
            temporaryTextarea.style.position = "fixed";
            temporaryTextarea.style.opacity = "0";

            document.body.appendChild(temporaryTextarea);
            temporaryTextarea.select();

            const copied = document.execCommand("copy");
            temporaryTextarea.remove();

            if (!copied) {
                throw new Error("Copy command failed.");
            }
        }

        copyFeedback.textContent = "CSS COPIED TO CLIPBOARD ✓";
    } catch (error) {
        console.error("Could not copy CSS:", error);
        copyFeedback.textContent = "Copy unavailable. Select the CSS manually.";
    }
}

// Listen for changes in every control.
Object.values(controls).forEach((control) => {
    control.addEventListener("input", updatePlayground);
    control.addEventListener("change", updatePlayground);
});

// Reset and copy actions.
resetButton.addEventListener("click", resetPlayground);
copyButton.addEventListener("click", copyCSS);

// Initialize the playground.
updatePlayground();
