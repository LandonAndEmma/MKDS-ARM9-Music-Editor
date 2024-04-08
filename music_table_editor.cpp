#include <windows.h>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>
#include <sstream>

using namespace std;

// Function to read file contents
string getFileContents(const string &filename) {
    ifstream in(filename, ios::in | ios::binary);
    if (in) {
        ostringstream contents; // Correctly declared ostringstream
        contents << in.rdbuf();
        in.close();
        return contents.str();
    } else {
        cerr << "Failed to open file: " << filename << endl;
        cin.ignore();
        exit(1);
    }
}

// Function to get the path of the ARM9 binary file
string getArm9BinPath() {
    OPENFILENAME ofn;
    char szFile[260] = {0};

    ZeroMemory(&ofn, sizeof(ofn));
    ofn.lStructSize = sizeof(ofn);
    ofn.hwndOwner = NULL;
    ofn.lpstrFile = szFile;
    ofn.lpstrFile[0] = '\0';
    ofn.nMaxFile = sizeof(szFile);
    ofn.lpstrFilter = "Binary Files (*.bin)\0*.bin\0All Files (*.*)\0*.*\0";
    ofn.nFilterIndex = 1;
    ofn.lpstrFileTitle = NULL;
    ofn.nMaxFileTitle = 0;
    ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST | OFN_NOCHANGEDIR;

    if (GetOpenFileName(&ofn) == TRUE) {
        return string(szFile);
    } else {
        cerr << "No file selected." << endl;
        cin.ignore();
        exit(1);
    }
}

int main() {
    const int offset = 1388909;
    int selected;
    int newValue;
    char choice;
    
    // Track names
    vector<string> tracks = {
        "Unknown", "Course Intro 2", "Course Intro 1", "Course Intro 3", "Course Intro 1", "Battle Mode Intro",
        "Boss Intro", "Figure-8 Circuit", "GCN Luigi Circuit", "GCN Yoshi Circuit", "Cheep Cheep Beach",
        "Yoshi Falls", "GCN Baby Park", "N64 Moo Moo Farm", "N64 Frappe Snowland", "Delfino Sqare",
        "Airship Fortress", "Wario Stadium", "GCN Mushroom Bridge", "Peach Gardens", "Luigi's Mansion",
        "SNES Mario Circuit 1", "SNES Koopa Beach 2", "SNES Donut Plains 1", "SNES Choco Island 2",
        "GBA Peach Circuit", "GBA Luigi Circuit", "Shroom Ridge", "N64 Choco Mountain", "N64 Banshee Boardwalk",
        "DK Pass", "Desert Hills", "Waluigi Pinball", "Tick-Tock Clock", "Mario Circuit", "Rainbow Road",
        "GBA Bowser Castle 2", "Bowser Castle", "GBA Sky Garden", "Battle Stage Theme", "Boss Battle Theme",
        "Jingle", "GP Results", "Credits", "Credits True", "Wi-Fi Menu", "Multiplayer Menu", "Records Menu",
        "Options Menu", "Intro", "Singleplayer Menu", "Unknown", "Mario Circuit"
    };

    cout << "Mario Kart DS ARM9 Music Table Editor by Ermelber and Landon & Emma\n\nPress any key to start the program.\n";
    cin.ignore();

    string arm9BinPath = getArm9BinPath();
    string text = getFileContents(arm9BinPath);
    vector<int> armValues(211);
    for (int i = offset; i < min<int>(text.size(), offset + 211); i++)
        armValues[i - offset] = static_cast<int>(text[i]);

    int seqIndex; // Declare seqIndex outside the loop

    do {
        for (size_t i = 0; i < tracks.size(); i++) {
            cout << i << ") " << tracks[i] << " [" << armValues[i * 4] << "]" << endl;
        }

        do {
            cout << "\n\nSelect a track to change [0.." << tracks.size() - 1 << "]: ";
            cin >> selected;
        } while (selected < 0 || selected >= tracks.size());

        while (true) {
            cout << "\nDo you want to change Track " << selected << "'s (" << tracks[selected] << ") SEQ value? [Y/N] ";
            cin >> choice;
            if (toupper(choice) == 'Y') {
                do {
                    // Get the index of the SEQ value for the selected track
                    seqIndex = selected * 4;

                    cout << "\nInsert the new SEQ value (Old value was " << armValues[seqIndex] << ") [-1..75]=";
                    cin >> newValue;
                } while (newValue < -1 || newValue > 75);

                // Update the SEQ value for the selected track
                armValues[seqIndex] = newValue;
                break;
            } else if (toupper(choice) == 'N') {
                break;
            } else {
                cout << "\nThe Choice isn't valid.";
            }
        }

        while (true) {
            cout << "\nDo you want to edit it furthermore? [Y/N] ";
            cin >> choice;

            if (toupper(choice) == 'Y') {
                break;
            } else if (toupper(choice) == 'N') {
                break;
            } else {
                cout << "\nThe Choice isn't valid.";
            }
        }
    } while (toupper(choice) == 'Y');

    // Save the modified ARM9 binary file
    ofstream out("arm9.bin.bak", ios_base::binary | ios_base::out);
    out << text;
    out.close();

    for (int i = offset; i < min<int>(text.size(), offset + 211); i++)
        text[i] = armValues[i - offset];

    out.open("arm9.bin", ios_base::binary | ios_base::out);
    out << text;
    out.close();

    cout << "\nSuccessfully saved edited_arm9.bin in your folder!\nPress ENTER to exit the program :3\n";
    cin.ignore();
    cin.ignore();

    return 0;
}
