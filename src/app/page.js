"use client"
import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Globe } from "lucide-react";
import { GameAlert } from "@/components/alert";
import { WordInput } from "@/components/input";
import { GuessGrid } from "@/components/guessGrid";
import { Select } from "@/components/ui/select";
import { CustomAlert } from "@/components/ui/customAlert";
import CryptoJS from "crypto-js";

export default function WordleGame() {
  const [secretWord, setSecretWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [keyStatus, setKeyStatus] = useState({});
  const [gameState, setGameState] = useState("playing");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const MAX_ATTEMPTS = 6;

  const decryptWord = (encryptedHex) => {
    try {
      const key = CryptoJS.enc.Base64.parse(process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
      const iv = CryptoJS.enc.Base64.parse(process.env.NEXT_PUBLIC_IV);

      // Convert hex to CryptoJS format
      const ciphertext = CryptoJS.enc.Hex.parse(encryptedHex);

      // Create CipherParams object
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext
      });

      // Decrypt
      const decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        key,
        { iv: iv }
      );

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  };

  // Memoize the fetchSecretWord function to prevent re-creating it on each render
  const fetchSecretWord = useCallback(async () => {
    try {
      const response = await fetch(`/api/secretWord?language=${language}`);
      if (!response.ok) throw new Error("Failed to fetch word");

      const { secretWord, kataRahasia } = await response.json();
      let decryptedWord;

      if (language === "en") {
        decryptedWord = decryptWord(secretWord); // Decrypt using the encryptedWord
      } else {
        decryptedWord = decryptWord(kataRahasia); // Decrypt using the encryptedKata for other languages
      }

      if (!decryptedWord) throw new Error("Failed to decrypt word");

      setSecretWord(decryptedWord.toUpperCase());
      setGameState("playing");
      setGuesses([]);
      setKeyStatus({});
      setMessage("");
    } catch (error) {
      console.error("Error fetching word:", error);
      setMessage("Failed to fetch word. Please try again.");
    }
  }, [language]);

  useEffect(() => {
    fetchSecretWord();
  }, [fetchSecretWord]); // This will run every time fetchSecretWord changes

  const handleGuess = (guess) => {
    if (gameState !== "playing") return;

    const upperGuess = guess.toUpperCase();
    if (upperGuess.length !== secretWord.length) {
      setMessage(`Guess must be ${secretWord.length} characters!`);
      return;
    }

    const newStatus = { ...keyStatus };
    const feedback = [...upperGuess].map((char, idx) => {
      if (char === secretWord[idx]) {
        newStatus[char] = "green";
        return { char, color: "green" };
      } else if (secretWord.includes(char)) {
        if (newStatus[char] !== "green") {
          newStatus[char] = "yellow";
        }
        return { char, color: "yellow" };
      } else {
        newStatus[char] = "gray";
        return { char, color: "gray" };
      }
    });

    const newGuesses = [...guesses, feedback];
    setGuesses(newGuesses);
    setKeyStatus(newStatus);

    if (upperGuess === secretWord) {
      setGameState("won");
      setMessage(language === "en" ? "Congratulations! You won! 🎉" : "Selamat! Anda menang! 🎉");
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameState("lost");
      setMessage(
        language === "en"
          ? `Game Over! The word was ${secretWord}`
          : `Permainan Selesai! Katanya adalah ${secretWord}`
      );
    }
  };

  const remainingAttempts = MAX_ATTEMPTS - guesses.length;

  const LanguageSelector = ({ language, setLanguage, fetchSecretWord, gameState }) => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(language);

    const handleLanguageChange = (newValue) => {
      if (gameState === "playing") {
        setSelectedLanguage(newValue);
        setAlertOpen(true);
      } else {
        setLanguage(newValue);
        fetchSecretWord();
      }
    };

    const confirmChange = () => {
      setLanguage(selectedLanguage);
      fetchSecretWord();
      setAlertOpen(false);
    };

    const cancelChange = () => {
      setAlertOpen(false);
    };

    return (
      <>
        <CustomAlert
          isOpen={alertOpen}
          message={
            language === "en"
              ? "Changing language will restart the game. Continue?"
              : "Mengubah bahasa akan memulai ulang permainan. Lanjutkan?"
          }
          onConfirm={confirmChange}
          onCancel={cancelChange}
        />
        <Select
          value={language}
          onValueChange={handleLanguageChange}
          className="bg-gray-800 text-white rounded-lg p-2"
        >
          <option value="en">English</option>
          <option value="id">Indonesia</option>
        </Select>
      </>
    );
  };


  return (
    <div className="flex flex-col items-center p-4 max-w-md mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {language === "en" ? "Word Guess" : "Tebak Kata"}
        </h1>
        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
          fetchSecretWord={fetchSecretWord}
          gameState={gameState}
        />


      </div>

      <GameAlert type={gameState} message={message} />

      <div className="mb-4 text-sm">
        {language === "en"
          ? `Attempts remaining: ${remainingAttempts}`
          : `Sisa percobaan: ${remainingAttempts}`}
      </div>

      <GuessGrid
        guesses={guesses}
        remainingAttempts={remainingAttempts}
        secretWordLength={secretWord.length}
      />

      <WordInput
        onGuess={handleGuess}
        keyStatus={keyStatus}
        secretWordLength={secretWord.length}
        disabled={gameState !== "playing"}
        language={language}
      />

      {gameState !== "playing" && (
        <button
          onClick={fetchSecretWord}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {language === "en" ? "Play Again" : "Main Lagi"}
        </button>
      )}
    </div>
  );
}
