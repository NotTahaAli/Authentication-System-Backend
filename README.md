# Backend for the Authentication System

[Link to Frontend Repository](https://github.com/NotTahaAli/Authentication-System-Frontend)

## How to Setup Test Environment

Note: You need to have NodeJS and NPM installed.

Note: You will also need to get credentials from various services such as Google Recaptcha v2, an SMTP provider, a database server and more. See Step 4 for the details.

1. Clone the repository using `git clone https://github.com/NotTahaAli/Authentication-System-Backend.git`
2. Run `npm install` to install all necessary packages.
3. Copy the `.env.template` file and rename to `.env` for server and `.env.test.template` to `.env.test` for automated testing
4. Populate the `.env` and `.env.test` files with the necessary environment variables.
    - If you want to run the https server, create a keys folder in the src directory and place "ca.pem" "cert.pem" and "key.pem" from your SSL certificate provider.
    - Leave the CORS URLs empty as the frontend sends all requests through serverside.
    - You will need to connect a [postgres database](https://www.postgresql.org/). It can either be locally hosted or remote.
        - citext entension is required. Enable by running this sql command

        ```sql
        CREATE EXTENSION citext;
        ```

        - to migrate to the database use `npm run migrate`
    - Get your Recaptcha Secret and Client ID from [This Link](https://www.google.com/recaptcha/admin/create)
        - Choose Recaptcha V2 and Checkbox.
        - Save the Client ID you will need it when setting up the frontend.
        - Alternatively you can use the following credentials to run in test mode.
            - `RECAPTCHA_SECRET="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"`
            - `RECAPTCHA_CLIENT_KEY="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"`
    - Set up anything as your JWT Secret. Do not share this with anyone. The more secure the better.
    - Get your OAuth Client ID and Secrets from the [Google APIs Console](https://console.developers.google.com/apis).
        - [Visit this link for a step by step guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
    - WebAuthn Configuration is for passkeys
        - Set up name of your choice
        - ID should ideally be the domain of your frontend server.
        - Origin is the Origin (Service + Domain + Port) of your frontend server.
    - You can get SMTP Credentials from any service.
        - You can get SMTP credentials from any service.
            - Setting the Service Name is optional.
            - Common Services that provide free SMTP servers are
                - [Gmail](https://mail.google.com)
                - [Outlook](https://outlook.office.com)
                - [Mailosaur](https://mailosaur.com/)
    - [Mailosaur](https://mailosaur.com/) API Key is required only for a single jest test to test if the SMTP server is working correctly. (This environment variable is entirely optional)
5. Run `npm run dev` to start a development server for Express with Nodemon.
6. Alternatively run `npm run test` to run automated jest testing (mainly unit tests, 1 integration test).
7. Visit <http://localhost:3000> to see the website in action.
8. Setup the frontend. [Refer to this on how to set up](https://github.com/NotTahaAli/Authentication-System-Frontend/blob/main/README.md)
