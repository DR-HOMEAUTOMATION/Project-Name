# Objective: 
The focus of this project is around home automation systems. I am trying to build a robust framework for developers to create they're own custom solutions with an arbitrarily complex design while also maintaining expanability and isolated systems.

## Implementation: 
Implemtation of a given system would be simple: 
1. fetch the data the system needs (ex: mic audio)
2. interpret the data (something like command recognition) 
3. fetch more data if necessary 
4. execute based on interpretation of the data (includes sending data to output devices) (send current weather to speaker)

## Hosting devices & interpreters 
- Inputs & Ouputs should be hosted on their own servers such that whenever you need a peice of data you can make a simple GET/POST request and use the response in a later step. 
- Interpreters should also be hosted on a server so that after you get the data there is a specifed enpoint for processing it, this allows for cloud hosted interpreters for systems that cant process the data due to hardware limitations.
