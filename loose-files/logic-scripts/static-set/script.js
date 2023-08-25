
import { FFmpeg } from "/assets/ffmpeg/index.js";
import { fetchFile } from "/assets/utils/index.js";
let ffmpeg = null;
let previousProcessedVideoUrl;

// Get DOM elements
const videoInput = document.getElementById('videoInput');
const outputName = document.getElementById('outputName');
const outputFormat = document.getElementById('outputFormat');
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


const processVideo = async (inputFilename, outputFileName, videoFile ) => {

    await ffmpeg.writeFile(inputFilename, await fetchFile(videoFile));  //await fetchFile(files[0]) was used as 2nd arg
    message.innerHTML = 'Start transcoding';

    await ffmpeg.exec(['-i', inputFilename,  outputFileName]);


    // ffmpeg -i input.mp4 -ss [start_time] -to [end_time] -c:v copy -c:a copy output.mp4
    // ffmpeg -i input.mp4 -ss 00:30 -to 02:00 -c:v copy -c:a copy output.mp4


    // const arg = `-i ${inputFilename} -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus ${outputFileName}`.split(" ");
    // console.log(arg)
    // await ffmpeg.exec(arg);
    
    message.innerHTML = 'transcoding completed';


}

const generateOutput = async (outputFileName, outputFileType ) => {

    const data = await ffmpeg.readFile( outputFileName )
    const video = document.getElementById('output-video'); //========

    const mimeType = `video/${outputFileType}`;
    const processedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: mimeType }));
    video.src = processedVideoUrl

    // Revoke the previous processed video URL to release memory - to prevent memory leaks
    if (previousProcessedVideoUrl) {
        URL.revokeObjectURL(previousProcessedVideoUrl);
    }
    previousProcessedVideoUrl = processedVideoUrl; // Store the current URL for future revocation    

    downloadLink.href = processedVideoUrl;
    downloadLink.download = outputFileName;
    downloadLink.style.display = "block";
}


//event handler for conversion 

convertButton.addEventListener('click', async () => {
    if (!videoInput.files.length || !outputName.value) {
        alert('Please select a video and provide an output name.');
        return;
    }






    const message = document.getElementById('message'); 
    const videoFile = videoInput.files[0];
    const inputFilename = videoFile.name;
    var outputFileType ="";
    var fileTime = {}

    // fileTime = {
    //     start : {
    //         hour: document.getElementById('start_hour').value,
    //         minute: document.getElementById('start_minute').value,
    //         second: document.getElementById('start_second').value
    //     },
    //     end : {
    //         hour: document.getElementById('end_hour').value,
    //         minute: document.getElementById('end_minute').value,
    //         second: document.getElementById('end_second').value
    //     } 
    // }




    // used this to provide default output format as that of input for
    //situations which doesnt require users to specify format -should use switch in future
    if(outputFormat){
        outputFileType = outputFormat.value; 
    }
    else{
        outputFileType = videoInput.files[0].name.split('.').pop();
        console.log(outputFileType)
    }
    const outputFileName = `${outputName.value}.${outputFileType}`;

    
    


    // console.log(inputFilename)
    // console.log(outputFileName)


 
    await initialize_Ffmpeg();

    await processVideo(inputFilename, outputFileName, videoFile)

     generateOutput( outputFileName, outputFileType )




});



    

