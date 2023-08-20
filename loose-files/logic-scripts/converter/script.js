
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
          
            coreURL: "/assets/core/ffmpeg-core.js",
        
        });

      }   

      
}


const processVideo = async (inputFilename, outputFileName, videoFile ) => {

    await ffmpeg.writeFile(inputFilename, await fetchFile(videoFile));  //await fetchFile(files[0]) was used as 2nd arg
    message.innerHTML = 'Start transcoding';

    await ffmpeg.exec(['-i', inputFilename,  outputFileName]);

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
    const outputFileType = outputFormat.value;
    const outputFileName = `${outputName.value}.${outputFileType}`;


    // console.log(inputFilename)
    // console.log(outputFileName)


 
    await initialize_Ffmpeg();

    await processVideo(inputFilename, outputFileName, videoFile)

     generateOutput( outputFileName, outputFileType )




});



    

