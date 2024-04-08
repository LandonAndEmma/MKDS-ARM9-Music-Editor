## Mario Kart DS ARM9 Music Slots Table Editor

### Description
This Python tool allows you to edit music slot values within Mario Kart DS' arm9.bin. With this tool, you can utilize any sseq on most slots of the game.

[Original Repository](https://github.com/Ermelber/MKDS-ARM9-Music-Editor)

### Installation and Compilation

**For Running from Source Code:**
- Download the latest version of Python.
- Install required packages by running:
  ```
  pip install Nuitka
  pip install tk
  ```

**For Compiling to .exe:**
- Install Python 3.11.7.
- Run either of these commands:
  - Onefile command:
    ```
    nuitka --enable-plugin=tk-inter --onefile gui.py
    ```
  - Standalone command:
    ```
    nuitka --enable-plugin=tk-inter --standalone gui.py
    ```

### Usage
After compiling, use Resource Hacker to inject the app icon located in the favicon folder.

### Note
If you don't want to compile, you can simply run the tool using Python.
