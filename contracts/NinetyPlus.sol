// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NinetyPlus is ERC721, Ownable {
    enum Pick { Home, Draw, Away }

    struct MatchInfo {
        string homeTeam;
        string awayTeam;
        uint256 kickoffTime;
        bool exists;
        bool finalized;
        uint8 homeScore;
        uint8 awayScore;
        string aiPrediction;
    }

    struct Prediction {
        bool submitted;
        Pick pick;
        uint8 predictedHomeScore;
        uint8 predictedAwayScore;
        uint256 submittedAt;
        uint256 points;
        uint256 tokenId;
    }

    uint256 public nextMatchId = 1;
    uint256 public nextTokenId = 1;

    mapping(uint256 => MatchInfo) public matches;
    mapping(uint256 => mapping(address => Prediction)) public predictions;
    mapping(uint256 => address[]) private matchFans;
    mapping(address => uint256) public totalPoints;
    mapping(address => uint256) public predictionCount;

    event MatchCreated(uint256 indexed matchId, string homeTeam, string awayTeam, uint256 kickoffTime);
    event AiPredictionSet(uint256 indexed matchId, string aiPrediction);
    event PredictionSubmitted(uint256 indexed matchId, address indexed fan, Pick pick, uint8 predictedHomeScore, uint8 predictedAwayScore, uint256 tokenId);
    event MatchFinalized(uint256 indexed matchId, uint8 homeScore, uint8 awayScore);

    constructor() ERC721("90+ Prediction Ticket", "90T") Ownable(msg.sender) {}

    function createMatch(
        string calldata homeTeam,
        string calldata awayTeam,
        uint256 kickoffTime,
        string calldata aiPrediction
    ) external onlyOwner returns (uint256 matchId) {
        require(kickoffTime > block.timestamp, "Kickoff must be future");
        matchId = nextMatchId++;
        matches[matchId] = MatchInfo({
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            kickoffTime: kickoffTime,
            exists: true,
            finalized: false,
            homeScore: 0,
            awayScore: 0,
            aiPrediction: aiPrediction
        });
        emit MatchCreated(matchId, homeTeam, awayTeam, kickoffTime);
        emit AiPredictionSet(matchId, aiPrediction);
    }

    function submitPrediction(
        uint256 matchId,
        Pick pick,
        uint8 predictedHomeScore,
        uint8 predictedAwayScore
    ) external {
        MatchInfo storage game = matches[matchId];
        require(game.exists, "Match does not exist");
        require(block.timestamp < game.kickoffTime, "Prediction closed");
        require(!predictions[matchId][msg.sender].submitted, "Already predicted");

        uint256 tokenId = nextTokenId++;

        predictions[matchId][msg.sender] = Prediction({
            submitted: true,
            pick: pick,
            predictedHomeScore: predictedHomeScore,
            predictedAwayScore: predictedAwayScore,
            submittedAt: block.timestamp,
            points: 0,
            tokenId: tokenId
        });
        predictionCount[msg.sender] += 1;
        matchFans[matchId].push(msg.sender);

        _safeMint(msg.sender, tokenId);

        emit PredictionSubmitted(matchId, msg.sender, pick, predictedHomeScore, predictedAwayScore, tokenId);
    }

    function finalizeMatch(
        uint256 matchId,
        uint8 homeScore,
        uint8 awayScore
    ) external onlyOwner {
        MatchInfo storage game = matches[matchId];
        require(game.exists, "Match does not exist");
        require(!game.finalized, "Already finalized");

        game.finalized = true;
        game.homeScore = homeScore;
        game.awayScore = awayScore;

        Pick actualPick = Pick.Draw;
        if (homeScore > awayScore) actualPick = Pick.Home;
        else if (awayScore > homeScore) actualPick = Pick.Away;

        address[] storage fans = matchFans[matchId];
        for (uint256 i = 0; i < fans.length; i++) {
            Prediction storage p = predictions[matchId][fans[i]];
            if (p.submitted && p.points == 0) {
                uint256 earned = 0;
                if (p.pick == actualPick) earned += 10;
                if (p.predictedHomeScore == homeScore && p.predictedAwayScore == awayScore) earned += 20;
                p.points = earned;
                totalPoints[fans[i]] += earned;
            }
        }
        emit MatchFinalized(matchId, homeScore, awayScore);
    }

    function getMatch(uint256 matchId) external view returns (MatchInfo memory) {
        return matches[matchId];
    }

    function getPrediction(uint256 matchId, address fan) external view returns (Prediction memory) {
        return predictions[matchId][fan];
    }
}
