"use client";

import { useState } from "react";
import { generateSHA1, encryptDES, decryptDES, generateRandomKey } from "@/lib/crypto-utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"sender" | "receiver">("sender");

  // --- SENDER STATE ---
  const [message, setMessage] = useState("");
  const [senderKey, setSenderKey] = useState(""); // Starts empty
  const [hash, setHash] = useState("");
  const [combined, setCombined] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [showSenderKey, setShowSenderKey] = useState(false);

  // --- "THE NETWORK" (Shared State) ---
  const [networkCipher, setNetworkCipher] = useState("");
  const [networkKey, setNetworkKey] = useState(""); // This simulates the exchanged key

  // --- RECEIVER STATE ---
  const [decryptedData, setDecryptedData] = useState("");
  const [receiverCalculatedHash, setReceiverCalculatedHash] = useState("");
  const [showReceiverKey, setShowReceiverKey] = useState(false);

  // Simulation: Sending data and the key over the "network"
  const handleTransfer = () => {
    if (!cipherText || !senderKey) {
      alert("Please encrypt the message and generate a key first!");
      return;
    }
    setNetworkCipher(cipherText);
    setNetworkKey(senderKey); // Key Exchange happens here!
    alert("Data and Key transferred to Receiver.");
    setActiveTab("receiver");
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-zinc-200">
        
        {/* Navigation */}
        <div className="flex bg-zinc-100 border-b">
          <button onClick={() => setActiveTab("sender")} className={`flex-1 py-4 font-bold ${activeTab === 'sender' ? 'bg-white border-b-2 border-blue-600' : ''}`}>SENDER</button>
          <button onClick={() => setActiveTab("receiver")} className={`flex-1 py-4 font-bold ${activeTab === 'receiver' ? 'bg-white border-b-2 border-blue-600' : ''}`}>RECEIVER</button>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === "sender" ? (
            <div className="space-y-4">
              {/* 1. Key Generation */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <button 
                  onClick={() => setSenderKey(generateRandomKey())}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-medium mr-4"
                >
                  Generate DES Key
                </button>
                <button onClick={() => setShowSenderKey(!showSenderKey)} className="text-sm underline">
                  {showSenderKey ? "Hide" : "Reveal"}
                </button>
                <div className="mt-2 font-mono text-blue-800">
                  Key: {showSenderKey ? senderKey || "(Generate first)" : "********"}
                </div>
              </div>

              {/* 2. Message & Hashing */}
              <input 
                className="w-full p-2 border rounded" 
                placeholder="Message..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
              />
              
              <button onClick={() => setHash(generateSHA1(message))} className="bg-zinc-800 text-white px-4 py-2 rounded w-full">
                1. Hash Message (SHA-1)
              </button>
              <div className="p-2 bg-zinc-100 font-mono text-xs break-all">Hash: {hash}</div>

              <button onClick={() => setCombined(`${message}|${hash}`)} className="bg-zinc-800 text-white px-4 py-2 rounded w-full">
                2. Combine (Msg + Hash)
              </button>

              <div className="flex-1 text-xs font-mono truncate bg-white p-2 border border-dashed border-zinc-300 rounded text-zinc-600">
                    {combined ? combined : "Message | Hash ..."}
                  </div>
                  
              <button onClick={() => setCipherText(encryptDES(combined, senderKey))} className="bg-zinc-800 text-white px-4 py-2 rounded w-full">
                3. Encrypt (DES)
              </button>
              <div className="p-2 bg-zinc-100 font-mono text-xs break-all text-red-600">Cipher: {cipherText}</div>

              <button onClick={handleTransfer} className="bg-green-600 text-white p-4 rounded w-full font-bold uppercase">
                Send to Receiver
              </button>
            </div>
          ) : (
            <div className="space-y-4">

              <section className="p-4 bg-red-50 border border-red-200 rounded-lg">
  <div className="flex justify-between items-center mb-2">
    <label className="text-xs font-bold text-red-600 uppercase">Incoming Network Data</label>
  </div>

  <textarea 
    className="w-full h-20 p-2 font-mono text-xs border rounded bg-white"
    value={networkCipher}
    onChange={(e) => setNetworkCipher(e.target.value)}
  />
</section>

              {/* Reveal Exchanged Key */}
              <div className="p-4 bg-zinc-50 border rounded-lg">
                <button onClick={() => setShowReceiverKey(!showReceiverKey)} className="bg-zinc-200 px-3 py-1 rounded text-sm mb-2">
                  Reveal Exchanged Key
                </button>
                <p className="font-mono">{showReceiverKey ? networkKey : "********"}</p>
              </div>

              <button 
                onClick={() => setDecryptedData(decryptDES(networkCipher, networkKey))}
                className="bg-zinc-800 text-white px-4 py-2 rounded w-full"
              >
                Decrypt Message
              </button>
              
              {decryptedData && (
                <div className="p-4 border rounded-lg bg-green-50">
                  <p className="text-xs font-bold">DECRYPTED RESULT:</p>
                  <p className="font-mono text-sm">{decryptedData}</p>
                  
                  <button 
                    onClick={() => {
                      const msgPart = decryptedData.split('|')[0];
                      setReceiverCalculatedHash(generateSHA1(msgPart));
                    }}
                    className="mt-4 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Verify Integrity (Re-Hash)
                  </button>
                </div>
              )}

              {receiverCalculatedHash && (
                <div className={`p-4 rounded-lg font-bold text-center ${receiverCalculatedHash === decryptedData.split('|')[1] ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {receiverCalculatedHash === decryptedData.split('|')[1] ? "✓ INTEGRITY OK" : "⚠ MESSAGE COMPROMISED"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}