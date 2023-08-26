
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
        ffmpeg.on("progress", ({ progress }) => {
          
            message.innerHTML = `${progress * 100} %`;
        
        });
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


const getCommands = (inputObject, mode)=> {

    const editoptions={
        conversion: `-i ${inputObject.inputFilename} ${inputObject.outputFileName}`,
        trim: `-i ${inputObject.inputFileName} -ss 0 -to 1 ${inputObject.outputFileName}`,
        merge: ``,
        split: ``
    }

    return editoptions[mode]
}

// `ffmpeg -ss ${inputObject.} -i ${inputObject.inputFileName} -t  -c ${inputObject.outputFileName}`
// 


const processVideo = async (inputObject, mode ) => {


    switch (mode) {
        case 'conversion':
            
        await ffmpeg.writeFile(inputObject.inputFilename, await fetchFile(inputObject.videoFile));  //await fetchFile(files[0]) was used as 2nd arg


            break;
    

        
        default:

        document.write("invalid  mode")
            break;
    }
   
    message.innerHTML = 'Start transcoding';

  

    const command = getCommands(inputObject.inputFilename, inputObject.outputFileName, mode).split(" ");

    await ffmpeg.exec(command);

    // const arg = `-i ${inputFilename} -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus ${outputFileName}`.split(" ");
    // console.log(arg)
    // await ffmpeg.exec(arg);
    
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
    var inputObject = {}

    



    switch(Option)
    {
        case 'conversion':
            
            inputObject = {

                videoFile: videoInput.files[0],
                inputFilename: inputObject.videoFile.name ,
                outputFileN: document.getElementById('outputName').value,
                outputFileType: document.getElementById('outputFormat').value,
                outputFileName: `${inputObject.outputFileN}.${inputObject.outputFileType}`

            }


            break;
        
        case 'trim':
            
        
        inputObject = {
            
            videoFile: videoInput.files[0],
            inputFilename: inputObject.videoFile.name ,
            outputFileName: document.getElementById('outputName').value,
            outputFileType: inputObject.inputFilename.split('.').pop(),
            outputfile: `${inputObject.outputFileN}.${inputObject.outputFileType}`,

            start : {
                hour: document.getElementById('start_hour').value,
                minute: document.getElementById('start_minute').value,
                second: document.getElementById('start_second').value,
                time: `${inputObject.start.hour}:${inputObject.start.minute}:${inputObject.start.second}`
            },
            end : {
                hour: document.getElementById('end_hour').value,
                minute: document.getElementById('end_minute').value,
                second: document.getElementById('end_second').value,
                time: `${inputObject.end.hour}:${inputObject.end.minute}:${inputObject.end.second}`
            },
             
        }
            break;

        default:

        document.write("invalid mode ")
            break;
    }


    //
    // used this to provide default output format as that of input for
    //situations which doesnt require users to specify format -should use switch in future
    // if(outputFormat){
    //     outputFileType = outputFormat.value; 
    // }
    // else{
    //     outputFileType = videoInput.files[0].name.split('.').pop();
    //     console.log(outputFileType)
    // }
    // const outputFileName = `${outputName.value}.${outputFileType}`;

    
    


    // console.log(inputFilename)
    // console.log(outputFileName)


 
    await initialize_Ffmpeg();

    await processVideo(inputObject, mode);

     generateOutput( inputObject );




});



    

// const inputObjec = {
            
//     videoFile: videoInput.files[0],
//     inputFilename: inputObjec.videoFile.name ,
//     outputFileName: document.getElementById('outputName').value,
//     outputFileType: inputObjec.inputFilename.split('.').pop(),
//     outputfile: `${inputObjec.outputFileN}.${inputObjec.outputFileType}`,

//     start : {
//         hour: document.getElementById('start_hour').value,
//         minute: document.getElementById('start_minute').value,
//         second: document.getElementById('start_second').value,
//         time: `${inputObjec.start.hour}:${inputObjec.start.minute}:${inputObjec.start.second}`
//     },
//     end : {
//         hour: document.getElementById('end_hour').value,
//         minute: document.getElementById('end_minute').value,
//         second: document.getElementById('end_second').value,
//         time: `${inputObjec.end.hour}:${inputObjec.end.minute}:${inputObjec.end.second}`
//     },
     
// }