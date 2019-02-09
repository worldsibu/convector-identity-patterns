#!/bin/bash
set -e

export networkRootPath=$HOME/hyperledger-fabric-network

echo "Invoking Chaincode at org1"
export CORE_PEER_MSPCONFIGPATH=${networkRootPath}/artifacts/crypto-config/peerOrganizations/org1.hurley.lab/users/ChaincodeAdmin@org1.hurley.lab/msp
export CORE_PEER_ID=peer0.org1.hurley.lab
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_LOCALMSPID=org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=${networkRootPath}/artifacts/crypto-config/peerOrganizations/org1.hurley.lab/msp/tlscacerts/tlsca.org1.hurley.lab-cert.pem

${networkRootPath}/fabric-binaries/1.3.0/bin/peer chaincode invoke \
    -C ch1\
    -n participant\
    -c '{"Args":["participant_changeIdentity","1","randomID"]}'\
    -o localhost:7050\
    --cafile ${networkRootPath}/artifacts/crypto-config/ordererOrganizations/hurley.lab/orderers/orderer.hurley.lab/msp/tlscacerts/tlsca.hurley.lab-cert.pem

echo "Invoked Chaincode at org1"