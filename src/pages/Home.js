import React,{useState,useEffect} from 'react';
import Game from './Game.png';
import like from './like.png';
import comment from './comment.png'
import buy from './buy.png'
import { Link } from "react-router-dom";
import "./Home.css";
import { useMoralis,account,isAuthenticated,useWeb3ExecuteFunction} from "react-moralis";
import { ConnectButton,TextArea} from "web3uikit";
const Home = () => {
  const { isAuthenticated, Moralis,account } = useMoralis();
  const [theFile,setTheFile]=useState()
  const [selectedFile,setSelectedFile]=useState()
  const [counter,setCounter]=useState(0)
  const [finalDisplay,setFinalDisplay]=useState(false)
  const [img,setImg]=useState()
  const [tweet,setTweet]=useState()
  const contractProcessor = useWeb3ExecuteFunction();
  const [displayTweet,setDisplayTweet]=useState({})
  const [showImg,setShowImg]=useState(true)
  const changeHandler = (event) => {
    
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };
  const tweety=(e)=>{
    setTweet(e.target.value)
  }
  const saveCount = async () => {
    const User = Moralis.Object.extend("_User");
    const query = new Moralis.Query(User);
    const myDetails = await query.first();
    const arr=myDetails.attributes.count;
    myDetails.set("count", arr+1);

}

const getCount=async ()=>{
    const User = Moralis.Object.extend("_User");
    const query = new Moralis.Query(User);
    const myDetails = await query.first();
    const arr=myDetails.attributes.count;
    setCounter(arr)
    console.log(arr);
}
  async function maticTweet() {

   
    let img;
    if (theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      img = file.ipfs();
    }else{
      img = "No Img"
    }

    let options = {
      contractAddress: "0x183013999babc7295a4d6965678c08a92a9a68e9",
      functionName: "addTweet",
      abi: [{
        "inputs": [
          {
            "internalType": "string",
            "name": "tweetTxt",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "tweetImg",
            "type": "string"
          }
        ],
        "name": "addTweet",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }],
      params: {
        tweetTxt: tweet,
        tweetImg: img,
      },
      
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        saveCount()
       alert('Saved on Polygon TestNet')
       setShowImg(false)
      },
      onError: (error) => {
        console.log(error.data.message)
      }
    });

  }
 
  async function maticTweety() {
    
   

      let options1 = {
        contractAddress: "0x183013999babc7295a4d6965678c08a92a9a68e9",
        functionName: "getTweet",
        abi: [{
          "inputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            }
          ],
          "name": "getTweet",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }],
        params: {
         id:counter
        },
        
      }
  
      await contractProcessor.fetch({
        params: options1,
        onSuccess: (result) => {
          let rv = {};
            rv.message = result[0];
            rv.image = result[1];
            rv.counter =parseInt(result[2]['_hex'],10)
            rv.account = result[3];
        
          let q1=result[2]['_hex']
          
          // console.log('number is'+parseInt(q1,10))
         
          setDisplayTweet(rv)
         setCounter(counter+1)
          
        
  
        
        
        },
        onError: (error) => {
          console.log(error.data.message)
        }
        
      });
  
    
    
  }

return(
  <>
  <div className="container">
   
   
  {isAuthenticated ?

  <div class="incontainer" >
    <div  class="nav" style={{'background':'linear-gradient(to right, rgb(200, 105, 200),rgb(237, 11, 211))','border-radius':'1em'}}>
    <button onClick={maticTweety} class="button-82-pushable" role="button">
  <span class="button-82-shadow"></span>
  <span class="button-82-edge"></span>
  <span class="button-82-front text">
  Expore
  </span>
</button>
  <ConnectButton/>
  </div>
  <br></br>
  <br></br>
  <br></br>
  <br></br>
  <div >
  <TextArea 
  label="Write"
  name="Write a Post here ✍️"
  onChange={tweety}
  placeholder="Write a Post here ✍️"
  
/>
</div>
<br></br>

    <input  type="file" onChange={changeHandler}></input>
    
  {selectedFile ?<div>
    {showImg &&  <img style={{'width':'20em','height':'15em'}} src={selectedFile}/>}
   
  </div>:<div></div>}
  <br></br>

 <div class="post">
 
<button onClick={maticTweet} class="button-82-pushable" role="button">
  <span class="button-82-shadow"></span>
  <span class="button-82-edge"></span>
  <span class="button-82-front text">
    Post
  </span>
</button>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<button onClick={maticTweet} class="button-82-pushable" role="button">
  <span class="button-82-shadow"></span>
  <span class="button-82-edge"></span>
  <span class="button-82-front text">
   Mint
  </span>
</button>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<br/>


</div>
<br></br>
<div style={{'border':'black solid 1px','width':'100%'}}></div>
    <br></br>
    <br></br>
    {displayTweet && displayTweet.account!=undefined ?

    <div class="upperview" style={{ 'background': 'linear-gradient(to right, rgb(100, 200, 228),rgb(237, 11, 211))'}}>
      <div class="viewleft">
      {displayTweet.account}
     
      <br/>
      <div style={{'background-color':'white'}}>
      {displayTweet.message}
      </div>
    <br/>
    <img style={{'width':'20em','height':'20em'}} src={displayTweet.image}/>
    </div>
    <div class="viewright" style={{'height':'10em'}}>
    <a href=""><img class="rightside" style={{'width':'2em','padding-top':'6em','margin-left':'-2em'}} src={buy}/></a>
      <img class="rightside" onClick={
        document.backgroundColor = 'red'
      } style={{'width':'2em','padding-top':'5em','margin-left':'-2em'}} src={like}/>
      <img class="rightside" style={{'width':'2em','padding-top':'5em','margin-left':'-2em'}} src={comment}/>
      
    </div>

    </div>:<div></div>}
    
    
  </div>:<div><div style={{'margin-left':'20em'}}>
  <img style={{'width':'30em'}} src={Game}/>
  <div style={{'margin-left':'10em'}}>
  <ConnectButton />
  </div>
  </div></div>

    
  }
  
  </div>
  </>
)
}

export default Home;
