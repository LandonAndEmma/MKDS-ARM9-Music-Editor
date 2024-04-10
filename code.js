let ARM9_BIN_PATH = null;
let ARM_VALUES = [];
const ARM_OFFSETS = {
    "Grand Prix Flyover": 0x153171,
    "Grand Prix Flyover (Figure-8 Circuit, GCN Luigi Circuit, Mario Circuit)": 0x153175,
    // other track offsets...
};

function openFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.bin';
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            ARM9_BIN_PATH = file.name;
            const fileContent = await readBinaryFile(file);
            ARM_VALUES = Array.from(fileContent);
            refreshListbox();
        }
    });
    fileInput.click();
}

function readBinaryFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

async function saveFile() {
    if (ARM9_BIN_PATH) {
        try {
            const uint8Array = new Uint8Array(ARM_VALUES);
            const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = ARM9_BIN_PATH;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    } else {
        console.error('No file is opened to save.');
    }
}

function refreshListbox() {
    // Implement listbox refreshing logic
}

function openPopup() {
    // Implement popup opening logic
}

function saveFileAs() {
    // Implement "Save As" logic
}

function openHelp() {
    // Implement help menu logic
}

function openRepository() {
    // Implement opening repository logic
}

function onListboxSelect() {
    // Implement listbox selection logic
}

window.addEventListener('DOMContentLoaded', (event) => {
    // Add event listeners and initialize the app
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            ARM9_BIN_PATH = file.name;
            const fileContent = await readBinaryFile(file);
            ARM_VALUES = Array.from(fileContent);
            refreshListbox();
        }
    });

    // Add other event listeners
});