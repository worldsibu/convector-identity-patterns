
# Start your blockchain network
npm run start

# Patch the org1.identities.config.json with the right home path
node ./packages/administrative/update-paths.js

# Install the chaincode
npm run cc:start

# Register a special user with an attribute Admin
node ./packages/administrative/registerIdentitiesManager.js


# Hurley uses the Admin of org1 by default to run invoke requests
# Running the following command will enroll the user in the participants chaincode
hurl invoke identities participant_register "user1" "User 1"

# Get the recently created identity
hurl invoke identities participant_get "user1"

# Try to update the participant
# You will get an expected error since the user Hurley uses by default to make the request doesn't use have the `admin` in its `attrs` fields. Expected error "Unathorized. Requester identity is not an admin"
hurl invoke identities participant_changeIdentity "user1" "randomID"

# Now make a request with the identity that has the flag `admin` therefore is authorized to make updates!
# Change random id for a valid x509 fingerprint in your real application.

hurl invoke identities participant_changeIdentity "user1" "randomID" -u chaincodeAdmin

# Get the recently updated identity to reflect changes
hurl invoke identities participant_get "user1"

# Create a product assinging the participant with the ID 1 as the asset owner
hurl invoke identities product_create "prod1" "pineapples hello" "user1" -u user1

# Get that product
hurl invoke identities product_get "prod1"

# Make an update request with the x509 (identity) from the user1
# This should return an error! Because we updated the current identity of it to `randomID` which is NOT the fingerprint of a valid cert
hurl invoke identities product_update "prod1" "pineapples hello2modified" --user user1

# Let's go back to the participant chaincode and set the x509 identity through `changeIdentity` to the valid x509 identity
# In your real application this can be automated
node -e "console.log(JSON.parse(require('fs').readFileSync(require('path').resolve(require('os').homedir(), 'hyperledger-fabric-network/.hfc-org1/user1'), 'utf8')).enrollment.identity.certificate)" | openssl x509 -fingerprint -noout | cut -d '=' -f2 ;

# The result will look like: 6C:B0:F8:D8:1B:08:3F:BA:18:F7:8B:6E:AB:77:53:97:C1:2F:71:14
# Copy the value and paste it where it says "actualIdentity"
hurl invoke identities participant_changeIdentity "user1" "actualIdentity" --user chaincodeAdmin

# Get the participant again to see that your changes were applied successfully
hurl invoke identities participant_get "user1"

# Make the call again and successfully update the product
hurl invoke identities product_update "prod1" "pineapples hello2modified" --user user1

# Get that product again!
hurl invoke identities product_get "prod1"

# Register another user
hurl invoke identities participant_register "user2" "User 2" --user user2

# Transfer asset to user2
hurl invoke identities product_transfer "prod1" "user2" --user user1

# Try to update it with an expected error since this is not the owner anymore
hurl invoke identities product_update "prod1" "pineapples another change" --user user1

# Now do it with the actual owner
hurl invoke identities product_update "prod1" "pineapples another change" --user user2

# Get it again to see the change
hurl invoke identities product_get "prod1"