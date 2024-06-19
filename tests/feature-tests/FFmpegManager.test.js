/**
 * @jest-environment jsdom
 */

import { FFmpegManager } from "../../public/javascript/original/feature_script";


describe('FFmpegManager', () => {
  let ffmpegManager;
  let mockFFmpeg;
  let mockFetchFile;
  let mockMessage;

  beforeEach(() => {
    
    document.body.innerHTML = `
    <input type="file" id="videoInput" />
    <input type="text" id="outputName" />
    <button id="convertButton"></button>
    <span id="mode">conversion</span>
    <div id="message"></div>
    <video id="input-video" class="hidden"></video>
  `;
  
    mockMessage = document.getElementById('message');
    ffmpegManager = new FFmpegManager('development');
    mockFFmpeg = {
      on: jest.fn(),
      load: jest.fn(),
      writeFile: jest.fn(),
      exec: jest.fn(),
      readFile: jest.fn()
    };
    mockFetchFile = jest.fn();
    ffmpegManager.FFmpeg = jest.fn(() => mockFFmpeg);
    ffmpegManager.fetchFile = mockFetchFile;
  });

  test('should initialize FFmpeg with correct paths in development mode', () => {
    const paths = ffmpegManager.getPathObject();
    expect(paths.ffmpeg).toBe('/javascript/ffmpeg/ffmpeg/index.js');
    expect(paths.utils).toBe('/javascript/ffmpeg/utils/index.js');
  });

  test('should initialize FFmpeg instance correctly', async () => {
    await ffmpegManager.initLoad();
    expect(ffmpegManager.FFmpeg).toHaveBeenCalled();
    expect(mockFFmpeg.on).toHaveBeenCalledWith('log', expect.any(Function));
    expect(mockFFmpeg.on).toHaveBeenCalledWith('progress', expect.any(Function));
  });

  test('should parse command string correctly', () => {
    const command = '-i "input.mp4" -vf "scale=1280:720" "output.mp4"';
    const parsedCommand = ffmpegManager.parseCommandString(command);
    expect(parsedCommand).toEqual(['-i', 'input.mp4', '-vf', 'scale=1280:720', 'output.mp4']);
  });

  test('should get commands based on mode', () => {
    const inputObject = {
      inputFileName: 'input.mp4',
      outputFileName: 'output.mp4',
      start: { time: '00:00:10' },
      end: { time: '00:00:20' },
      size: '1280:720',
      dimension: '640:480',
      drawtext: 'text="Hello"'
    };
    const commands = ffmpegManager.getCommands(inputObject, 'conversion');
    expect(commands).toBe('-i "input.mp4" "output.mp4"');
  });

  test('should process video correctly in conversion mode', async () => {
    const inputObject = {
      inputFileName: 'input.mp4',
      outputFileName: 'output.mp4',
      videoFile: [new File([], 'input.mp4')]
    };
    mockFetchFile.mockResolvedValueOnce(new Uint8Array([1, 2, 3]));
    await ffmpegManager.initLoad();
    await ffmpegManager.processVideo(inputObject, 'conversion');
    expect(mockFFmpeg.writeFile).toHaveBeenCalledWith('input.mp4', new Uint8Array([1, 2, 3]));
    expect(mockFFmpeg.exec).toHaveBeenCalledWith(['-i', 'input.mp4', 'output.mp4']);
    expect(mockMessage.innerHTML).toBe('Transcoding completed');
  });

  test('should generate output video correctly', async () => {
    const inputObject = {
      outputFileName: 'output.mp4',
      outputFileType: 'mp4'
    };
    const mockData = { buffer: new ArrayBuffer(10) };
    mockFFmpeg.readFile.mockResolvedValue(mockData);
    await ffmpegManager.generateOutput(inputObject, 'conversion');
    const video = document.getElementById('output-video');
    const downloadLink = document.getElementById('downloadLink');
    expect(video.src).toContain('blob:');
    expect(downloadLink.href).toContain('blob:');
    expect(downloadLink.download).toBe('output.mp4');
    expect(downloadLink.style.display).toBe('block');
    expect(video.classList.contains('hidden')).toBe(false);
  });

  // Edge cases
  test('should handle invalid mode in getCommands', () => {
    const inputObject = { inputFileName: 'input.mp4', outputFileName: 'output.mp4' };
    expect(() => ffmpegManager.getCommands(inputObject, 'invalidMode')).toThrow();
  });

  test('should handle invalid mode in processVideo', async () => {
    const inputObject = { inputFileName: 'input.mp4', outputFileName: 'output.mp4', videoFile: [new File([], 'input.mp4')] };
    console.error = jest.fn(); // Suppress error logs
    await ffmpegManager.initLoad();
    await ffmpegManager.processVideo(inputObject, 'invalidMode');
    expect(console.error).toHaveBeenCalledWith("path not found");
  });

  test('should revoke previous video URL on generating new output', async () => {
    const inputObject = { outputFileName: 'output.mp4', outputFileType: 'mp4' };
    const mockData = { buffer: new ArrayBuffer(10) };
    mockFFmpeg.readFile.mockResolvedValue(mockData);
    await ffmpegManager.generateOutput(inputObject, 'conversion');
    const previousUrl = ffmpegManager.previousProcessedVideoUrl;
    await ffmpegManager.generateOutput(inputObject, 'conversion');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(previousUrl);
  });

  test('should generate second output for split mode', async () => {
    const inputObject = {
      outputFileName: 'output.mp4',
      outputFileName2: 'output2.mp4',
      outputFileType: 'mp4'
    };
    const mockData = { buffer: new ArrayBuffer(10) };
    mockFFmpeg.readFile.mockResolvedValue(mockData);
    await ffmpegManager.generateOutput(inputObject, 'split');
    const downloadLink2 = document.getElementById('downloadLink2');
    expect(downloadLink2.href).toContain('blob:');
    expect(downloadLink2.download).toBe('output2.mp4');
    expect(downloadLink2.style.display).toBe('block');
  });
});
