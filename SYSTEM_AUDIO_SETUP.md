# System Audio Setup Guide

## What is System Audio Capture?

System audio capture allows the application to listen to audio that's playing through your speakers or headphones (like music, video calls, game audio, etc.) instead of your microphone. This is essential for the assist mode to work with content you're actively listening to.

## Why is this needed?

Unlike microphone access, system audio capture requires special configuration on Windows because:
- Windows doesn't expose system audio directly for privacy reasons
- Applications need explicit permission to "hear" what you're hearing
- It requires enabling specific audio devices or installing virtual audio cables

## Windows Setup Instructions

### Method 1: Enable Stereo Mix (Recommended for most users)

1. **Open Sound Settings**
   - Right-click the speaker icon in your system tray
   - Select "Sounds" or "Open Sound settings"

2. **Access Recording Devices**
   - Click on "Sound Control Panel" (in newer Windows versions)
   - Or go to Control Panel → Hardware and Sound → Sound
   - Click the "Recording" tab

3. **Enable Hidden Devices**
   - Right-click in an empty area of the Recording tab
   - Check "Show Disabled Devices"
   - Check "Show Disconnected Devices"

4. **Enable Stereo Mix**
   - Look for "Stereo Mix" in the list
   - Right-click on "Stereo Mix"
   - Select "Enable"
   - Right-click again and select "Set as Default Device"

5. **Test the Setup**
   - Play some music or audio
   - Right-click "Stereo Mix" → "Properties"
   - Go to "Listen" tab
   - Check "Listen to this device" briefly to test (uncheck after testing)

### Method 2: Virtual Audio Cable (If Stereo Mix isn't available)

Some audio drivers don't include Stereo Mix. In this case:

1. **Download VB-Audio Virtual Cable**
   - Go to https://vb-audio.com/Cable/
   - Download and install VB-CABLE Virtual Audio Device

2. **Configure Virtual Cable**
   - Set VB-Cable Input as your default playback device temporarily
   - Set VB-Cable Output as available recording device
   - Configure your applications to route through the virtual cable

3. **Advanced Setup**
   - Use VB-Audio VoiceMeeter for more advanced routing
   - Allows you to mix multiple audio sources

### Method 3: OBS Virtual Audio (For Advanced Users)

1. Install OBS Studio
2. Install OBS Virtual Audio Plugin
3. Configure audio routing through OBS
4. Use OBS Virtual Audio device as input

## Verification Steps

1. **Start the Assist Mode**
   - Toggle the ear icon in the overlay
   - Check console/logs for device detection messages

2. **Test with Audio**
   - Play music, YouTube, or any audio content
   - The assist mode should detect and process the system audio
   - Look for "🎧 Listening to system audio..." message

3. **Check Device Logs**
   - Open browser developer tools (F12)
   - Look for messages like "🔊 Found potential system audio device"
   - Verify the correct device is being used

## Troubleshooting

### Common Issues

**"No suitable audio input device available"**
- Stereo Mix is not enabled or available
- Try Method 2 (Virtual Audio Cable)
- Check that audio drivers are up to date

**"Failed to start system audio"**
- Another application might be using the audio device
- Restart the application
- Check Windows audio permissions

**Audio is captured but very quiet**
- Adjust Stereo Mix levels in Recording devices
- Right-click Stereo Mix → Properties → Levels
- Increase the volume slider

**Getting microphone audio instead of system audio**
- Wrong device is set as default
- Ensure Stereo Mix is set as default recording device
- Check device selection in the Rust audio code logs

### Debug Information

The application logs detailed information about audio devices:
```
🎧 Available input devices:
  - Microphone (Realtek Audio)
  - Stereo Mix (Realtek Audio)  ← This is what we want
  - Line In (Realtek Audio)
✅ Selected audio device: Stereo Mix (Realtek Audio)
```

## Security & Privacy Considerations

### What the app can hear:
- ✅ Music, videos, and media playing on your computer
- ✅ Audio from video calls (like Zoom, Teams, Discord)
- ✅ Game audio and sound effects
- ✅ System sounds and notifications

### What the app CANNOT hear:
- ❌ Your microphone unless you're in a call where it's being played back
- ❌ Audio from other people's devices
- ❌ Any audio not going through your speakers/headphones

### Privacy Tips:
- The assist mode only activates when you explicitly toggle it on
- Audio is processed in real-time and not stored locally
- You can see the active status with the pulsing ear icon
- Toggle off assist mode when you don't want audio processing

## Platform Differences

### Windows 10/11
- Most systems have Stereo Mix available but disabled
- Follow Method 1 above

### Windows 8/7
- Usually has better built-in support for Stereo Mix
- May be enabled by default

### Alternative Operating Systems
- macOS: Requires third-party tools like Soundflower or BlackHole
- Linux: Use PulseAudio monitor devices
- Currently this app is optimized for Windows

## Getting Help

If you're still having issues:

1. **Check the Console Logs**
   - Press F12 to open developer tools
   - Look for audio-related error messages

2. **Verify Hardware Support**
   - Some USB headsets don't support system audio capture
   - Try with built-in audio devices first

3. **Update Audio Drivers**
   - Visit your computer manufacturer's website
   - Download latest audio drivers for your specific model

4. **System Requirements**
   - Windows 10 or later recommended
   - Realtek, Intel, or other standard audio drivers

## Technical Details

The app uses the `cpal` audio library to:
1. Enumerate all available audio input devices
2. Look for devices with names containing "loopback", "stereo mix", "monitor", etc.
3. Capture raw audio samples at the system sample rate
4. Downsample to 24kHz for processing
5. Convert to 16-bit PCM and encode as base64
6. Stream to the backend for real-time analysis

The audio pipeline is designed to match web audio standards while leveraging native system capabilities through Tauri.