# Identity Patterns for Convector in Hyperledger Fabric

Identity on Convector is based on native patters from Fabric. [Read more here](https://hyperledger-fabric-ca.readthedocs.io/en/release-1.4/users-guide.html).

This repo includes an example of:

* Participants chaincode for shared references.
  * Fingerprint based registration of participants.
* ABAC-based authorization. [Read more](https://hyperledger-fabric-ca.readthedocs.io/en/release-1.4/users-guide.html#attribute-based-access-control)

Example:

## Basic concepts

### Identities in Fabric. [Read more here](https://hyperledger-fabric.readthedocs.io/en/release-1.4/identity/identity.html)

> The different actors in a blockchain network include peers, orderers, client applications, administrators and more. Each of these actors — active elements inside or outside a network able to consume services — has a digital identity encapsulated in an X.509 digital certificate. These identities really matter because they determine the exact permissions over resources and access to information that actors have in a blockchain network.

### Attribute-Based Access Control or ABAC [Read more](https://hyperledger-fabric-ca.readthedocs.io/en/release-1.4/users-guide.html#attribute-based-access-control)

> Access control decisions can be made by chaincode (and by the Hyperledger Fabric runtime) based upon an identity’s attributes. This is called Attribute-Based Access Control, or ABAC for short.

> In order to make this possible, an identity’s enrollment certificate (ECert) may contain one or more attribute name and value. The chaincode then extracts an attribute’s value to make an access control decision.

### Participant chaincode on Convector

> It is a common pattern to reflect a CA identity in a chaincode accessible way.
These identities do not replace Fabric identities, on the contraire, it leverages them to work in business use cases.

## Run the project

```bash
npm i

# Start your blockchain network
npm run env:restart

# Install the chaincode
npm run cc:start

# Register a special user with an attribute Admin
node ./packages/administrative/registerUser.js

# Hurley uses the Admin of org1 by default to run invoke requests
# Running the following command will enroll the user in the participants chaincode
hurl invoke participant -c '{"Args":["participant_register","1"]}'

# Get the recently created identity
hurl invoke participant -c '{"Args":["participant_get","1"]}'

# Try to update the participant and get an expected error since admin doesn't use the attribute `Admin`
hurl invoke participant -c '{"Args":["participant_changeIdentity","1","randomID"]}'
```

---

> Check all the information to work with Convector <a href="https://worldsibu.github.io/convector" target="_blank">in the DOCS site</a>.

## Collaborate to the Convector Suite projects

* <a href="https://discord.gg/twRwpWt" target="_blank">Discord chat with the community</a>
* <a href="https://github.com/worldsibu" target="_blank">Convector projects</a>
