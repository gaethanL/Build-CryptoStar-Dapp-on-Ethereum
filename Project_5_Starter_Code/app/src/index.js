import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,
  accountTest: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
     
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  putStarUpForSale:async function() {
  
    const { putStarUpForSale } = this.meta.methods;
    const price = document.getElementById("starPrice").value;
    const id = document.getElementById("Id").value;
    await putStarUpForSale(id, price).send({from: this.account});
    App.setStatus("Star "+id+" is for sale from " + this.account + ".");
  },
  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
  transferStar: async function() {
    const { transferStar } = this.meta.methods;
    const to = document.getElementById("to").value;
    const idS = document.getElementById("idS").value;
    await transferStar(to,idS).send({from: this.account});
    App.setStatus("Star send to"+to+ ".");
  },
  buyStar: async function() {
    const { buyStar } = this.meta.methods;
    const idStars = document.getElementById("idStars").value;
    const buyPrice = document.getElementById("buyPrice").value;
    await buyStar(idStars).send({from: this.account});
    App.setStatus("The Star Buyer is "+ ".");
  },
  lookUp: async function (){
    const { lookUptokenIdToStarInfo } = this.meta.methods;
    const idU = document.getElementById("lookid").value;
    let name = await lookUptokenIdToStarInfo(idU).call();
    let owner = JSON.stringify(name[1]);
    let nameStar = JSON.stringify(name[0]);
    App.setStatus(`The name of star#${idU} is: ${nameStar} the owner is ${owner}.`)
  },
  createStar: async function() {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    await createStar(name, id).send({from: this.account});
    App.setStatus("New Star Owner is " + this.account + ".");
  }

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"),);
  }

  App.start();
});
