# ProcessData
This application will combine a directory of comma delimited data.

* How can the subject ID be assertained if the data file names aren't all the same format?
* How does the original program do it?

    It seems to assume the name is made of two sections, the game name with response time, and the subject ID. The subject ID being at the     end of the file name. I assume the program just says the subject ID is whatever text comes after the last underscore character and         everything before it is the experiment name.
