import tkinter as tk  # Import the tkinter module for creating GUI
from tkinter import filedialog, messagebox  # Import specific functions/classes from tkinter
import os  # Import the os module for interacting with the operating system
import webbrowser  # Import the webbrowser module for opening web pages

# Global variables
ARM9_BIN_PATH = None  # Path to the ARM9 binary file
OFFSET = 1388909  # Offset in the ARM9 binary file
ARM_VALUES = []  # List to store ARM values read from the file

# List of track names
TRACKS = [
    "Unknown [Don't Change]", "Grand Prix Flyover", "Grand Prix Flyover (Unique)", "Wario Stadium Flyover", "Grand Prix Flyover (Unique)", "Battle Mode Flyover",
    "Boss Intro", "Figure-8 Circuit", "GCN Luigi Circuit", "GCN Yoshi Circuit", "Cheep Cheep Beach",
    "Yoshi Falls", "GCN Baby Park", "N64 Moo Moo Farm", "N64 Frappe Snowland", "Delfino Square",
    "Airship Fortress", "Wario Stadium", "GCN Mushroom Bridge", "Peach Gardens", "Luigi's Mansion",
    "SNES Mario Circuit 1", "SNES Koopa Beach 2", "SNES Donut Plains 1", "SNES Choco Island 2",
    "GBA Peach Circuit", "GBA Luigi Circuit", "Shroom Ridge", "N64 Choco Mountain", "N64 Banshee Boardwalk",
    "DK Pass", "Desert Hills", "Waluigi Pinball", "Tick-Tock Clock", "Mario Circuit", "Rainbow Road",
    "GBA Bowser Castle 2", "Bowser Castle", "GBA Sky Garden", "Battle Mode", "Boss Battle",
    "New Reward", "GP Results", "Credits (50cc + 100cc)", "Credits (150cc + Mirror)", "Wi-Fi Menu", "Multiplayer Menu", "Records Menu",
    "Options Menu", "Game Intro", "Singleplayer Menu", "Unknown [Don't Change]", "Mario Circuit [Doesn't Work]"
]

# Function to read binary file
def read_file(filename):
    try:
        with open(filename, 'rb') as file:  # Open the file in binary read mode
            return file.read()  # Read the content of the file
    except Exception as e:
        messagebox.showerror("Error", f"Failed to open file: {filename}\n\nError: {e}")  # Show error message if failed to open the file

# Function to open ARM9 binary file
def open_file():
    global ARM_VALUES, ARM9_BIN_PATH
    # Open file dialog to select the ARM9 binary file
    file_path = filedialog.askopenfilename(title="Select ARM9 Binary File", filetypes=(("Binary Files", "*.bin"), ("All Files", "*.*")))
    if file_path:
        ARM9_BIN_PATH = file_path
        # Check if the file is empty
        if os.path.getsize(ARM9_BIN_PATH) == 0:
            messagebox.showerror("Error", "This is not an arm9.bin file.")
            return
        # Read the content of the file
        file_content = read_file(ARM9_BIN_PATH)
        if file_content:
            # Extract ARM values from the file content
            ARM_VALUES = [int(byte) for byte in file_content[OFFSET:OFFSET + 211]]
            if not ARM_VALUES:
                messagebox.showerror("Error", "This is not an arm9.bin file.")
            else:
                refresh_listbox()  # Refresh the listbox with the track names

# Function to save modified file
def save_file(file_path=None):
    global ARM_VALUES, ARM9_BIN_PATH
    if not ARM9_BIN_PATH:
        messagebox.showerror("Error", "No file is opened to save.")
        return
    if file_path is None:
        file_path = ARM9_BIN_PATH
    try:
        # Read original content of the file
        with open(file_path, 'rb') as file:
            original_content = bytearray(file.read())
        # Update ARM values in the original content
        for i, value in enumerate(ARM_VALUES):
            original_content[OFFSET + i] = value
        # Write modified content back to the file
        with open(file_path, 'wb') as file:
            file.write(original_content)
        messagebox.showinfo("Success", "Modified file saved successfully")
    except Exception as e:
        messagebox.showerror("Error", f"Failed to save modified file: {str(e)}")

# Function to refresh listbox with track names and SEQ values
def refresh_listbox():
    listbox.delete(0, tk.END)  # Clear the listbox
    for i, track in enumerate(TRACKS):
        # Insert track name and corresponding SEQ value in the listbox
        listbox.insert(tk.END, f"{i}) {track} [{ARM_VALUES[i * 4]}]")

# Function to open popup window for changing SEQ value
def open_popup(selected_index):
    root.attributes("-disabled", True)  # Disable main window
    # Create popup window
    popup_window = tk.Toplevel(root)
    popup_window.title("Change SEQ Value")
    popup_window.geometry("300x180")
    popup_window.resizable(False, False)  # Make popup window unresizable
    popup_window.attributes("-topmost", True)  # Make popup window appear on top

    # Add favicon to the popup window
    if os.path.exists("icon.ico"):
        popup_window.iconbitmap("icon.ico")

    seq_label = tk.Label(popup_window, text="Enter new SEQ value:")
    seq_label.pack()
    seq_entry = tk.Entry(popup_window)
    seq_entry.pack()

    def change_seq_value():
        nonlocal popup_window
        track_name = TRACKS[selected_index]
        seq_index = selected_index * 4
        try:
            new_value = int(seq_entry.get())
            if -1 <= new_value <= 75:
                ARM_VALUES[seq_index] = new_value
                refresh_listbox()
                popup_window.destroy()  # Close the popup window
                root.attributes("-disabled", False)  # Enable main window
                messagebox.showinfo("Success", f"SEQ value for {track_name} changed to {new_value}")
            else:
                popup_window.destroy()  # Close the popup window
                root.attributes("-disabled", False)  # Enable main window
                messagebox.showerror("Error", "Invalid SEQ value. Value must be between -1 and 75.")
        except ValueError:
            popup_window.destroy()  # Close the popup window
            root.attributes("-disabled", False)  # Enable main window
            messagebox.showerror("Error", "Invalid SEQ value. Value must be between -1 and 75.")

    seq_button = tk.Button(popup_window, text="Change SEQ Value", command=change_seq_value)
    seq_button.pack()
    cancel_button = tk.Button(popup_window, text="Cancel", command=lambda: (popup_window.destroy(), root.attributes("-disabled", False)))
    cancel_button.pack()

    def close_popup_window():
        popup_window.destroy()
        root.attributes("-disabled", False)

    popup_window.protocol("WM_DELETE_WINDOW", close_popup_window)

    # Disable popup window when an error or success message pops up
    popup_window.transient(root)
    popup_window.grab_set()  # Grab focus and disable interactions with other windows

    popup_window.mainloop()  # Start popup window event loop


# Function to save file as a new file
def save_file_as():
    file_path = filedialog.asksaveasfilename(defaultextension=".bin", filetypes=(("Binary Files", "*.bin"), ("All Files", "*.*")))
    if file_path:
        save_file(file_path)

# Function to display help information
def open_help():
    messagebox.showinfo("Help",
                        "This program allows you to edit the music track SEQ IDs in the arm9.bin file of Mario Kart DS.\n\n"
                        "1. To get started, go to File > Open and select the arm9.bin file you want to edit.\n\n"
                        "2. Once the file is opened, click on a track in the list to change its SEQ ID.\n\n"
                        "3. After making changes, go to File > Save to save the modified file.\n\n"
                        "Original Code: Ermelber, Yami, MkDasher\n"
                        "Fixed and made into a Python GUI app by Landon & Emma")

# Function to open repository URL
def open_repository():
    webbrowser.open_new("https://github.com/LandonAndEmma/MKDS-ARM9-Music-Editor")

# Function to handle window closing event
def on_closing():
    if not ARM9_BIN_PATH or messagebox.askokcancel("Quit", "Do you want to quit?"):
        root.destroy()

# Create the main window
root = tk.Tk()
root.title("Mario Kart DS ARM9 Music Table Editor")  # Set window title
root.geometry("600x400")  # Set window size

root.iconbitmap("icon.ico")  # Set window icon

menubar = tk.Menu(root)  # Create menubar
file_menu = tk.Menu(menubar, tearoff=0)  # Create file menu
file_menu.add_command(label="Open", command=open_file)  # Add open file option to file menu
file_menu.add_command(label="Save", command=save_file)  # Add save file option to file menu
file_menu.add_command(label="Save As", command=save_file_as)  # Add save as option to file menu
menubar.add_cascade(label="File", menu=file_menu)  # Add file menu to menubar

help_menu = tk.Menu(menubar, tearoff=0)  # Create help menu
help_menu.add_command(label="Help", command=open_help)  # Add help option to help menu
help_menu.add_command(label="Repository", command=open_repository)  # Add repository option to help menu
menubar.add_cascade(label="Help", menu=help_menu)  # Add help menu to menubar

root.config(menu=menubar)  # Configure root window with menubar

main_frame = tk.Frame(root)  # Create main frame
main_frame.pack(fill=tk.BOTH, expand=True)  # Pack main frame to root window

label = tk.Label(main_frame, text="Select a track to change the SEQ value:")  # Create label
label.pack()  # Pack label to main frame

listbox = tk.Listbox(main_frame)  # Create listbox
listbox.pack(fill=tk.BOTH, expand=True)  # Pack listbox to main frame

# Bind listbox selection event to function
def on_listbox_select(event):
    selected_index = listbox.curselection()
    if selected_index:
        open_popup(selected_index[0])

listbox.bind("<<ListboxSelect>>", on_listbox_select)

root.protocol("WM_DELETE_WINDOW", on_closing)  # Bind window closing event to function
root.mainloop()  # Start GUI event loop
