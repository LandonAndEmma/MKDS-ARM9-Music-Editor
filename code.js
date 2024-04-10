let ARM9_BIN_PATH = null;
let ARM_VALUES = [];
const ARM_OFFSETS = {
    "Grand Prix Flyover": 0x153171,
    "Grand Prix Flyover (Figure-8 Circuit, GCN Luigi Circuit, Mario Circuit)": 0x153175,
    "Wario Stadium Flyover": 0x153179,
    "Battle Mode Flyover": 0x153181,
    "Boss Intro": 0x153185,
    "Figure-8 Circuit": 0x153189,
    "GCN Yoshi Circuit": 0x153191,
    "Cheep Cheep Beach": 0x153195,
    "Yoshi Falls": 0x153199,
    "Bowser Castle": 0x153201,
    "GBA Sky Garden": 0x153205,
    "Battle Mode": 0x153209,
    "New Reward": 0x153211,
    "Grand Prix Results": 0x153215,
    "Credits (50cc + 100cc)": 0x153219,
    "Wi-Fi Menu": 0x153221,
    "Multiplayer Menu": 0x153225,
    "Records Menu": 0x153229,
    "Game Intro": 0x153231,
    "Singleplayer Menu": 0x153235,
    "Grand Prix Flyover (Waluigi Pinball)": 0x15317D,
    "GCN Luigi Circuit": 0x15318D,
    "GCN Baby Park": 0x15319D,
    "N64 Moo Moo Farm": 0x1531A1,
    "N64 Frappe Snowland": 0x1531A5,
    "Delfino Square": 0x1531A9,
    "Airship Fortress": 0x1531AD,
    "Wario Stadium": 0x1531B1,
    "GCN Mushroom Bridge": 0x1531B5,
    "Peach Gardens": 0x1531B9,
    "Luigi's Mansion": 0x1531BD,
    "SNES Mario Circuit 1": 0x1531C1,
    "SNES Koopa Beach 2": 0x1531C5,
    "SNES Donut Plains 1": 0x1531C9,
    "SNES Choco Island 2": 0x1531CD,
    "GBA Peach Circuit": 0x1531D1,
    "GBA Luigi Circuit": 0x1531D5,
    "Shroom Ridge": 0x1531D9,
    "N64 Choco Mountain": 0x1531DD,
    "N64 Banshee Boardwalk": 0x1531E1,
    "DK Pass": 0x1531E5,
    "Desert Hills": 0x1531E9,
    "Waluigi Pinball": 0x1531ED,
    "Tick Tock Clock": 0x1531F1,
    "Mario Circuit": 0x1531F5,
    "Rainbow Road": 0x1531F9,
    "GBA Bowser Castle 2": 0x1531FD,
    "Boss Battle": 0x15320D,
    "Credits (150cc + Mirror)": 0x15321D
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

function openRepository() {
    const repositoryUrl = 'https://github.com/LandonAndEmma/MKDS-ARM9-Music-Editor';
    window.open(repositoryUrl, '_blank');
}

function openPopup() {
    const selectedTrack = listbox.options[listbox.selectedIndex].text;
    const offset = ARM_OFFSETS[selectedTrack];
    
    const popupWindow = window.open('', 'Change SEQ Value', 'width=300,height=180');
    popupWindow.document.write(`
        <html>
        <head>
        <title>Change SEQ Value</title>
        </head>
        <body>
        <label for="seqValue">Enter new SEQ value:</label>
        <input type="number" id="seqValue" min="0" max="75" required>
        <button onclick="changeSeqValue()">Change SEQ Value</button>
        </body>
        </html>
    `);

    popupWindow.changeSeqValue = function() {
        const newSeqValue = parseInt(popupWindow.document.getElementById('seqValue').value);
        if (!isNaN(newSeqValue) && newSeqValue >= 0 && newSeqValue <= 75) {
            ARM_VALUES[offset] = newSeqValue;
            refreshListbox();
            popupWindow.close();
            alert(`SEQ value for ${selectedTrack} changed to ${newSeqValue}`);
        } else {
            alert('Invalid SEQ value. Value must be between 0 and 75.');
        }
    };
}

async function saveFileAs() {
    try {
        const uint8Array = new Uint8Array(ARM_VALUES);
        const blob = new Blob([uint8Array], { type: 'application/octet-stream' });

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.bin';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
            document.body.removeChild(fileInput);
        });

        fileInput.click();
    } catch (error) {
        console.error('Error saving file:', error);
    }
}

function openHelp() {
    const helpMessage = `
    This program allows you to edit the music track SEQ IDs in the arm9.bin file of Mario Kart DS.\n\n
    1. To get started, go to File > Open and select the arm9.bin file you want to edit.\n\n
    2. Once the file is opened, click on a track in the list to change its SEQ ID.\n\n
    3. After making changes, go to File > Save to save the modified file.\n\n
    Original Code: Ermelber, Yami, MkDasher\n
    Fixed and made into a Python GUI app by Landon & Emma`;

    alert(helpMessage);
}

function onListboxSelect() {
    const selectedTrack = listbox.options[listbox.selectedIndex].text;
    if (selectedTrack) {
        openPopup();
    }
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