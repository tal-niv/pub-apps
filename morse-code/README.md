# Morse Code Translator App

An Android application that translates between English and Morse code, with flashlight signaling capability.

## Features

- **Bidirectional Translation**: Translate from English to Morse code and vice versa
- **Google Translate-style UI**: Familiar and intuitive interface
- **Morse Input Buttons**: Dedicated dot (.) and dash (-) buttons for easy Morse code input
- **Real-time Translation**: Text is translated as you type
- **Flashlight Transmission**: Send Morse code messages using your device's flashlight
- **Language Swapping**: Easily swap between English and Morse input/output

## How to Use

1. **Select Languages**:
   - Tap the language buttons at the top to swap between English and Morse
   - Blue button = Source language
   - Green button = Target language

2. **Enter Text**:
   - **English Mode**: Type normally in the text box
   - **Morse Mode**: Use the dot (.), dash (_), and space buttons on the left side

3. **View Translation**: The translated text appears in the bottom text box automatically

4. **Send with Flashlight**:
   - Tap the "Send with Flashlight" button
   - Grant camera permission when prompted
   - Your device's flashlight will blink the Morse code message

## Morse Code Chart

The app supports:
- All letters (A-Z)
- All numbers (0-9)
- Common symbols (. , ? ' ! / ( ) & : ; = + - _ " $ @)
- Space character

## Requirements

- Android 7.0 (API level 24) or higher
- Device with camera flash
- Camera permission (for flashlight access)

## Technical Details

- **Language**: Kotlin
- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)
- **Architecture**: Single Activity with coroutines for flashlight timing

## Building the App

1. Open the project in Android Studio
2. Sync Gradle files
3. Run on an emulator or physical device

## Morse Code Timing

The flashlight follows standard Morse code timing:
- Dot: 200ms
- Dash: 600ms (3× dot)
- Symbol gap: 200ms
- Letter gap: 600ms (3× dot)
- Word gap: 1400ms (7× dot)

## Permissions

- **CAMERA**: Required to access and control the device flashlight for Morse code transmission
