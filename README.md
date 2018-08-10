# ProcessData
This application will combine a directory of comma delimited data.

* How can the subject ID be assertained if the data file names aren't all the same format?

    This could be fixed by using a drop down menu to indicate what file name format the data files are in. Once the different types of         files are all run through the processor using their respective file name formats the program can be run again using a single setting.
    
* How does the original program do it?

    It seems to assume the name is made of two sections, the game name with response time, and the subject ID. The subject ID being at the     end of the file name. I assume the program just says the subject ID is whatever text comes after the last underscore character and         everything before it is the experiment name.

* Do the different trials need to be differentiated from each other by more than subject IDs?

    If this was true then the IP field would be added to the output, aggregated, file. However, only the newer web tasks have an IP.
    
* How to aggregate files?

    Check the first data file for a header format and use it as a template. Then go through the files and if their headeers match the format then append them to an output data file.
    
* What should the program do if it encounters a different header format?

    Provide a message on which files had a different header and ignore the second file.
