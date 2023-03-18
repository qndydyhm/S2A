# S2A

## Add redirect URL
Open [Google Cloud console](https://console.cloud.google.com/welcome), click credentials, then add a new OAuth2 credential  
After that add a new **redirect URL**, for example http://localhost:4000/auth/google-callback (must end with /auth/google-callback)


## Create .env file
```
# Bash-like shell can use this command to create the file or manually create it following the instruction
# Becareful to replace all placeholders
cat << EOF || tee .env
PROTOCOL=http # redirect URL prorocol
DOMAIN_NAME=localhost # redirect URL domain name
EXPRESS_PORT=4000 # redirect URL port number
MONGO_URL=mongodb://127.0.0.1:27017 # replace with your mongo URL
MONGO_DBNAME=S2A # Any valid db name
CLIENT_ID=google client id
CLIENT_SECRET=google client secret
JWT_SECRET=any random string(ascii, no empty characters)
```

## Install dependencies
```
npm i
```

## Have fun!
```
npm start
```