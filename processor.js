// This file is required by index.html and will 
// execute the data processing.

const { ipcRenderer, remote } = require('electron');

const { dialog } = remote;

const form = document.querySelector('form');

const inputs = {
    fileType: form.querySelector('select[name="fileType"]'),
    sourcePath: document.getElementById('sourcePath')
};

const buttons = {
    source: document.getElementById('sourcePathButton'),
    submit: form.querySelector('button[type="submit"]')
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