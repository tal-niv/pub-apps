package com.example.morsecode

import android.Manifest
import android.content.pm.PackageManager
import android.hardware.camera2.CameraAccessException
import android.hardware.camera2.CameraManager
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import kotlinx.coroutines.*

class MainActivity : AppCompatActivity() {
    private lateinit var btnSourceLanguage: Button
    private lateinit var btnTargetLanguage: Button
    private lateinit var etInput: EditText
    private lateinit var tvOutput: TextView
    private lateinit var tvInputLabel: TextView
    private lateinit var tvOutputLabel: TextView
    private lateinit var btnSend: Button
    private lateinit var morseInputButtons: LinearLayout
    private lateinit var btnDot: Button
    private lateinit var btnDash: Button
    private lateinit var btnSpace: Button

    private var isEnglishToMorse = true
    private var cameraManager: CameraManager? = null
    private var cameraId: String? = null
    private var isSending = false

    companion object {
        private const val CAMERA_PERMISSION_REQUEST = 100
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initializeViews()
        setupCameraManager()
        setupLanguageButtons()
        setupMorseInputButtons()
        setupTextWatcher()
        setupSendButton()
    }

    private fun initializeViews() {
        btnSourceLanguage = findViewById(R.id.btnSourceLanguage)
        btnTargetLanguage = findViewById(R.id.btnTargetLanguage)
        etInput = findViewById(R.id.etInput)
        tvOutput = findViewById(R.id.tvOutput)
        tvInputLabel = findViewById(R.id.tvInputLabel)
        tvOutputLabel = findViewById(R.id.tvOutputLabel)
        btnSend = findViewById(R.id.btnSend)
        morseInputButtons = findViewById(R.id.morseInputButtons)
        btnDot = findViewById(R.id.btnDot)
        btnDash = findViewById(R.id.btnDash)
        btnSpace = findViewById(R.id.btnSpace)
    }

    private fun setupCameraManager() {
        cameraManager = getSystemService(CAMERA_SERVICE) as CameraManager
        try {
            cameraId = cameraManager?.cameraIdList?.get(0)
        } catch (e: CameraAccessException) {
            Toast.makeText(this, "Camera not available", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupLanguageButtons() {
        btnSourceLanguage.setOnClickListener {
            swapLanguages()
        }

        btnTargetLanguage.setOnClickListener {
            swapLanguages()
        }
    }

    private fun swapLanguages() {
        isEnglishToMorse = !isEnglishToMorse

        if (isEnglishToMorse) {
            btnSourceLanguage.text = "English"
            btnTargetLanguage.text = "Morse"
            tvInputLabel.text = "English"
            tvOutputLabel.text = "Morse"
            morseInputButtons.visibility = View.GONE
            etInput.hint = "Enter text"
        } else {
            btnSourceLanguage.text = "Morse"
            btnTargetLanguage.text = "English"
            tvInputLabel.text = "Morse"
            tvOutputLabel.text = "English"
            morseInputButtons.visibility = View.VISIBLE
            etInput.hint = "Enter morse code"
        }

        // Translate existing text with new direction
        val currentInput = etInput.text.toString()
        if (currentInput.isNotEmpty()) {
            translateText(currentInput)
        } else {
            tvOutput.text = ""
        }
    }

    private fun setupMorseInputButtons() {
        btnDot.setOnClickListener {
            val currentPos = etInput.selectionStart
            etInput.text.insert(currentPos, ".")
        }

        btnDash.setOnClickListener {
            val currentPos = etInput.selectionStart
            etInput.text.insert(currentPos, "-")
        }

        btnSpace.setOnClickListener {
            val currentPos = etInput.selectionStart
            etInput.text.insert(currentPos, " ")
        }
    }

    private fun setupTextWatcher() {
        etInput.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}

            override fun afterTextChanged(s: Editable?) {
                translateText(s.toString())
            }
        })
    }

    private fun translateText(input: String) {
        if (input.isEmpty()) {
            tvOutput.text = ""
            return
        }

        val translated = if (isEnglishToMorse) {
            MorseTranslator.textToMorse(input)
        } else {
            MorseTranslator.morseToText(input)
        }

        tvOutput.text = translated
    }

    private fun setupSendButton() {
        btnSend.setOnClickListener {
            if (isSending) {
                Toast.makeText(this, "Already sending message", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val outputText = tvOutput.text.toString()
            if (outputText.isEmpty()) {
                Toast.makeText(this, "Nothing to send", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Convert to morse if output is in English
            val morseCode = if (isEnglishToMorse) {
                outputText
            } else {
                MorseTranslator.textToMorse(outputText)
            }

            if (checkCameraPermission()) {
                sendMorseWithFlashlight(morseCode)
            } else {
                requestCameraPermission()
            }
        }
    }

    private fun checkCameraPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun requestCameraPermission() {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.CAMERA),
            CAMERA_PERMISSION_REQUEST
        )
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == CAMERA_PERMISSION_REQUEST) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                val morseCode = if (isEnglishToMorse) {
                    tvOutput.text.toString()
                } else {
                    MorseTranslator.textToMorse(tvOutput.text.toString())
                }
                sendMorseWithFlashlight(morseCode)
            } else {
                Toast.makeText(this, "Camera permission required for flashlight", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun sendMorseWithFlashlight(morseCode: String) {
        isSending = true
        btnSend.isEnabled = false
        btnSend.text = "Sending..."

        val timings = MorseTranslator.getMorseTimings(morseCode)

        CoroutineScope(Dispatchers.Main).launch {
            try {
                var isOn = false
                for (timing in timings) {
                    if (isOn) {
                        // Turn flashlight ON
                        setFlashlight(true)
                    } else {
                        // Turn flashlight OFF
                        setFlashlight(false)
                    }
                    delay(timing)
                    isOn = !isOn
                }

                // Ensure flashlight is off at the end
                setFlashlight(false)

                Toast.makeText(this@MainActivity, "Message sent!", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                Toast.makeText(this@MainActivity, "Error sending message: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                isSending = false
                btnSend.isEnabled = true
                btnSend.text = "Send with Flashlight"
            }
        }
    }

    private fun setFlashlight(on: Boolean) {
        try {
            cameraId?.let { id ->
                cameraManager?.setTorchMode(id, on)
            }
        } catch (e: CameraAccessException) {
            e.printStackTrace()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        setFlashlight(false)
    }
}
