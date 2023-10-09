
import { FFmpeg } from "/assets/ffmpeg/index.js";
import { fetchFile } from "/assets/utils/index.js";
let ffmpeg = null;
let previousProcessedVideoUrl;
let previousProcessedVideoUrl2;
let isMultiThreaded = false;

// Get DOM elements
const videoInput = document.getElementById('videoInput');
const outputName = document.getElementById('outputName');
// const outputFormat = document.getElementById('outputFormat');
const convertButton = document.getElementById('convertButton');
const downloadLink = document.getElementById('downloadLink');


const mode = document.getElementById('mode').textContent ;



//defining functions


//ffmpeg initialization


const initialize_Ffmpeg = async () => {
    if (ffmpeg === null) {

        ffmpeg = new FFmpeg();
        ffmpeg.on("log", ({ message }) => {
          
            console.log(message);
        
        })
        if(mode==='merge'){
            ffmpeg.on("progress", ({ progress, time }) => {
                message.innerHTML = `${time / 1000000} s`;
                  });
        }
        else{
        ffmpeg.on("progress", ({ progress }) => {
          
            message.innerHTML = `${progress * 100} %`;
        
        });
    }
        // await ffmpeg.load({
          
        //     //single threading
        //     coreURL: "/assets/core/ffmpeg-core.js",

        //     //multithreading - uncomment and run nodemon server
        //     // coreURL: "/assets/multi-thread/ffmpeg-core.js",
        //     // wasmURL: '/assets/multi-thread/ffmpeg-core.wasm',
        //     // workerURL: '/assets/multi-thread/ffmpeg-core.worker.js'
        
        // });

        if (isMultiThreaded) {
            await loadMultiThreadFiles();
        } else {
            await loadSingleThreadFiles();
        }

      }   

      
}

// Function to split command string into an array while considering spaces within quotes
function parseCommandString(commandString) {
    const args = [];
    let currentArg = '';
    let inQuotes = false;

    for (let i = 0; i < commandString.length; i++) {
        const char = commandString.charAt(i);

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ' ' && !inQuotes) {
            if (currentArg) {
                args.push(currentArg);
                currentArg = '';
            }
        } else {
            currentArg += char;
        }
    }

    if (currentArg) {
        args.push(currentArg);
    } 

    return args;
}

const getCommands = (inputObject, mode)=> {

    const editoptions={
        conversion: `-i "${inputObject.inputFileName}" "${inputObject.outputFileName}"`,
        //trim: `-ss ${inputObject.start.time} -i "${inputObject.inputFileName}" -to ${inputObject.end.time}  "${inputObject.outputFileName}"`,
        trim: `-ss "${inputObject.start.time}" -i "${inputObject.inputFileName}" -ss "${inputObject.start.time}" -i "${inputObject.inputFileName}" -t ${inputObject.end.time} -map 0:v -map 1:a -c:v copy -c:a copy "${inputObject.outputFileName}"`, 
        merge: `-f concat -safe 0 -i concat_list.txt "${inputObject.outputFileName}"`,
        split: `-i "${inputObject.inputFileName}" -t ${inputObject.start.time} -c:v copy -c:a copy "${inputObject.outputFileName}" -ss ${inputObject.start.time} -c:v copy -c:a copy "${inputObject.outputFileName2}"`,
        resize:`-i "${inputObject.inputFileName}" -vf "scale=${inputObject.size},setsar=1:1" ${inputObject.outputFileName}`,
        removeaudio:`-i "${inputObject.inputFileName}" -an ${inputObject.outputFileName}`,
        crop:`-i "${inputObject.inputFileName}" -vf crop=${inputObject.dimension} ${inputObject.outputFileName}`,
        getaudio: `-i "${inputObject.inputFileName}" "${inputObject.outputFileName}"`,
        textoverlay:`-i ${inputObject.inputFileName} -vf drawtext=${drawtext} -codec:a copy ${inputObject.outputFileName}`
    }


    return editoptions[mode]
}

//['-f', 'concat', '-safe', '0', '-i', 'concat_list.txt', 'output.mp4']
// `ffmpeg -ss ${inputObject.start.time} -i ${inputObject.inputFileName} -t ${inputObject.end.time} -c ${inputObject.outputFileName}`
// 


const processVideo = async (inputObject, mode ) => {


    switch (mode) {
        case 'conversion' :
        case 'trim':
        case 'split':
        case 'removeaudio':
        case 'resize':
        case 'crop':
        case 'getaudio':
        case 'textoverlay':

                console.log(inputObject.inputFileName)
                console.log(inputObject.videoFile.name)
                    
                await ffmpeg.writeFile(inputObject.inputFileName, await fetchFile(inputObject.videoFile));  //await fetchFile(files[0]) was used as 2nd arg


            break;
    
        
        case 'merge':

                console.log("Start Concating");

                const inputPaths = [];
                for (const file of inputObject.videoFile) {
                const { name } = file;
                ffmpeg.writeFile(name, await fetchFile(file));
                inputPaths.push(`file ${name}`);
                }
                console.log(inputPaths)
                await ffmpeg.writeFile('concat_list.txt', inputPaths.join('\n'));
                    break;
        
        default:

                console.log("path not found")
            break;
    }
   
    message.innerHTML = 'Start transcoding';

  

    const command = await getCommands(inputObject, mode);
    const commandArray = parseCommandString(command);
    console.log(commandArray)
    console.log(commandArray)

    await ffmpeg.exec(commandArray);


    
    message.innerHTML = 'transcoding completed';


}

const generateOutput = async (inputObject ) => {

    const data = await ffmpeg.readFile( inputObject.outputFileName )
    const video = document.getElementById('output-video'); //========

    const mimeType = `video/${inputObject.outputFileType}`;
    const processedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: mimeType }));
    video.src = processedVideoUrl

    // Revoke the previous processed video URL to release memory - to prevent memory leaks
    if (previousProcessedVideoUrl) {
        URL.revokeObjectURL(previousProcessedVideoUrl);
    }
    previousProcessedVideoUrl = processedVideoUrl; // Store the current URL for future revocation    

    downloadLink.href = processedVideoUrl;
    downloadLink.download = inputObject.outputFileName;
    downloadLink.style.display = "block";


    if(mode === 'split'){

        console.log("i am inside split")

        const data2 = await ffmpeg.readFile(inputObject.outputFileName2);
        const processedVideoUrl2 = URL.createObjectURL(new Blob([data2.buffer], { type: mimeType }));

        if (previousProcessedVideoUrl2) {
            URL.revokeObjectURL(previousProcessedVideoUrl2);
        }
        previousProcessedVideoUrl2 = processedVideoUrl2; // Store the current URL for future revocation 

        var downloadLink2 = document.getElementById('downloadLink2');

        downloadLink2.href = processedVideoUrl2;
        downloadLink2.download = inputObject.outputFileName2;
        downloadLink2.style.display = "block";

    }
}



//subtract start and end time to find duration

function calculateDuration(startTime, endTime) {
    const startParts = startTime.split(':').map(Number);
    const endParts = endTime.split(':').map(Number);
  
    // Calculate the total seconds for start and end times
    const startSeconds = startParts[0] * 3600 + startParts[1] * 60 + startParts[2];
    const endSeconds = endParts[0] * 3600 + endParts[1] * 60 + endParts[2];
  
    // Calculate the duration in seconds
    const durationSeconds = endSeconds - startSeconds;
  
    // Convert the duration back to hours, minutes, and seconds
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  


// Function to load multi-threading files
async function loadMultiThreadFiles() {

    console.log("multithreading engaged")


    await ffmpeg.load({
        coreURL: "/assets/multi-thread/ffmpeg-core.js",
        wasmURL: '/assets/multi-thread/ffmpeg-core.wasm',
        workerURL: '/assets/multi-thread/ffmpeg-core.worker.js'
    });
}

// Function to load single-threading files
async function loadSingleThreadFiles() {

    console.log("singlethreading engaged")

    await ffmpeg.load({
        coreURL: "/assets/core/ffmpeg-core.js"
    });
}







// Function to toggle between single-threaded and multi-threaded modes
async function toggleMode() {
    isMultiThreaded = !isMultiThreaded; // Toggle the mode
    
    if (isMultiThreaded) {
        // Load multi-threading files
        await loadMultiThreadFiles();
    } else {
        // Load single-threading files
        await loadSingleThreadFiles();
    }
}




/***************************** Driver and main codes start from here ************************** */


//loading ffmpeg first

console.log("loading ffmpeg")
 
await initialize_Ffmpeg();


//event handler for conversion 

convertButton.addEventListener('click', async () => {
    if (!videoInput.files.length || !outputName.value) {
        alert('Please select a video and provide an output name.');
        return;
    }






    const message = document.getElementById('message'); 
    // const videoFile = videoInput.files[0];
    // const inputFilename = videoFile.name;
    // var outputFileType ="";
    var inputObject = {

            videoFile: videoInput.files[0],
            inputFileName:'',
            outputFileN: document.getElementById('outputName').value,
            outputFileType: '',
            outputFileName: '',
            outputFileName2: '',
            start: {
                hour: 0,
                minute: 0,
                second: 0
            },
            end : {
                hour: 0,
                minute: 0,
                second: 0
            },
            duration:'',
            size:'',
            dimension:'',
            audioinput:'',
            drawtext:''
    }

    

    
    console.log("before switch for input mode")

    switch(mode)
    {
        case 'conversion':

                inputObject.outputFileType = document.getElementById('outputFormat').value;
                inputObject.inputFileName = inputObject.videoFile.name;
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;


            break;
        
        case 'trim':

                inputObject.inputFileName = inputObject.videoFile.name;
                inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;
                inputObject.start = {
                    hour: document.getElementById('start_hour').value,
                    minute: document.getElementById('start_minute').value,
                    second: document.getElementById('start_second').value,
                }
                inputObject.end = {
                    hour: document.getElementById('end_hour').value,
                    minute: document.getElementById('end_minute').value,
                    second: document.getElementById('end_second').value,
                }

                inputObject.start.time = `${inputObject.start.hour}:${inputObject.start.minute}:${inputObject.start.second}`;
                inputObject.end.time = `${inputObject.start.hour}:${inputObject.end.minute}:${inputObject.end.second}`;

                console.log(`Duration: ${inputObject.end.time}`)
                console.log(`Duration: ${inputObject.start.time}`)

                //store duration in end.time itself
                inputObject.end.time = calculateDuration(inputObject.start.time, inputObject.end.time); 
                console.log(`Duration: ${inputObject.end.time}`);

            break;


        case 'merge':
                console.log("merging - input");


                inputObject.videoFile = videoInput.files;
                console.log(inputObject.videoFile)
                inputObject.inputFileName = inputObject.videoFile[0].name;
                inputObject.outputFileType = document.getElementById('outputFormat').value;
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;

                const inputType = inputObject.inputFileName.split('.').pop();
                for( var type of inputObject.videoFile){

                    if(type.name.split('.').pop() != inputType){
                        alert("input files must be of the same type")
                        return
                    }
                }

            break;


        case 'split':

                // update the below code for the new dependencies:
                // inputFileName, outputFileName, outputFileName2, duration
                // also remove getting outputFileType from User , use  something similar to what we used in trim
                
                // add  2 output name fields, 2 download links in split .html

                inputObject.inputFileName = inputObject.videoFile.name;
                inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
                
                inputObject.outputFileName = `${inputObject.outputFileN}p1.${inputObject.outputFileType}`;
                inputObject.outputFileName2 = `${inputObject.outputFileN}p2.${inputObject.outputFileType}`;
                //duration
                inputObject.start = {
                    hour: document.getElementById('start_hour').value,
                    minute: document.getElementById('start_minute').value,
                    second: document.getElementById('start_second').value,
                } 

                inputObject.start.time = `${inputObject.start.hour}:${inputObject.start.minute}:${inputObject.start.second}`;

            break;

        
        case 'resize':

            inputObject.inputFileName = inputObject.videoFile.name;
            inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
            
            inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;

            inputObject.size = document.getElementById('dimension').value;

            break;

        case 'removeaudio':

            inputObject.inputFileName = inputObject.videoFile.name;
            inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
        
            inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;


        break;


        case 'crop':
            
            inputObject.inputFileName = inputObject.videoFile.name;
            inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
            inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;
            
            inputObject.dimension=`${document.getElementById('width').value}:${document.getElementById('height').value}:${document.getElementById('x').value}:${document.getElementById('y').value}`;
            console.log(inputObject.dimension)
            
            break;

        case 'getaudio':

            inputObject.outputFileType = document.getElementById('outputFormat').value;
            inputObject.inputFileName = inputObject.videoFile.name;
            inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;


            break;

        case 'textoverlay':
            inputObject.inputFileName = inputObject.videoFile.name;
            inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
            inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;
        
            inputObject.drawtext=`text='${document.getElementById('text').value}':x=${document.getElementById('x').value}:y=${document.getElementById('y').value}:fontsize=${document.getElementById('fontsize').value}`;
            console.log(` The created drawtext ${inputObject.drawtext}`)
            
            break;
        


        default:

                console.log("path not found")
            
            
            break;
    }

    console.log("2")

    await processVideo(inputObject, mode);
    console.log("3")

     generateOutput( inputObject );
     console.log("4")

});

// Add an event listener to the toggle button
const toggleModeButton = document.getElementById('toggleModeButton');
toggleModeButton.addEventListener('click', toggleMode);