package com.example.morsecode

object MorseTranslator {
    private val textToMorse = mapOf(
        // Letters
        'A' to ".-", 'B' to "-...", 'C' to "-.-.", 'D' to "-..",
        'E' to ".", 'F' to "..-.", 'G' to "--.", 'H' to "....",
        'I' to "..", 'J' to ".---", 'K' to "-.-", 'L' to ".-..",
        'M' to "--", 'N' to "-.", 'O' to "---", 'P' to ".--.",
        'Q' to "--.-", 'R' to ".-.", 'S' to "...", 'T' to "-",
        'U' to "..-", 'V' to "...-", 'W' to ".--", 'X' to "-..-",
        'Y' to "-.--", 'Z' to "--..",

        // Numbers
        '0' to "-----", '1' to ".----", '2' to "..---", '3' to "...--",
        '4' to "....-", '5' to ".....", '6' to "-....", '7' to "--...",
        '8' to "---..", '9' to "----.",

        // Symbols
        '.' to ".-.-.-", ',' to "--..--", '?' to "..--..",
        '\'' to ".----.", '!' to "-.-.--", '/' to "-..-.",
        '(' to "-.--.", ')' to "-.--.-", '&' to ".-...",
        ':' to "---...", ';' to "-.-.-.", '=' to "-...-",
        '+' to ".-.-.", '-' to "-....-", '_' to "..--.-",
        '"' to ".-..-.", '$' to "...-..-", '@' to ".--.-.",

        // Space
        ' ' to "/"
    )

    private val morseToText = textToMorse.entries.associateBy({ it.value }) { it.key }

    fun textToMorse(text: String): String {
        return text.uppercase()
            .map { char -> textToMorse[char] ?: "" }
            .filter { it.isNotEmpty() }
            .joinToString(" ")
    }

    fun morseToText(morse: String): String {
        return morse.split(" ")
            .map { code -> morseToText[code] ?: "" }
            .joinToString("")
            .replace("/", " ")
    }

    fun getMorseTimings(morseCode: String): List<Long> {
        val timings = mutableListOf<Long>()
        val dotDuration = 200L // milliseconds
        val dashDuration = dotDuration * 3
        val symbolGap = dotDuration
        val letterGap = dotDuration * 3
        val wordGap = dotDuration * 7

        val codes = morseCode.split(" ")

        for (i in codes.indices) {
            val code = codes[i]

            if (code == "/") {
                // Word space - add extra gap
                if (timings.isNotEmpty()) {
                    timings.add(wordGap)
                }
                continue
            }

            for (j in code.indices) {
                val symbol = code[j]
                when (symbol) {
                    '.' -> {
                        timings.add(dotDuration) // ON
                        timings.add(symbolGap) // OFF
                    }
                    '-' -> {
                        timings.add(dashDuration) // ON
                        timings.add(symbolGap) // OFF
                    }
                }
            }

            // Add letter gap between letters (but not after the last letter)
            if (i < codes.size - 1 && codes[i + 1] != "/") {
                timings.add(letterGap)
            }
        }

        return timings
    }
}
