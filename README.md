Mario Kart DS ARM9 Music Slots Table editor!
A tool written in Python that is able to edit Music slots values inside Mario Kart DS' arm9.bin. With this you'll be able to use any sseq on any (most) slot of the game.<br>
Original: https://github.com/Ermelber/MKDS-ARM9-Music-Editor

To compile or run from the source code follow the instructions below:

Download the latest version of python if you want to run from source code, but if you want to compile to .exe install python 3.11.7.

Run these commands to install the packages needed for compiling, you only need Tkinter if you want to run from source code.

pip install Nuitka<br>
pip install tk

If you don't want to compile then this is the end of the tutorial, now run it in python.

To compile to .exe use either of these 2 commands:

Onefile command:
nuitka --enable-plugin=tk-inter --onefile gui.py

Standalone command:
nuitka --enable-plugin=tk-inter --standalone gui.py

After compiling use Resource Hacker to inject the app icon in the favicon folder.
