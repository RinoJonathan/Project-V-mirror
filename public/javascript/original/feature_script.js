
/**
 * FFmpegManager deals with all actions associated with using ffmpeg.wasm
 * 
 * 1. initLoad 
 * 2. getPathObject 
 * 3. initializeFfmpeg
 * 4. loadMultiThreadFiles
 * 5. loadSingleThreadFiles
 * 6. parseCommandString
 * 7. getCommands
 * 8. processVideo
 * 9. generateOutput
 */
export class FFmpegManager {
    constructor(envMode) {
        this.envMode = envMode;
        this.ffmpeg = null;
        this.isMultiThreaded = false;
        this.previousProcessedVideoUrl = null;
        this.previousProcessedVideoUrl2 = null;
        this.message = document.getElementById('message');
    }

    //loads modules of ffmpeg based on result from getPathObject function/method
    async initLoad() {
        let pathObject = this.getPathObject();

        const {
            FFmpeg: ffmpegModule
        } = await import(pathObject.ffmpeg);
        const {
            fetchFile: fetchFileModule
        } = await import(pathObject.utils);

        this.FFmpeg = ffmpegModule;
        this.fetchFile = fetchFileModule;

        await this.initializeFfmpeg();
    }


    // dynamically select url's path based on env mode 
    getPathObject() {
        const paths = {
            production: {
                ffmpeg: "/javascript/ffmpeg/ffmpeg/index.js",
                utils: "https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/esm/index.min.js",
                mtCore: "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.4/dist/esm/ffmpeg-core.js",
                mtWasm: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.4/dist/esm/ffmpeg-core.wasm',
                mtWorker: '/javascript/ffmpeg/multi-thread/ffmpeg-core.worker.js',
                stCore: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/esm/ffmpeg-core.js",
            },
            development: {
                ffmpeg: "/javascript/ffmpeg/ffmpeg/index.js",
                utils: "/javascript/ffmpeg/utils/index.js",
                mtCore: "/javascript/ffmpeg/multi-thread/ffmpeg-core.js",
                mtWasm: '/javascript/ffmpeg/multi-thread/ffmpeg-core.wasm',
                mtWorker: '/javascript/ffmpeg/multi-thread/ffmpeg-core.worker.js',
                stCore: "/javascript/ffmpeg/core/ffmpeg-core.js",
            }
        };

        return paths[this.envMode];
    }

    //initializes ffmpeg instance
    async initializeFfmpeg() {
        if (this.ffmpeg === null) {
            this.ffmpeg = new this.FFmpeg();
            this.ffmpeg.on("log", ({
                message
            }) => {
                console.log(message);
            });
            this.ffmpeg.on("progress", ({
                progress,
                time
            }) => {
                this.message.innerHTML = `${progress * 100} %`;
            });
            if (this.isMultiThreaded) {
                await this.loadMultiThreadFiles();
            } else {
                await this.loadSingleThreadFiles();
            }
        }
    }

    //load files for  multithreaded mode
    async loadMultiThreadFiles() {
        console.log("multithreading engaged");
        const pathObject = this.getPathObject();
        await this.ffmpeg.load({
            coreURL: pathObject.mtCore,
            wasmURL: pathObject.mtWasm,
            workerURL: pathObject.mtWorker,
        });
    }

    //load files for  singlethreaded mode
    async loadSingleThreadFiles() {
        console.log("singlethreading engaged");
        const pathObject = this.getPathObject();
        await this.ffmpeg.load({
            coreURL: pathObject.stCore,
        });
    }

    //utility function - converts string commands to array commands
    parseCommandString(commandString) {
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


    //gets string ffmpeg commands based on  mode
    getCommands(inputObject, mode) {
        const editoptions = {
            conversion: `-i "${inputObject.inputFileName}" "${inputObject.outputFileName}"`,
            trim: `-ss "${inputObject.start.time}" -i "${inputObject.inputFileName}" -ss "${inputObject.start.time}" -i "${inputObject.inputFileName}" -t ${inputObject.end.time} -map 0:v -map 1:a? -c:v copy -c:a copy "${inputObject.outputFileName}"`,
            merge: `-f concat -safe 0 -i concat_list.txt -c:v copy -c:a copy "${inputObject.outputFileName}"`,
            split: `-i "${inputObject.inputFileName}" -t ${inputObject.start.time} -c:v copy -c:a copy "${inputObject.outputFileName}" -ss ${inputObject.start.time} -c:v copy -c:a copy "${inputObject.outputFileName2}"`,
            resize: `-i "${inputObject.inputFileName}" -vf "scale=${inputObject.size},setsar=1:1" ${inputObject.outputFileName}`,
            removeaudio: `-i "${inputObject.inputFileName}" -c:v copy -an "${inputObject.outputFileName}"`,
            crop: `-i "${inputObject.inputFileName}" -vf crop=${inputObject.dimension} ${inputObject.outputFileName}`,
            getaudio: `-i "${inputObject.inputFileName}" "${inputObject.outputFileName}"`,
            textoverlay: `-i "${inputObject.inputFileName}" -vf drawtext="${inputObject.drawtext}" ${inputObject.outputFileName}`,
        };

        return editoptions[mode];
    }


    //processes the input videos based on commands with ffmpeg.exec
    async processVideo(inputObject, mode) {
        switch (mode) {
            case 'conversion':
            case 'trim':
            case 'split':
            case 'removeaudio':
            case 'resize':
            case 'crop':
            case 'getaudio':
            case 'textoverlay':
                await this.ffmpeg.writeFile(inputObject.inputFileName, await this.fetchFile(inputObject.videoFile[0]));
                break;
            case 'merge':
                const inputPaths = [];
                for (const file of inputObject.videoFile) {
                    const {
                        name
                    } = file;
                    await this.ffmpeg.writeFile(name, await this.fetchFile(file));
                    inputPaths.push(`file '${name}'`);
                }
                await this.ffmpeg.writeFile('concat_list.txt', inputPaths.join('\n'));
                break;
            default:
                console.error("path not found");
                return;
        }


        this.message.innerHTML = 'Start transcoding';
        const command = this.getCommands(inputObject, mode);
        const commandArray = this.parseCommandString(command);
        await this.ffmpeg.exec(commandArray);
        this.message.innerHTML = 'Transcoding completed';

    }

    //creates a blob file and generates a download link, ie: offline downloading from the memory
    async generateOutput(inputObject, mode) {
        const data = await this.ffmpeg.readFile(inputObject.outputFileName);
        const video = document.getElementById('output-video');
        const mimeType = `video/${inputObject.outputFileType}`;
        const processedVideoUrl = URL.createObjectURL(new Blob([data.buffer], {
            type: mimeType
        }));
        video.src = processedVideoUrl;

        if (this.previousProcessedVideoUrl) {
            URL.revokeObjectURL(this.previousProcessedVideoUrl);
        }
        this.previousProcessedVideoUrl = processedVideoUrl;

        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = processedVideoUrl;
        downloadLink.download = inputObject.outputFileName;
        downloadLink.style.display = "block";

        if (mode === 'split') {
            const data2 = await this.ffmpeg.readFile(inputObject.outputFileName2);
            const processedVideoUrl2 = URL.createObjectURL(new Blob([data2.buffer], {
                type: mimeType
            }));

            if (this.previousProcessedVideoUrl2) {
                URL.revokeObjectURL(this.previousProcessedVideoUrl2);
            }
            this.previousProcessedVideoUrl2 = processedVideoUrl2;

            const downloadLink2 = document.getElementById('downloadLink2');
            downloadLink2.href = processedVideoUrl2;
            downloadLink2.download = inputObject.outputFileName2;
            downloadLink2.style.display = "block";
        }

        if (video.classList.contains('hidden')) {
            video.classList.remove('hidden');
        }
    }
}


/**
 * FFmpegManager deals with getting data from user , connecting it to ffmpegManager, and executing the core logic
 * 
 * 1. handleConvertButtonClick
 * 2.  calculateDuration
 */
export class VideoProcessor {
    constructor(envMode) {
        this.ffmpegManager = new FFmpegManager(envMode);
        this.videoInput = document.getElementById('videoInput');
        this.outputName = document.getElementById('outputName');
        this.convertButton = document.getElementById('convertButton');
        this.mode = document.getElementById('mode').textContent;

        if (!this.videoInput || !this.outputName || !this.convertButton || !this.mode) {
            throw new Error("One or more required DOM elements are missing.");
        }

        this.convertButton.addEventListener("click", async () => {
            
        try{
            await this.handleConvertButtonClick();
        } catch(e) {

            document.getElementById('message').innerHTML = 'error occured';
            console.log(e)

        }
        });

        this.ffmpegManager.initLoad();
    }


    //gets input from user and uses ffmpgeManager class
    async handleConvertButtonClick() {

        const videoInput = document.getElementById('videoInput');
        const mode = document.getElementById('mode').textContent;
        const outName = document.getElementById('outputName')
        console.log(mode)

        if (!videoInput || videoInput.files.length === 0) {
            console.error("No video file selected.");
            return;
        }

        if (!outName.value) {

            // outName.focus()
            outName.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
            alert("Enter Name for Output file")
            return
        }

        const videoFile = videoInput.files;
        var inputObject = {

            videoFile: videoInput.files,
            inputFileName: '',
            outputFileN: outName.value,
            outputFileType: '',
            outputFileName: '',
            outputFileName2: '',
            start: {
                hour: 0,
                minute: 0,
                second: 0
            },
            end: {
                hour: 0,
                minute: 0,
                second: 0
            },
            duration: '',
            size: '',
            dimension: '',
            audioinput: '',
            drawtext: ''
        }

        switch (mode) {
            case 'conversion':
                inputObject.outputFileType = document.getElementById('outputFormat').value;
                inputObject.inputFileName = inputObject.videoFile[0].name;
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;
                break;

            case 'trim':
                inputObject.inputFileName = inputObject.videoFile[0].name;
                inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;
                inputObject.start = {
                    hour: document.getElementById('start_hour').value,
                    minute: document.getElementById('start_minute').value,
                    second: document.getElementById('start_second').value,
                };
                inputObject.end = {
                    hour: document.getElementById('end_hour').value,
                    minute: document.getElementById('end_minute').value,
                    second: document.getElementById('end_second').value,
                };
                inputObject.start.time = `${inputObject.start.hour}:${inputObject.start.minute}:${inputObject.start.second}`;
                inputObject.end.time = `${inputObject.start.hour}:${inputObject.end.minute}:${inputObject.end.second}`;
                inputObject.end.time = this.calculateDuration(inputObject.start.time, inputObject.end.time);
                break;

            case 'merge':
                console.log("merging - input");
                inputObject.videoFile = videoInput.files;
                console.log(inputObject.videoFile);
                inputObject.inputFileName = inputObject.videoFile[0].name;
                inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;

                const inputType = inputObject.inputFileName.split('.').pop();
                for (var type of inputObject.videoFile) {
                    if (type.name.split('.').pop() != inputType) {
                        alert("input files must be of the same type");
                        return;
                    }
                }
                break;

            case 'split':
                inputObject.inputFileName = inputObject.videoFile[0].name;
                inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
                inputObject.outputFileName = `${inputObject.outputFileN}p1.${inputObject.outputFileType}`;
                inputObject.outputFileName2 = `${inputObject.outputFileN}p2.${inputObject.outputFileType}`;
                inputObject.start = {
                    hour: document.getElementById('start_hour').value,
                    minute: document.getElementById('start_minute').value,
                    second: document.getElementById('start_second').value,
                };
                inputObject.start.time = `${inputObject.start.hour}:${inputObject.start.minute}:${inputObject.start.second}`;
                console.log(inputObject)
                break;

            case 'resize':
                inputObject.inputFileName = inputObject.videoFile[0].name;
                inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;
                inputObject.size = document.getElementById('dimension').value;
                break;

            case 'removeaudio':
                inputObject.inputFileName = inputObject.videoFile[0].name;
                inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;
                break;

            case 'crop':
                inputObject.inputFileName = inputObject.videoFile[0].name;
                inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;
                inputObject.dimension = `${document.getElementById('width').value}:${document.getElementById('height').value}:${document.getElementById('x').value}:${document.getElementById('y').value}`;
                console.log(inputObject.dimension);
                break;

            case 'getaudio':
                inputObject.outputFileType = document.getElementById('outputFormat').value;
                inputObject.inputFileName = inputObject.videoFile[0].name;
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;
                break;

            case 'textoverlay':
                inputObject.inputFileName = inputObject.videoFile[0].name;
                inputObject.outputFileType = inputObject.inputFileName.split('.').pop();
                inputObject.outputFileName = `${inputObject.outputFileN}.${inputObject.outputFileType}`;
                inputObject.drawtext = `text='${document.getElementById('text').value}':x=${document.getElementById('x').value}:y=${document.getElementById('y').value}:fontsize=${document.getElementById('fontsize').value}`;
                console.log(` The created drawtext ${inputObject.drawtext}`);
                break;

            default:
                console.log("path not found");
                return;
        }

        // Now you would call your FFmpeg processing function with inputObject
        await this.ffmpegManager.processVideo(inputObject, mode);
        await this.ffmpegManager.generateOutput(inputObject, mode);
    }

    //utility function,  calculates time in seconds from start and end timing
    calculateDuration(startTime, endTime) {
        const startParts = startTime.split(':').map(parseFloat);
        const endParts = endTime.split(':').map(parseFloat);

        const startSeconds = (startParts[0] * 3600) + (startParts[1] * 60) + startParts[2];
        const endSeconds = (endParts[0] * 3600) + (endParts[1] * 60) + endParts[2];

        if (endSeconds <= startSeconds) {
            throw new Error("End time must be greater than start time.");
        }

        return endSeconds - startSeconds;
    }
}

// Define envMode based on the environment
// const envMode = 'development';  // or 'production'

// Initialize the VideoProcessor instance
//Showing input video controls
const videoInputPlayer = document.getElementById('input-video');


videoInput.addEventListener("change", function (event) {
    const selectedFile = event.target.files[0]; // Get the selected file

    if (selectedFile) {

        console.log("File selected:", selectedFile.name);

        var objectURL = URL.createObjectURL(selectedFile)
        videoInputPlayer.src = objectURL

        //unhide input video
        if (videoInputPlayer.classList.contains('hidden')) {

            videoInputPlayer.classList.toggle('hidden')

        }





    } else {

        console.log("No file selected.");
    }
});


new VideoProcessor(envMode);