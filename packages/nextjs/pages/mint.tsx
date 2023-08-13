import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { ContractData } from "~~/components/mint/ContractData";
import { ContractInteraction } from "~~/components/mint/ContractInteraction";

const MintUI: NextPage = () => {
  return (
    <>
      <MetaHeader
        title="Mint | Super Vibes 🎉"
        description="Mint personalized omnichain NFT cards and send to frens and loved ones"
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid flex-grow" data-theme="exampleUi">
        <ContractData />
      </div>
    </>
  );
};

export default MintUI;
