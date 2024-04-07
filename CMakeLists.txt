cmake_minimum_required(VERSION 3.13)  # CMake version check
project(arm9_music_editor)               # Create project "arm9_music_editor"
set(CMAKE_CXX_STANDARD 14)            # Enable c++14 standard

# Add main.cpp file of the project root directory as a source file
set(SOURCE_FILES music_table_editor.cpp)

# Add executable target with source files listed in SOURCE_FILES variable
add_executable(arm9_music_editor ${SOURCE_FILES})
