 export const tagContractAddress ='0x36350b927DaBf60B7A13835592269Ce9dF7BdDbd'

 export const tagContractABI = ['function addUser(string memory _pname, string memory _oname, string memory _ptype, string memory _cid) public',
'function addDiagnosis (address _user , uint _medicalHistoryId , string memory _uriOfDiagnosis) public',
'function addMemory (address _user , uint _memoryId , string memory _uriOfMemory) public',
'function addEmergencyContacts( uint _tagId, address _contact1,  string memory currency) external',
'function updateTokenURI( uint tokenId, string memory URI) public',
'event NewTag (address indexed user,uint indexed tagId, address indexed account)',
 'event NewECAdded (uint indexed tagId,address contact1)',
 'event NewMedicalHistoryAdded (uint indexed tagId,address indexed user,uint indexed medicalid,address account)',
  'event NewMemoryAdded (uint indexed tagId,address indexed user,uint indexed memoryid,address account)'
]


export const USDCAddress = "0xd2dBA47c76592322DBdD9AF12278e24ef11C940D";
export const USDCABI = [
  // 'function transfer(address to, uint256 amount) external returns (bool)',
  "function approve(address spender, uint256 amount) public",
  "function mint() public"
];


//PET TAG 0xDA10147Ccd846046b4516f316f3A686Be07C1b32
//PET Record 0xAAeB19494E35EFBAdF1B4E65407A28ab1824c358