#include <iostream>
#include <fstream>
#include <string>
#include <vector>

using namespace std;

const int TRACK_COUNT = 53;
const int OFFSET = 1388909;

// Structure to hold track information
struct Track {
    string name;
    int seqValue;
};

// Function to load track names and default sequence values
vector<Track> loadTracks() {
    vector<Track> tracks(TRACK_COUNT);
    // Initialize track names and default sequence values
    tracks[0] = {"Unknown", 0};
    tracks[1] = {"Course Intro 2", 0};
    tracks[2] = {"Course Intro 1", 0};
    // Add more tracks...
    return tracks;
}

// Function to read file contents into a string
string getFileContents(const string& filename) {
    ifstream file(filename, ios::in | ios::binary);
    if (!file.is_open()) {
        cerr << "Error: Unable to open file " << filename << endl;
        exit(1);
    }
    // Read file contents into a string
    return string((istreambuf_iterator<char>(file)), istreambuf_iterator<char>());
}

// Function to save string contents into a file
void saveFileContents(const string& filename, const string& contents) {
    ofstream file(filename, ios::binary);
    if (!file.is_open()) {
        cerr << "Error: Unable to save file " << filename << endl;
        exit(1);
    }
    // Write string contents into a file
    file << contents;
}

// Function to print track names and their corresponding sequence values
void printTracks(const vector<Track>& tracks) {
    for (int i = 0; i < TRACK_COUNT; ++i) {
        cout << i << ") " << tracks[i].name << " [" << tracks[i].seqValue << "]" << endl;
    }
}

int main() {
    // Load track information
    vector<Track> tracks = loadTracks();
    // Read arm9.bin file into a string
    string arm9Data = getFileContents("arm9.bin");
    // Extract sequence values from arm9.bin data
    vector<int> arm9Values(arm9Data.begin() + OFFSET, arm9Data.begin() + OFFSET + TRACK_COUNT * 4);

    // Prompt user to start the program
    cout << "Mario Kart DS ARM9 Music Table Editor" << endl;
    cout << "Press ENTER to start the program." << endl;
    cin.ignore();

    char choice;
    do {
        // Display track names and sequence values
        printTracks(tracks);

        int selected;
        // Prompt user to select a track slot
        do {
            cout << "\nSelect a slot to change [0.." << TRACK_COUNT - 1 << "]: ";
            cin >> selected;
        } while (selected < 0 || selected >= TRACK_COUNT);

        // Prompt user to confirm editing of the selected track
        cout << "\nDo you want to change Slot " << selected << "'s (" << tracks[selected].name << ") SEQ value? [Y/N] ";
        cin >> choice;

        // If user confirms editing, prompt for new sequence value
        if (tolower(choice) == 'y') {
            int newValue;
            do {
                cout << "\nEnter the new SEQ value (Old value was " << arm9Values[selected] << ") [-1..75]: ";
                cin >> newValue;
            } while (newValue < -1 || newValue > 75);
            // Update the selected track's sequence value
            arm9Values[selected] = newValue;
        }

        // Prompt user to continue editing
        cout << "\nDo you want to edit it further? [Y/N] ";
        cin >> choice;
    } while (tolower(choice) == 'y');

    // Update arm9 data with modified sequence values and save it
    for (int i = 0; i < TRACK_COUNT; ++i) {
        arm9Data[OFFSET + i * 4] = arm9Values[i];
    }
    saveFileContents("arm9.bin.bak", arm9Data);
    saveFileContents("arm9.bin", arm9Data);

    // Inform user about successful save and prompt to exit
    cout << "\nSuccessfully saved edited_arm9.bin in your folder!" << endl;
    cout << "Press ENTER to exit the program." << endl;
    cin.ignore();
    cin.ignore();
    return 0;
}