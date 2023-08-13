// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./token/onft/extension/UniversalONFT721.sol";

/// @title A LayerZero UniversalONFT example
/// @notice You can use this to mint ONFT and send nftIds across chain.
///  Each contract deployed to a chain should carefully set a `_startMintIndex` and a `_maxMint`
///  value to set a range of allowed mintable nftIds (so that no two chains can mint the same id!)
contract SuperVibes is ONFT721 {
  uint public nextMintId;
  uint public maxMintId;

	struct VibeData {
		string message;
		string color;
		string title;
		uint256 chainId;
		address creator;
	}

  mapping(uint256 => VibeData) public vibes;

	constructor(
		uint256 _minGasToStore,
		address _layerZeroEndpoint,
		uint _startMintId,
		uint _endMintId
	)
		ONFT721("SuperVibesONFT721", "SUPERVIBES", _minGasToStore, _layerZeroEndpoint)
	{
    nextMintId = _startMintId;
    maxMintId = _endMintId;
  }

  function mint(
    address to,
    string calldata title,
    string calldata message,
    string calldata color
  ) public payable {

    require(nextMintId <= maxMintId, "Super Vibes: max mint limit reached on this chain");

    uint newId = nextMintId;

    vibes[newId].message = message;
    vibes[newId].color = color;
    vibes[newId].title = title;
    vibes[newId].chainId = block.chainid;
    vibes[newId].creator = msg.sender;

    // _safeMint(msg.sender, newId);
    _mint(to, newId);
    nextMintId++;

  }

	function getSvg(uint256 tokenId) public view returns (string memory) {
		_requireMinted(tokenId);
    string memory title = vibes[tokenId].title;
		string memory message = vibes[tokenId].message;
		string memory color = vibes[tokenId].color;

    return
			Base64.encode(
				abi.encodePacked(
          '<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="500" fill="',
          color,
          '"/><rect width="450" height="345" x="25" y="130" fill="#FFFFFF" fill-opacity="0.4"/>',
          '<text x="250" y="80" text-anchor="middle" font-size="40">',
          title,
          '</text><style>@import url("https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap");.bodyText{font-size:20px;font-weight:400;font-family:"Gloria Hallelujah", cursive;line-height:36px;text-align:center;color:#333;padding:2px 14px;}</style>',
          '<switch><foreignObject width="450" height="345" x="25" y="130"  class="bodyText" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><p>',
          message,
          '</p></foreignObject>',
          '<text x="250" y="220" text-anchor="middle" font-size="30" font-family="monospace">You got</text><text x="250" y="280" text-anchor="middle" font-size="60" font-family="monospace">',
          unicode"💌",
          '</text></switch></svg>'
				)
			);
	}

	function tokenURI(
		uint256 tokenId
	) public view override returns (string memory) {
		_requireMinted(tokenId);
		address sender = vibes[tokenId].creator;
		string memory svgData = getSvg(tokenId);
		string memory title = vibes[tokenId].title;
    string memory message = vibes[tokenId].message;
    uint256 chainId = vibes[tokenId].chainId;

		string memory json = Base64.encode(
			abi.encodePacked(
				'{"description":"',
        title,
        ' >>> ',
        bytes(message).length > 0 ? message : "",
        '","external_url":"https://super-vibes.vercel.app/","name":"Super Vibes #',
				Strings.toString(tokenId),
				'","attributes":[{"trait_type": "Sender","value":"',
				Strings.toHexString(uint160(sender), 20),
        '"},{"trait_type": "Chain ID","value":"',
        Strings.toString(chainId),
				'"}],"animation_url":"data:image/svg+xml;base64,',
				svgData,
				'","image":"data:image/svg+xml;base64,',
				svgData,
				'"}'
			)
		);
		return string(abi.encodePacked("data:application/json;base64,", json));
	}
}
