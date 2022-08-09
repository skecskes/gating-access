import {ethers} from "ethers";
import {useState} from "react";
import './App.css';
import Content from "./components/Content";
// we don't need exact ABIs, we just use the erc standard functions.
import abi721 from "./utils/abi721.json";
import abi1155 from "./utils/abi721.json"

// Prosocialites contract (example contract to be gated)
const contractAddress = "0x9e2ed21ba652022d00affe85ac3bf7ada7dc87a6";

function App() {
    const [address, setAddress] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [contract, setContract] = useState("");
    const {ethereum} = window;
    const handleWalletConnect = async () => {
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            await provider.send("eth_requestAccounts", [])
            const signer = provider.getSigner()
            const myAddress = await signer.getAddress()
            setAddress(myAddress);
            let nftContract = new ethers.Contract(contractAddress, abi1155, signer)
            let balance = 0
            // TODO: figure out the unique count of tokens in 1155. There is no single call solution.
            // TODO: For example https://etherscan.io/address/0x3edf71a31b80ff6a45fdb0858ec54de98df047aa#readContract has 1587 unique tokens, each with 1 quantity.
            // TODO: for now I hardcoded gating to first 5 tokens for 1155.
            const unique1155Count = 5
            setContract("1155")
            // first lets check if contract is 1155 and has `balanceOfBatch` function, otherwise handle it in catch block as 721 contract
            try {
                const addresses = Array(unique1155Count).fill(myAddress);
                const tokenIds = [...Array(unique1155Count).keys()];
                balance = await nftContract.balanceOfBatch(addresses, tokenIds);
            } catch (e) {
                console.log(e)
                nftContract = new ethers.Contract(contractAddress, abi721, signer);
                setContract("721")
                try {
                    balance = await nftContract.balanceOf(myAddress);
                } catch (e) {
                    console.log(e)
                    setContract("unknown")
                    // this is nor 1155 neither 721, therefore no access
                }
            }
            if (Number(balance.toString()) > 0) setIsAuthorized(true)
        } else {
            alert('you need to install metamask')
        }
    }
    return (
        <div className="App">
            <header className="App-header">
                {address ? (
                    <Content isAuthorized={isAuthorized} contract={contract}/>
                ) : (
                    <button onClick={() => handleWalletConnect()}>Connect Wallet</button>
                )}
            </header>
        </div>
    );
}

export default App;
