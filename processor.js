// This file is required by index.html and will 
// execute the data processing.

const { remote } = require('electron');
const { dialog } = remote;
const fs = remote.require('fs');
const os = require('os');

const form = document.querySelector('form');

// This variable will be used to tell if the processing has begun
var processingHasStarted = false;

const inputs = {
    fileType: form.querySelector('select[name="fileType"]'),
    sourcePath: document.getElementById('sourcePath'),
    outputPath: document.getElementById('outputPath'),
    outputName: document.getElementById('outputName')
};

const buttons = {
    source: document.getElementById('sourcePathButton'),
    output: document.getElementById('outputPathButton'),
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

buttons.output.addEventListener('click', (event) =>
{
    event.preventDefault();
    const directory = dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    if (directory)
    {
        inputs.outputPath.value = directory;
    }
});

buttons.submit.addEventListener('click', (event) =>
{
    event.preventDefault();

    // Get rid of old alerts
    $('#alertDiv').html("");

    // Format the sourcePath to have a '\' at the end
    if (!inputs.sourcePath.value.endsWith('\\'))
        inputs.sourcePath.value = inputs.sourcePath.value + '\\';

    if (!inputs.outputPath.value.endsWith('\\'))
        inputs.outputPath.value = inputs.outputPath.value + '\\';

    fs.readdir(inputs.sourcePath.value, (err, files) =>
    {
        if (err)
        {
            // Get rid of old alert
            $('#alertDiv').html("");

            // Append new alert
            $('#alertDiv').append("<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error:</strong> <span id='errorMessage'></span><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div > ");

            // Add message
            var errorMessage = $('#errorMessage');
            errorMessage.html(" There was an error reading the source directory. Please check the path and try again.");

            // Scroll to error
            $('html, body').stop().animate({
                scrollTop: $('#alertDiv').offset().top
            }, 1000);

            return;
        }
        else
        {
            handleFiles(files, inputs.sourcePath.value, inputs.outputPath.value, inputs.outputName.value);
        }

    });
});

function handleFiles(files, sourcePath, outputPath, outputName)
{

    // The first file's header will be used as a template to check all following files.
    var header = getHeader(sourcePath + files[0]);

    for (var i = 0; i < files.length; i++)
    {
        var f = files[i];

        if (!header.match(getHeader(sourcePath + f))) // If there is a header mismatch then append that file name to the mismatch log.
        {
            console.log("File header mismatch between " + files[0] + " and " + f);
            appendMismatch(files[0], f, outputPath);
        }
        else // Otherwise the headers match so append the file data to the output file.
        {
            var data = removeHeader(sourcePath + f, header);
            try
            {
                appendFile(data, outputPath, header, outputName);
            } catch (e)
            {
                // Get rid of old alert
                $('#alertDiv').html("");

                // Append new alert
                $('#alertDiv').append("<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error:</strong> <span id='errorMessage'></span><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div > ");

                // Add message
                var errorMessage = $('#errorMessage');
                errorMessage.html(" Appending data failed. " + e);

                // Scroll to error
                $('html, body').stop().animate({
                    scrollTop: $('#alertDiv').offset().top
                }, 1000);
            }
        }
    }

    // The data outputting has been completed. Reset this flag.
    processingHasStarted = false;
}

// This function will append the passed file data to an output aggregated file.
function appendFile(data, path, header, outputName)
{
    var fileExists = true;

    // First check if the output file exists. If it doesn't then add the header to the first line.
    try
    {
        fs.accessSync(path + outputName + ".txt")
    } catch (err)
    {
        fileExists = false;
        fs.appendFileSync(path + outputName + ".txt", header + os.EOL, 'utf8');
    }

    // If the file already exists, but processing hasn't started, then the file already exists.
    if (fileExists && !processingHasStarted)
    {
        throw "The output file already exists!";
    }

    var didFail = false;

    // Now append the task data to the file.
    try
    {
        fs.appendFileSync(path + outputName + ".txt", data, 'utf8');
    } catch (err)
    {
        didFail = true;

        // Get rid of old alert
        $('#alertDiv').html("");

        // Append new alert
        $('#alertDiv').append("<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error:</strong> <span id='errorMessage'></span><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div > ");

        // Add message
        var errorMessage = $('#errorMessage');
        errorMessage.html(" Appending data failed. Please check your directory path and try again.");

        // Scroll to error
        $('html, body').stop().animate({
            scrollTop: $('#alertDiv').offset().top
        }, 1000);
    }

    // If the data was appending successfuly and the processing hadn't started, it has now.
    if (!didFail && !processingHasStarted)
    {
        processingHasStarted = true;
    }
}

// This function will create a text file which will have the file header mismatches
function appendMismatch(file1, file2, path)
{
    var data = "File header mismatch between " + file1 + " and " + file2 + os.EOL;

    try
    {
        fs.appendFileSync(path + "headerMismatch.txt", data, 'utf8');

        // Get rid of old alert
        $('#mismatchDiv').html("");

        // Append new alert
        $('#mismatchDiv').append("<div class='alert alert-warning alert-dismissible fade show' role='alert'><strong>Warning:</strong> <span id='mismatchMessage'></span><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div > ");

        // Add message
        var mismatchMessage = $('#mismatchMessage');
        mismatchMessage.html("There was at least one file with a mismatched header. A mismatch log was created in the output directory.");

        // Scroll to error
        $('html, body').stop().animate({
            scrollTop: $('#alertDiv').offset().top
        }, 1000);
    } catch (err)
    {
        // Get rid of old alert
        $('#alertDiv').html("");

        // Append new alert
        $('#alertDiv').append("<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error:</strong> <span id='errorMessage'></span><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div > ");

        // Add message
        var errorMessage = $('#errorMessage');
        errorMessage.html(" Appending mismatched files failed. Please check your directory path and try again.");

        // Scroll to error
        $('html, body').stop().animate({
            scrollTop: $('#alertDiv').offset().top
        }, 1000);
    }
}

// This function will return a file's data without the header and any headers within the file (from repeated plays)
function removeHeader(filePath, header)
{
    var data = fs.readFileSync(filePath, 'utf8');
    var regex = new RegExp(header, "g");
    data = data.replace(regex, ''); // Get rid of headers throughout the file
    data = data.replace(/^\s*/gm, ''); // Get rid of the dangling newlines after removing the headers
    return data.substring(data);
}

// This function will return the files header.
function getHeader(filePath)
{
    var data;
    var header;

    try
    {
        data = fs.readFileSync(filePath, 'utf8');
        header = data.substring(0, data.indexOf('\n')).trim();
    } catch (err)
    {
        // Get rid of old alert
        $('#alertDiv').html("");

        // Append new alert
        $('#alertDiv').append("<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error:</strong> <span id='errorMessage'></span><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div > ");

        // Add message
        var errorMessage = $('#errorMessage');
        errorMessage.html(" Accessing the source file failed. Please check your directory path and try again.");

        // Scroll to error
        $('html, body').stop().animate({
            scrollTop: $('#alertDiv').offset().top
        }, 1000);
        return;
    }
    return header;
}