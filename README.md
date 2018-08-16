# ProcessData 
### Author: Ben Harder, 2018

## Description

This application will combine a directory of comma delimited data. The combined data can be found in the specified output directory. The program was designed to not accept **mismatched headers** and so a file documenting which files were mismatched, if there were any, will also be created in the output directory.

## Instructions
1. Launch the application.
2. Enter a source path.
3. Enter an output path.
4. Enter an output file name.
5. Click 'process'.
6. Open Excel.
7. Open the insert data dialog.
8. Navigate to the directory you specified as the output path and select the output file.
9. Insert the data.

## Technical Information

### Info
The program was written using [Electron](https://electronjs.org/), a desktop application framework. It uses Node.js and is written in HTML, JavaScript, and CSS.

### Making Changes
If the program requires modifications, the developer will need [Node.js](https://nodejs.org/en/) installed. After installation, changes to the program's source code can be tested by executing the shell command 'npm start' in the projects directory. To create a new executable which contains these changes, execute the command 'npm run package-win'. The new executable will be located within the 'release-builds' folder. 

### Program Description
The program's main content is within three files. 'main.js' is the programs starting point; it creates and sets up the window as well as handles window events. 'index.html' contains all the HTML code that makes up the page's visual elements. 'processor.js' contains all the working code for the program's functionality.
