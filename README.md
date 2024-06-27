# To install expo and run the app the FIRST time follow these steps
[https://byui-cit.atlassian.net/wiki/spaces/CyberSecurity/pages/18448385/Installing+EXPO+and+running+the+STEDI+Mobile+App]

# After installing, to run the app locally run this command
`npx expo start --tunnel --dev-client`

To do an IOS Testflight build:

`npx eas-cli build --profile production --platform ios`

To do a dev client build:
`npm run build-ios-apple-developer`

When the build finishes, open the Transporter app on a Mac to upload to Testflight