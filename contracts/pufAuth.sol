pragma solidity >= 0.5.0;

contract pufAuth{
    
    uint8[32] firstChallenge = [0,1,1,1,0,1,0,0,0,0,1,1,1,0,0,1,1,1,1,0,0,0,1,0,1,0,0,1,0,1,0,0];
    uint8[32] firstResponse = [0,1,0,1,1,1,0,0,1,0,0,1,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,1,1,1];

    uint8[8] firstHelperData;
    uint8 firstBlockSum;
    uint8[32] newChallenge;
    uint8[32] newResponse;
    uint8[32] secondResponse;
    uint8[32] newXORResponse;
    uint8 secondBlockSum;
    uint8 m;
    uint8[8] blockDelta;
    uint8 errorBitLocation;
    uint8 falseResponseCounter = 0;
    uint id;
    address issuer;
    
    event pufApproval(bytes32 _newsecondResponseHash, uint _validId);
    event pufRejection(uint _invalidId);


    constructor() public {
        issuer = msg.sender;    
    }

    modifier isIssuer() {
        require(msg.sender == issuer);
        _;
    }
 
    function getChallenge() public view returns(uint8[32] memory){
        
        return firstChallenge;
        //emit getChallengebyUser(firstChallenge);
    }
    
    
    function helperDataExtraction(uint8 _m) public returns(uint8[8] memory){
        
        require(_m>=4, "Block Size must be greater than 4");
        firstHelperData[0] = 0;
        firstHelperData[1] = 0;
        firstHelperData[2] = 0;
        firstHelperData[3] = 0;
        firstHelperData[4] = 0;
        firstHelperData[5] = 0;
        firstHelperData[6] = 0;
        firstHelperData[7] = 0;
                
        m = _m;
        for (uint8 j=1; j<=(32/m); j++){
            for(uint8 i=1; i<=m; i++){
                firstBlockSum = i * firstResponse[((j-1)*m + i - 1)] + firstBlockSum;
            }
            firstHelperData[j-1] = (2*m + 1) - firstBlockSum%(2*m + 1);
            firstBlockSum = 0;
        }
        return firstHelperData;
    }
    
    function viewHelperDataExtraction() public view returns(uint8[8] memory){
        
        return firstHelperData;
    }
        
    function deltaCalculation(uint8[32] memory _secondResponse, 
                                                uint8[32] memory _newChallenge, 
                                                uint8[32] memory _newXORResponse,
						uint _id) public isIssuer{
                                                    
        require(falseResponseCounter < 3 , "Your response has more than ONE error");
        id = _id;
        secondResponse = _secondResponse;
        newChallenge = _newChallenge;
        newXORResponse = _newXORResponse;
        
        for (uint8 j=1; j<=(32/m); j++){
            for(uint8 i=1; i<=m; i++){
                secondBlockSum = i * secondResponse[((j-1)*m + i - 1)] + secondBlockSum;
            }
            blockDelta[j-1] = (secondBlockSum + firstHelperData[j-1]) % (2*m + 1);
            secondBlockSum = 0;
        }
    }
    
    function viewDeltaCalculation() public view returns(uint8[8] memory){
        
        return blockDelta;
    }
    
    function pufCorrection() public isIssuer{
        
      //  require(falseResponseCounter <= 1);
        for (uint8 j=1; j<=(32/m); j++){
            if (blockDelta[j-1] >= m){
                errorBitLocation = (2*m) + 1 - blockDelta[j-1];
                secondResponse[((j-1)*m) + errorBitLocation-1] = 1;
            }
            else if(blockDelta[j-1]<m){
                if (blockDelta[j-1] != 0){
                errorBitLocation = blockDelta[j-1];
                secondResponse[((j-1)*m) + errorBitLocation-1] = 0;
                }
            }
        }
    }
    
    function viewPufCorrection() public view returns(bytes32){
        
        return (keccak256(abi.encodePacked(secondResponse)));
    }
    
    function pufChecking() public isIssuer{
        
       // require(falseResponseCounter <= 1);
        if ((keccak256(abi.encodePacked(secondResponse))) == keccak256(abi.encodePacked(firstResponse))){
            for (uint8 k=1; k<=32; k++){
                newResponse[k-1] = newXORResponse[k-1] ^ firstChallenge[k-1];
            }
            firstChallenge = newChallenge;
            firstResponse = newResponse;
            falseResponseCounter = 0;
            emit pufApproval((keccak256(abi.encodePacked(secondResponse))), id);
        }
        else{
            falseResponseCounter++; 
            if (falseResponseCounter>2){
        	
		emit pufRejection(id);
            }
        }
    }

    function falseResponsesCounting() public view returns(uint8){

         return falseResponseCounter;
    }
    
    function viewPufChecking() public view returns(uint8[32] memory){

        return firstResponse;
    }

    
}
