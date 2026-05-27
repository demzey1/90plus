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
        bool isHidden;
    }

    struct Prediction {
        bool submitted;
        Pick pick;
        uint256 submittedAt;
        uint256 points;
        uint256 tokenId;
    }

    struct UserStats {
        uint256 totalPoints;
        uint256 predictionCount;
        uint256 correctPredictions;
    }

    uint256 public nextMatchId = 1;
    uint256 public nextTokenId = 1;

    mapping(uint256 => MatchInfo) public matches;
    mapping(uint256 => mapping(address => Prediction)) public predictions;
    mapping(uint256 => address[]) private matchFans;
    mapping(address => UserStats) public userStats;

    event MatchCreated(uint256 indexed matchId, string homeTeam, string awayTeam, uint256 kickoffTime);
    event PredictionSubmitted(uint256 indexed matchId, address indexed fan, Pick pick, uint256 tokenId);
    event MatchFinalized(uint256 indexed matchId, uint8 homeScore, uint8 awayScore);
    event MatchHidden(uint256 indexed matchId);

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
            aiPrediction: aiPrediction,
            isHidden: false
        });
        emit MatchCreated(matchId, homeTeam, awayTeam, kickoffTime);
    }

    function submitPrediction(uint256 matchId, Pick pick) external {
        MatchInfo storage game = matches[matchId];
        require(game.exists && !game.finalized && block.timestamp < game.kickoffTime, "Invalid match");
        require(!predictions[matchId][msg.sender].submitted, "Already predicted");

        uint256 tokenId = nextTokenId++;
        predictions[matchId][msg.sender] = Prediction(true, pick, block.timestamp, 0, tokenId);
        matchFans[matchId].push(msg.sender);

        _safeMint(msg.sender, tokenId);
        userStats[msg.sender].predictionCount += 1;

        emit PredictionSubmitted(matchId, msg.sender, pick, tokenId);
    }

    function finalizeMatch(uint256 matchId, uint8 homeScore, uint8 awayScore) external onlyOwner {
        MatchInfo storage game = matches[matchId];
        require(game.exists && !game.finalized, "Invalid");

        game.finalized = true;
        game.homeScore = homeScore;
        game.awayScore = awayScore;

        Pick actualPick = (homeScore > awayScore) ? Pick.Home : (awayScore > homeScore) ? Pick.Away : Pick.Draw;

        address[] storage fans = matchFans[matchId];
        for (uint256 i = 0; i < fans.length; i++) {
            Prediction storage p = predictions[matchId][fans[i]];
            if (p.submitted && p.points == 0) {
                uint256 earned = (p.pick == actualPick) ? 10 : 0;
                p.points = earned;
                userStats[fans[i]].totalPoints += earned;
                if (earned > 0) userStats[fans[i]].correctPredictions += 1;
            }
        }
        emit MatchFinalized(matchId, homeScore, awayScore);
    }

    function hideMatch(uint256 matchId) external onlyOwner {
        MatchInfo storage game = matches[matchId];
        require(game.exists && game.finalized, "Invalid");
        game.isHidden = true;
        emit MatchHidden(matchId);
    }

    function getUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }
}
