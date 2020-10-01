# stanford-data-journalism

## Setup process:

### It is highly recommended that you read or skim these instructions in full before starting. Please let Avi or Jonathan know if you need any help.

1. Check your email for an invite to the Firebase project, and accept it. Once you accept, you can access the Firebase project at [console.firebase.google.com](https://console.firebase.google.com). 
    * Firebase is a set of services on the Google Cloud platform for web and mobile development. In this project, two major Firebase services are used: [Cloud Functions](https://firebase.google.com/docs/functions), which is used to manage HTTP endpoints, and [Hosting](https://firebase.google.com/docs/hosting) which is used to easily connect a domain name to the project's back end environment and public files.
    * The project cannot simply be uploaded directly to the domain since this doesn't work for projects with server side code (most SCS web dev so far has been with projects that only require client-side resources). Right now, Firebase Hosting seems to be the easiest and cheapest way to get a back end deployed on a domain; setting this up for [the website we manage](https://www.geogenius.org) took around half an hour and our Firebase Hosting costs have been within free usage for over a year. However, if anyone wants to try a different framework, that's all well and good, especially if an alternative is desired after looking at [Firebase's pricing](https://firebase.google.com/pricing) for Cloud Functions and Hosting.
    
2. Follow [these instructions](https://nodejs.org/en/) to install Node.js.
    * Node.js is a Javascript based environment for server side development. It comes bundled with Node Package Manager (npm), which is the most commonly used package manager for Node.js development.
    * Jonathan uses Windows and added this advice for Windows users downloading npm:
      > When you click the link to download the npm installer, it will bring you to the author’s latest release. Under assets, there will be 2 zip files. I used nvm-setup.zip and it worked, so I'm not sure what the other one is for.
      
3. Open [these instructions](https://firebase.google.com/docs/cli). Depending on your device, follow the instructions to install the Firebase Command Line Interface (CLI). Make sure you choose the option to install it using npm, not via the standalone binary.
    * It should be the case that once you've installed Node.js, you can install the Firebase CLI with the terminal command: `npm install -g firebase-tools`.
    * The `-g` flag in the installs the package over your entire system so you shouldn't have to worry about where you run this command.
    
4. After installing the Firebase CLI, scroll down within the Step 3 instructions and follow the directions to login to the Firebase CLI.
    * This should be accomplished with the command `firebase login`. Once you run this command, you will be prompted to sign into your Google acccount, so make sure you're using the account from which you accepted the project invitation. It should not matter where on your device you run this command.
    
5. Create a directory on your machine for this project.
    * It is recommended that you make this directory in your root user folder, but any location should work.

6. Open a terminal from within the directory you created for this project. From this terminal, do the following:
    1. Enter the command `firebase init hosting`. It will prompt you to select from various options, for which you should respond:
        * Default project: From the list of options, select Stanford Data Journalism (the option listed may have different spacing or capitalization, this is fine).
        * Public folder: Choose the default name of "public".
        * Configure as single page app: No
    2. Enter the command `firebase init functions`. It will prompt you to select from various options, for which you should respond:
        * Language: JavaScript
        * ESLINT: Recommended not to. ESLINT is a JavaScript code analysis tool, but from experience its reccomendations can be somewhat strange at times.
        * Do you want to install dependencies with Node: Yes
 
7. Delete everything Firebase has placed in your project directory. The default resources could conflict with the imported files from Git.

8. Initialize Git in your project directory, configure your GitHub account if needed, add this repo as the remote origin, and pull.

9. Try running the project locally using the instructions below. It is almost certain that this will not work until you install the packages it tells you to. Follow the instructions to install these packages
      * The general syntax to install packages is to type `npm install package_name --save` in the terminal of the project directory.

10. You should now be good to go.

## How to run the project locally

Here are the [official instructions](https://firebase.google.com/docs/hosting/deploying#test-locally) for running a Firebase project locally.

1. Open a terminal in your project directory.

2. Enter the command `firebase serve`.

3. Look at the messages displayed to find out on what endpoint the project is running.
    * By default this should be [localhost:5000](http://localhost:5000).
    * Once you run the command, a message like the following should display, telling you where your project is running: `✔  hosting: Local server: http://localhost:5000`.
    * If you want it to run on a specific port other than the default, `firebase serve -p desired_port_number` should work.

4. If you want others to be able to experience your local changes as you make them, or want to test your project over HTTPS, ngrok is a great solution to easily port forward your local build onto a web endpoint. Here are the [directions](https://ngrok.com/download) to set it up and run it.

## How to deploy the project.

Before this can be done, Avi or Jonathan will need to walk you through connecting the domain to the Firebase project. Once that's done, the deployment process is quite simple (here are the [official instructions](https://firebase.google.com/docs/hosting/deploying#deploy)):

1. Make sure you have tested your changes thoroughly. Look at the above instructions for running your project locally if you need a reminder on how to do this.

2. Once you are ready to deploy, open a terminal in your project directory

3. Enter the command `firebase deploy -m "insert your deployment message here"`. This is quite similar to how you can add a commit message for Git. Once you enter this command, the project will start deploying to any domains it is connected to. Do not close the terminal or kill the process until the deployment is completed.

## Project architecture

* public --> Static client-side files, such as static HTML, CSS, and JavaScript that is sent to the end user.

* functions --> Files for dynamic aspects of the site, such as Node.js backend routing files and EJS templates (EJS is an HTML templating engine for easy integration with Node.js and is used to place dynamic content into HTML)

     * index.js --> Core file to which HTTP traffic is routed. Uses the Express package to match requests to responses.
     
     * views --> A directory containing all your EJS templates, which are essentially HTML files with a special markdown to allow infomation sent from the back end to be displayed.
     
     * package.json --> A sort of metadata for your Node.js environment, containing information like your Node version and the versions of packages you've installed.
     
     * package-lock.json --> A helper file generated automatically by Node.js when you work with packages.

* firebase.json --> Metadata for Firebase. The most important thing to note here is that through this file, all HTTP traffic is rerouted to "app" which is the HTTP cloud function in functions/index.js. In this way, this file reroutes HTTP traffic to the Node.js backend.
