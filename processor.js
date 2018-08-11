// This file is required by index.html and will 
// execute the data processing.

const { remote } = require('electron');
const { dialog } = remote;
const fs = remote.require('fs');

const form = document.querySelector('form');

const inputs = {
    fileType: form.querySelector('select[name="fileType"]'),
    sourcePath: document.getElementById('sourcePath')
};

const buttons = {
    source: document.getElementById('sourcePathButton'),
    submit: document.getElementById('submit')
};

buttons.source.addEventListener('click', (event) =>
{
    event.preventDefault();
    const directory = dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    if (directory)
    {
        inputs.sourcePath.value = directory;
    }
});

buttons.submit.addEventListener('click', (event) =>
{
    event.preventDefault();

    // Format the sourcePath to have a '\' at the end
    if (!inputs.sourcePath.value.endsWith('\\'))
        inputs.sourcePath.value = inputs.sourcePath.value + '\\';

    fs.readdir(inputs.sourcePath.value, (err, files) =>
    {
        handleFiles(files, inputs.sourcePath.value);
    });
});

function handleFiles(files, sourcePath)
{

    // The first file's header will be used as a template to check all following files.
    var header = getHeader(sourcePath + files[0]);

    for (var i = 0; i < files.length; i++)
    {
        var f = files[i];

        if (!header.match(getHeader(sourcePath + f)))
        {
            console.log("File header mismatch between " + files[0] + " and " + f);
            appendMismatch(files[0], f, sourcePath);
        }
        else 
        {
            var data = removeHeader(sourcePath + f);
            appendFile(data, sourcePath);
        }
    }
}

// This function will append the passed file data to an output aggregated file.
function appendFile(data, sourcePath)
{
    try
    {
        fs.appendFileSync(sourcePath + "aggregatedData.txt", data, 'utf8');
    } catch (err)
    {
        // Get rid of old alert
        $('#alertDiv').html("");

        // Append new alert
        $('#alertDiv').append("<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error:</strong> <span id='errorMessage'></span><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div > ");

        // Add message
        var errorMessage = $('#errorMessage');
        errorMessage.html(" appending data failed. Please check your directory path and try again.");
    }
}

// This function will create a text file which will have the file header mismatches
function appendMismatch(file1, file2, sourcePath)
{
    var data = "File header mismatch between " + file1 + " and " + file2 + '\n';

    try
    {
        fs.appendFileSync(sourcePath + "headerMismatch.txt", data, 'utf8');
        // Get rid of old alert
        $('#mismatchDiv').html("");

        // Append new alert
        $('#mismatchDiv').append("<div class='alert alert-warning alert-dismissible fade show' role='alert'><strong>Warning:</strong> <span id='mismatchMessage'></span><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div > ");

        // Add message
        var mismatchMessage = $('#mismatchMessage');
        mismatchMessage.html("There was at least one file with a mismatched header. Check <a href='" + sourcePath + "'headerMismatch.txt' class='alert-link'>this</a> file to view.");
    } catch (err)
    {
        // Get rid of old alert
        $('#alertDiv').html("");

        // Append new alert
        $('#alertDiv').append("<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error:</strong> <span id='errorMessage'></span><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div > ");

        // Add message
        var errorMessage = $('#errorMessage');
        errorMessage.html(" appending mismatched files failed. Please check your directory path and try again.");
    }
}

// This function will return a file's data without the header
function removeHeader(filePath)
{
    var data = fs.readFileSync(filePath, 'utf8');
    return data.substring(data.indexOf('\n') + 1);
}

// This function will return the files header.
function getHeader(filePath)
{
    var data = fs.readFileSync(filePath, 'utf8');
    var header = data.substring(0, data.indexOf('\n')).trim();
    return header;
}