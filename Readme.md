# Objective: 
	My goal with this project is to create a framework for a home automation system which can be expanded in any direction. 
For example, if you want your home automation system to interact with any script you write, this should be possible. This would 
allow for easy creation and implementation of home automation devices. 

## Functionality: 
	This project requires video and audio feed for [ Speaker recognition , Speech detection , command recognition , Action detection , Position classification ]  
The base functionality is what will be used to expand with. For example: using `Position Classification` and your own thermometer in each room, you could alter the 
thermostat to raise or lower the temperature in the room that you are in automatically. Using `Speaker Recognition` you could create locks that only YOU could open.
Perhaps this would be useful for trying to keep little ones out of the chemical cabinet. The possibilities are endless.

## Implementation: 
	Implementation should be simple and straight forward, I think the route I will be going down is as follows: 
The main program will constantly be monitoring the house, and when the system detects and action, phrase, ect, it logs it somewhere. In order to interface with the system there will be one main program monitoring the logs, and acting based on the changes.
For example: Somebody in the house says a command phrase, the main program will parse the audio and pass it through a NN and determine the output text, the output text will then be stored in the log file. The main monitoring program will read the file,
determine that changes were made, and attempt to determine then invoke the command. This means that multiple systems can interact with the same data, this could be potentially dangerous, so I think there should be some form of possible propagation prevention.
