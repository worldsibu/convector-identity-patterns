# Identity Patterns for Convector in Hyperledger Fabric

Identity on Convector is based on native patters from Fabric. [Read more here](https://hyperledger-fabric-ca.readthedocs.io/en/release-1.4/users-guide.html).

This repo includes an example of:

* Participants chaincode for shared references in business chaincodes.
  * Fingerprint based registration of participants.
* ABAC-based authorization in the participant for Admin tasks like updating the x509 identity after a identity had to be updated. [Read more](https://hyperledger-fabric-ca.readthedocs.io/en/release-1.4/users-guide.html#attribute-based-access-control)
* A business chaincode called "product-cc" that leverages this identity pattern.

![Pattern illustration](images/identityExample.png?raw=true "Identity Pattern")

## TL;DR;

* Create a bundled chaincode with **participant** management as well a **products** chaincode.
* Create a identity in the **participant** chaincode and learn how to use ABAC for certificate lifecycle management.
* Update the current x509 to emulate a cert revokation or re-enroll of a certificate without losing access to your assets.
* Create a new product.
* Try to make requests with unauthorized user.
* Update the participant with the right identity again and try to make update again.
* Retrieve the product with changes.

## Basic concepts

### Identities in Fabric. [Read more here](https://hyperledger-fabric.readthedocs.io/en/release-1.4/identity/identity.html)

> The different actors in a blockchain network include peers, orderers, client applications, administrators and more. Each of these actors — active elements inside or outside a network able to consume services — has a digital identity encapsulated in an X.509 digital certificate. These identities really matter because they determine the exact permissions over resources and access to information that actors have in a blockchain network.

### Attribute-Based Access Control or ABAC [Read more](https://hyperledger-fabric-ca.readthedocs.io/en/release-1.4/users-guide.html#attribute-based-access-control)

> Access control decisions can be made by chaincode (and by the Hyperledger Fabric runtime) based upon an identity’s attributes. This is called Attribute-Based Access Control, or ABAC for short.

> In order to make this possible, an identity’s enrollment certificate (ECert) may contain one or more attribute name and value. The chaincode then extracts an attribute’s value to make an access control decision.

### Participant chaincode on Convector

This section references to `/packages/participant-cc/src` and `packages/product-cc/src` source code from the participant chaincode.

> In this case both chaincodes get bundled into one called `identities` through the file `./org1.identities.config.json` in the "Controllers" section. This pattern allows you to develop each part independently but when deploying keep them in the same package.

It is a common pattern to reflect a CA identity in a chaincode accessible way.
These identities do not replace Fabric identities, on the contraire, it leverages them to work in business use cases.

The logic is - the user/identity is a Fabric CA identity with all the benefits a Certificate Authority can bring regarding enrollment, revokation and so on. The `participant-cc` chaincode allows you to reflect "that" identity in the ledger so that you can do things like access control. For example, just `identityA` from `Walmart` can approve a transaction.

```ts
@ReadOnly()
public readonly type = 'io.worldsibu.examples.participant';

@ReadOnly()
@Required()
@Validate(yup.string())
public name: string;

// This will allows us to let a user with the right ABAC config to update the identity
// Kind of like letting the admin of an org to update the certificate identity
@ReadOnly()
@Validate(yup.string())
public msp: string;
// Certificate fingerprints allowed for one identity
// When a request arrives and you check the `this.sender` inside of a chaincode you can
// compare that value against a model property, for example `if(product.createdBy===this.sender){ product.updated=true; await product.save(); }`
@Validate(yup.array(x509Identities))
public identities: x509Identities[];
```

This example also combines the `ABAC` pattern from Fabric when for example an identity (x509 cert) changes for one user (after revokation for example). If an user from the same MSP and with the attribute `admin` tries to call `changeIdentity` the chaincode will disable previous authenticated certs and will enable a new identity sent by parameters. This provides management and scalability for your identities.

For this example we will create an identity called `IdentitiesManager`. It will have the permissions to make changes to a participant chaincode throught the `changeIdentity` function in the controller. We enroll it by calling `packages/administrative/registerIdentitiesManager.js` for reference it will be called `chaincodeAdmin`.

### How to leverage the `participant-cc` in the business chaincode `product-cc`

When a business chaincode (not related to identities) uses the participant chaincode, all it has to do is reference an existing identity there to decide if applies or not changes.

For this end we added on this example the `product-cc` chaincode.

The way we achieve this is by calling the `participant-cc` from the `product-cc`. Since we will be referencing an ID even though the x509 identity may vary in time, if we keep it updated in the respective participant model, the application will continue to work.

```ts
const owner = await Participant.getOne(product.assetOwner);
const ownerCurrentIdentity = owner.identities.filter(identity => identity.status === true)[0];
if (ownerCurrentIdentity.fingerprint === this.sender) {
    console.log('Identity can update product');
    await product.save();
} else {
    throw new Error(`Identity is not allowed to update product just ${owner.name} can`);
}
```

## Run the project

```bash
npm i

# Start your blockchain network
npm run env:restart

# Install the chaincode
npm run cc:start

# Register a special user with an attribute Admin
node ./packages/administrative/registerIdentitiesManager.js

# Attach to the chaincode container logs.
# If you upgraded the chaincode, change the '1.0' to the actual version or do `docker ps` and find the right name for the container
docker logs -f dev-peer0.org1.hurley.lab-identities-1.0

# Hurley uses the Admin of org1 by default to run invoke requests
# Running the following command will enroll the user in the participants chaincode
hurl invoke identities -c '{"Args":["participant_register","user1"]}'

# Get the recently created identity
hurl invoke identities -c '{"Args":["participant_get","user1"]}'

# Try to update the participant
# You will get an expected error since the user Hurley uses by default to make the request doesn't use have the `admin` in its `attrs` fields. Expected error "Unathorized. Requester identity is not an admin"
hurl invoke identities -c '{"Args":["participant_changeIdentity","user1","randomID"]}'

# Now make a request with the identity that has the flag `admin` therefore is authorized to make updates!
# Hurley up to 0.4.28 does not support changing the identity making requests, since that usually happens at the application level, so we use the chaincode manager from Convector.
# Change random id for a valid x509 fingerprint in your real application.
./node_modules/.bin/chaincode-manager --config ./org1.identities.config.json invoke identities participant changeIdentity "user1" "randomID" --user chaincodeAdmin

# Get the recently updated identity to reflect changes
hurl invoke identities -c '{"Args":["participant_get","user1"]}'

# Create a product assinging the participant with the ID 1 as the asset owner
hurl invoke identities -c '{"Args":["product_create","prod1","pineapples hello","user1"]}'

# Get that product
hurl invoke identities -c '{"Args":["product_get","prod1"]}'

# Make an update request with the x509 (identity) from the user 1
# By default the call will be made with the x509 of the Admin identity of org1 (the one we enrolled previously)
# This should return an error! Because we updated the current identity of it to `randomID` which is NOT the fingerprint of a valid cert
./node_modules/.bin/chaincode-manager --config ./org1.identities.config.json invoke identities product update "prod1" "pineapples hello2modified" --user admin

# Let's go back to the participant chaincode and set the x509 identity through `changeIdentity` to the valid x509 identity
# In your real application this can be automated
node -e "console.log(JSON.parse(require('fs').readFileSync(require('path').resolve(require('os').homedir(), 'hyperledger-fabric-network/.hfc-org1/admin'), 'utf8')).enrollment.identity.certificate)" | openssl x509 -fingerprint -noout | cut -d '=' -f2 ;

# The result will look like: 6C:B0:F8:D8:1B:08:3F:BA:18:F7:8B:6E:AB:77:53:97:C1:2F:71:14
# Copy the value and paste it where it says "actualIdentity"
./node_modules/.bin/chaincode-manager --config ./org1.identities.config.json invoke identities participant changeIdentity "user1" "actualIdentity" --user chaincodeAdmin

# Get the participant again to see that your changes were applied successfully
hurl invoke identities -c '{"Args":["participant_get","user1"]}'

# Make the call again and successfully update the product
./node_modules/.bin/chaincode-manager --config ./org1.identities.config.json invoke identities product update "prod1" "pineapples hello2modified" --user admin

# Get that product again!
hurl invoke identities -c '{"Args":["product_get","prod1"]}'
```

> The reason why this example uses `./node_modules/.bin/chaincode-manager` instead of Hurley is because Hurley is meant to be used for network management matters therefore its current identity is always admin. On the other hand `chaincode-manager` allows for more flexible identity management to emulate your application. In future releases Hurley may support more advanced settings like identity changes just like `chaincode-manager`. Either way, in your application how you manage identities is up to you through Convector or Fabric SDK.
---

> Check all the information to work with Convector <a href="https://worldsibu.github.io/convector" target="_blank">in the DOCS site</a>.

## Collaborate to the Convector Suite projects

* <a href="https://discord.gg/twRwpWt" target="_blank">Discord chat with the community</a>
* <a href="https://github.com/worldsibu" target="_blank">Convector projects</a>
