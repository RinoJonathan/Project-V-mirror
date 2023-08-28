
import { FFmpeg } from "/assets/ffmpeg/index.js";
import { fetchFile } from "/assets/utils/index.js";
let ffmpeg = null;
let previousProcessedVideoUrl;

// Get DOM elements
const videoInput = document.getElementById('videoInput');
const outputName = document.getElementById('outputName');
// const outputFormat = document.getElementById('outputFormat');
const convertButton = document.getElementById('convertButton');
const downloadLink = document.getElementById('downloadLink');


const mode = document.getElementById('mode').textContent ;



//defining functions
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
        await ffmpeg.load({
          
            //single threading
            coreURL: "/assets/core/ffmpeg-core.js",

            //multithreading - uncomment and run nodemon server
            // coreURL: "/assets/multi-thread/ffmpeg-core.js",
            // wasmURL: '/assets/multi-thread/ffmpeg-core.wasm',
            // workerURL: '/assets/multi-thread/ffmpeg-core.worker.js'
        
        });

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
        trim: `-ss ${inputObject.start.time} -i "${inputObject.inputFileName}" -to ${inputObject.end.time}  "${inputObject.outputFileName}"`,
        merge: `-f concat -safe 0 -i concat_list.txt "${inputObject.outputFileName}"`,
        split: ``
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
}


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
            start: '',
            end : '',
            duration:''
    }

    

    console.log("0")

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

                inputObject.start.time = `${inputObject.start.minute}:${inputObject.start.second}`;
                inputObject.end.time = `${inputObject.end.minute}:${inputObject.end.second}`;


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

        default:

                console.log("path not found")
            
            
            break;
    }


    console.log("1")
 
    await initialize_Ffmpeg();
    console.log("2")

    await processVideo(inputObject, mode);
    console.log("3")

     generateOutput( inputObject );
     console.log("4")




});
