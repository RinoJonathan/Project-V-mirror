/**
 * @jest-environment jsdom
 */

import { VideoProcessor } from "../../public/javascript/original/feature_script";
import { FFmpegManager } from "../../public/javascript/original/feature_script";

jest.mock('../../public/javascript/original/feature_script', () => {
  return {
    FFmpegManager: jest.fn().mockImplementation(() => {
      return {
        initLoad: jest.fn(),
        processVideo: jest.fn(),
        generateOutput: jest.fn()
      };
    })
  };
});

describe('VideoProcessor', () => {
  let videoProcessor;
  let mockFFmpegManager;
  let mockVideoInput;
  let mockOutputName;
  let mockConvertButton;
  let mockMode;
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

    mockVideoInput = document.getElementById('videoInput');
    mockOutputName = document.getElementById('outputName');
    mockConvertButton = document.getElementById('convertButton');
    mockMode = document.getElementById('mode').textContent;
    mockMessage = document.getElementById('message');

    mockFFmpegManager = new FFmpegManager();

    videoProcessor = new VideoProcessor('development');
  });

  test('should throw error if required DOM elements are missing', () => {
    document.body.innerHTML = '';
    expect(() => new VideoProcessor('development')).toThrow('One or more required DOM elements are missing.');
  });

  test('should initialize FFmpegManager on construction', () => {
    expect(mockFFmpegManager.initLoad).toHaveBeenCalled();
  });

  test('should display error message if no video file is selected', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await videoProcessor.handleConvertButtonClick();
    expect(consoleErrorSpy).toHaveBeenCalledWith('No video file selected.');
    consoleErrorSpy.mockRestore();
  });

  test('should prompt for output name if not provided', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockVideoInput.files = [new File(['||||' ], 'sample.mp4', { type: 'video/mp4' })];

    await videoProcessor.handleConvertButtonClick();

    expect(alertSpy).toHaveBeenCalledWith('Enter Name for Output file');
    alertSpy.mockRestore();
  });

  test('should call FFmpegManager methods for valid input', async () => {
    mockVideoInput.files = [new File(['||||' ], 'sample.mp4', { type: 'video/mp4' })];
    mockOutputName.value = 'output';

    await videoProcessor.handleConvertButtonClick();

    expect(mockFFmpegManager.processVideo).toHaveBeenCalled();
    expect(mockFFmpegManager.generateOutput).toHaveBeenCalled();
  });

  test('should handle different modes correctly', async () => {
    mockVideoInput.files = [new File(['||||' ], 'sample.mp4', { type: 'video/mp4' })];
    mockOutputName.value = 'output';
    document.getElementById('mode').textContent = 'trim';

    document.getElementById('start_hour').value = '00';
    document.getElementById('start_minute').value = '01';
    document.getElementById('start_second').value = '30';
    document.getElementById('end_hour').value = '00';
    document.getElementById('end_minute').value = '02';
    document.getElementById('end_second').value = '30';

    await videoProcessor.handleConvertButtonClick();

    expect(mockFFmpegManager.processVideo).toHaveBeenCalled();
    expect(mockFFmpegManager.generateOutput).toHaveBeenCalled();
  });

  test('calculateDuration should correctly calculate duration', () => {
    const startTime = '00:01:30';
    const endTime = '00:02:30';
    const duration = videoProcessor.calculateDuration(startTime, endTime);
    expect(duration).toBe(60);
  });

  test('calculateDuration should throw error if end time is less than start time', () => {
    const startTime = '00:02:30';
    const endTime = '00:01:30';
    expect(() => videoProcessor.calculateDuration(startTime, endTime)).toThrow('End time must be greater than start time.');
  });
});
