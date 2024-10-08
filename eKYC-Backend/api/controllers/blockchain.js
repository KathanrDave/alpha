const { Web3 } = require('web3');
const adminAddress = process.env.ADMIN_ADDRESS;
const adminKey = process.env.ADMIN_KEY;

// Corrected instantiation of Web3 with an HTTP provider
const web3 = new Web3("https://rpc-amoy.polygon.technology/");

const conc = require("./contractInstance.js");

module.exports.getDetails = async (kycId) => {
  const data = await conc.methods.getCustomerDetails(kycId).call({ from: adminAddress });
  return data;
};

module.exports.getReqList = async (kycId) => {
  const data = await conc.methods.getClientData(kycId).call({ from: adminAddress });
  return data;
};

module.exports.handelRequest = async (kycId, bAddress, response) => {
  const netId = await web3.eth.net.getId();

  const tx = conc.methods.manageRequest(kycId, bAddress, response);
  const gas = await tx.estimateGas({ from: adminAddress });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(adminAddress);

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: conc.options.address,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: netId,
    },
    adminKey
  );

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
};

module.exports.registerCustomer = async (formData, kycId) => {
  const netId = await web3.eth.net.getId();

  const tx = conc.methods.addCustomer(
    formData.name,
    formData.phone,
    formData.address,
    formData.gender,
    formData.dob,
    formData.PANno,
    kycId,
    formData.geo,
    formData.selfieIPFS,
    formData.aadharIPFS,
    formData.panIPFS
  );

  const gas = await tx.estimateGas({ from: adminAddress });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(adminAddress);

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: conc.options.address,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: netId,
    },
    adminKey
  );

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
};

module.exports.updateRecordBC = async (kycId, record_type, record_data) => {
  const netId = await web3.eth.net.getId();
  const tx = conc.methods.updateRecord(kycId, record_type, record_data);

  const gas = await tx.estimateGas({ from: adminAddress });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(adminAddress);

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: conc.options.address,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: netId,
    },
    adminKey
  );

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
};
