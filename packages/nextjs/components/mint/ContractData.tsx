import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { useAccount } from "wagmi";
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

const MARQUEE_PERIOD_IN_SEC = 5;

export const ContractData = () => {
  const { address } = useAccount();

  const [to, setTo] = useState(address);
  const [emoji, setEmoji] = useState("🎉");
  const [message, setMessage] = useState("Hey, congratualations on your submission");
  const [color, setColor] = useState("bg-[#6ed8fa]"); // s.slice(4, -1)
  const [charCount, setCharCount] = useState(message.length);

  const containerRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // update char count (including whitespaces)
    setCharCount(message.length);
  }, [message]);

  const { data: totalCounter } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "totalCounter",
  });

  // contract.mint("0xa0ad7474Ab1C4E8035e221f329758EB672cAD32E", "🎉", "hola, congrats!", "#F13FAA")).wait()
  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "SuperVibes",
    functionName: "mint",
    value: "0.00",
    args: ["0xa0ad7474Ab1C4E8035e221f329758EB672cAD32E", "🎉", "hola, congrats!", "#F13FAA"],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { data: currentGreeting, isLoading: isGreetingLoading } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "greeting",
  });

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "GreetingChange",
    listener: logs => {
      logs.map(log => {
        const { greetingSetter, value, premium, newGreeting } = log.args;
        console.log("📡 GreetingChange event", greetingSetter, value, premium, newGreeting);
      });
    },
  });

  const {
    data: myGreetingChangeEvents,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "GreetingChange",
    fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n,
    filters: { greetingSetter: address },
    blockData: true,
  });

  console.log("Events:", isLoadingEvents, errorReadingEvents, myGreetingChangeEvents);

  const { data: yourContract } = useScaffoldContract({ contractName: "YourContract" });
  console.log("yourContract: ", yourContract);

  const handleTextArea = e => {
    //console.log({ e }) // Destructure to get a more accurate log 

    // Return if user presses the enter key
    if (e.nativeEvent.inputType === "insertLineBreak") return;
    if (e.target.value.length > 160) return;

    setMessage(e.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-200 py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
      <div className={`flex flex-col max-w-md ${color} shadow-lg px-5 py-4 w-full h-80`}>
        <div className="mt-4 text-5xl self-center">{emoji}</div>
        <div className="mt-4 mb-4 p-4 h-full border-gray-100 bg-neutral bg-opacity-30 text-black-700 overflow-hidden whitespace-nowrap w-full font-bai-jamjuree">
          <div className="relative overflow-x-hidden" ref={containerRef}>
            <textarea
              className="px-4 py-4 w-full h-[120px] border-0 bg-transparent break-words"
              value={`${message || " "}`}
              onChange={e => handleTextArea(e)}
              placeholder="enter your personalized message here"
            />
          </div>
        </div>
        <div className="text-sm self-end">{charCount} / 160</div>
      </div>

      <div className="flex flex-col mt-1 px-4 py-2 max-w-md w-full">
        <div className="text-sm mb-1">To:</div>
        <input
          className="px-2 py-2"
          type="text"
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder="0x0..."
        />
      </div>

      <div className="flex flex-col mt-1 px-4 py-2 max-w-md w-full">
        <div className="text-sm mb-1">Choose vibe emoji:</div>
        <div className="mt-3 flex items-start">
          {/* 🎉 👏 💖 🎄 🐣 */}
          <button className="w-10 h-10 shadow bg-neutral text-2xl mr-4" onClick={() => setEmoji("🎉")}>🎉</button>
          <button className="w-10 h-10 shadow bg-neutral text-2xl mr-4" onClick={() => setEmoji("👏")}>👏</button>
          <button className="w-10 h-10 shadow bg-neutral text-2xl mr-4" onClick={() => setEmoji("💖")}>💖</button>
          <button className="w-10 h-10 shadow bg-neutral text-2xl mr-4" onClick={() => setEmoji("🎄")}>🎄</button>
          <button className="w-10 h-10 shadow bg-neutral text-2xl mr-4" onClick={() => setEmoji("🐣")}>🐣</button>
          <button className="w-10 h-10 shadow bg-neutral text-2xl mr-4" onClick={() => setEmoji("🍻")}>🍻</button>
        </div>
      </div>
      <div className="flex flex-col mt-1 px-4 py-2 max-w-md w-full">
        <div className="text-sm mb-1">Choose color:</div>
        <div className="mt-3 flex items-start">
          {/* #daf7a1 #ffcc00 #c9df56 #6ed8fa */}
          <button className="w-10 h-10 shadow bg-[#daf7a1] mr-4" onClick={() => setColor("bg-[#daf7a1]")} />
          <button className="w-10 h-10 shadow bg-[#ffcc00] mr-4" onClick={() => setColor("bg-[#ffcc00]")} />
          <button className="w-10 h-10 shadow bg-[#c9df56] mr-4" onClick={() => setColor("bg-[#c9df56]")} />
          <button className="w-10 h-10 shadow bg-[#6ed8fa] mr-4" onClick={() => setColor("bg-[#6ed8fa]")} />
          <button className="w-10 h-10 shadow bg-[#ffcee0] mr-4" onClick={() => setColor("bg-[#ffcee0]")} />
          <button className="w-10 h-10 shadow bg-[#8ca0ff] mr-4" onClick={() => setColor("bg-[#8ca0ff]")} />
        </div>
      </div>
      <div className="flex flex-col mt-10 px-4 py-2 max-w-md w-full">
        <button className="btn btn-primary rounded-full px-10 self-center" onClick={() => writeAsync()}>Send this Super Vibe now 🎉</button>
      </div>
    </div>
  );
};
