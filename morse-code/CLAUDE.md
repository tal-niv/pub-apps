# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Android Morse code translator app (Kotlin). Bidirectional English↔Morse translation with flashlight signaling via camera2 API.

## Build & Run

This is a Gradle-based Android project. Use Android Studio or command line:

```bash
./gradlew assembleDebug        # Build debug APK
./gradlew assembleRelease      # Build release APK
./gradlew clean                # Clean build artifacts
```

No test suite is configured.

## Architecture

Single-activity app with two Kotlin files:

- **`MainActivity`** (`app/src/main/java/com/example/morsecode/MainActivity.kt`) — UI controller using View Binding. Manages language swap state (`isEnglishToMorse`), morse input buttons (dot/dash/space), real-time TextWatcher translation, and flashlight transmission via coroutines on `Dispatchers.Main`.
- **`MorseTranslator`** (`app/src/main/java/com/example/morsecode/MorseTranslator.kt`) — Stateless `object` with the morse lookup table and three functions: `textToMorse()`, `morseToText()`, `getMorseTimings()`. The reverse lookup map is derived automatically from the forward map.

Layout is a single XML file (`app/src/main/res/layout/activity_main.xml`) using LinearLayout with MaterialCardView containers.

## Key Details

- **SDK**: minSdk 24, targetSdk/compileSdk 34, Kotlin 1.9.20, AGP 8.2.0, Gradle 8.2
- **Dependencies**: AndroidX Core KTX 1.12.0, AppCompat 1.6.1, Material 1.11.0, ConstraintLayout 2.1.4, Kotlinx Coroutines Android 1.7.3
- **Morse timing**: dot=200ms, dash=600ms, symbol gap=200ms, letter gap=600ms, word gap=1400ms
- **Flashlight**: Uses `CameraManager.setTorchMode()` (camera2 API). Requires CAMERA permission (runtime-requested, code 100).
- **Morse format**: Letters separated by spaces, words separated by ` / `. Dots are `.`, dashes are `-`.
- **ProGuard**: Keeps all classes in `com.example.morsecode` package and annotations.
- **UI**: View Binding enabled. Portrait-only orientation. Material3.Light theme.
