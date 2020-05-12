# README

On this examples we can test to deploy an AWS Lambda function which will have a NLPjs engine and we will interact with it through HTTP requests to an endpoint.

With the explanations we will reproduce the process to have the examples contained here.

The first one, on directory named **`nlpjs-lambda`**, is the simplest. The second, on directory named **`nlpjs-lambda-with-DynamoDB`** takes as base the first one and, instead to store the data on a file, stores the data on a database DynamoDB. The main diffference between them are som aspects on the configuration represented on file **`template.yaml`** and the source code of the file **`engine.js`**.

>**THE EXPLANATIONS BELOW WILL REFER TO THE FIRST EXAMPLE UNTIL THEY REFER TO THE SECOND.**

## PRE-REQUIREMENTS

To have installed Docker:

- [Windows](https://docs.docker.com/docker-for-windows/install/)
- [MacOS](https://docs.docker.com/docker-for-mac/)
- Linux
  - [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
  - [CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)
  - [Fedora](https://docs.docker.com/install/linux/docker-ce/fedora/)
  - [Debian](https://docs.docker.com/install/linux/docker-ce/debian/)

## SETUP DEVELOPMENT ENVIRONMENT

First at all it is required to install [SAM CLI (Serveless Application Model Command Line Interface)](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) in one of its flavors:

- [Linux](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-linux.html)
- [Windows](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-windows.html)
- [MacOS](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html). If you have already [installed Brew](https://docs.brew.sh/Installation), then you can execute next commands on a terminal:
  - $ \> `brew tap aws/tap`
  - $ \> `brew install aws-sam-cli`
  - $ \> `sam --version` (**you will see the current version installed**)

Now, you need to setup your credentials top allow **SAM CLI** commands to interact with your accounts and services on AWS. You will find all the detailed information on the [documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-set-up-credentials.html). Of one of the alternatives, you can setup them on a file which must be at indicated path:

- $ \> `mkdir -p ~/.aws`
- $ \> `vi` **`~/.aws/credentials`**

    ```properties
    [default]
    aws_access_key_id = your_access_key_id
    aws_secret_access_key = your_secret_access_key
    ```

### MAKING THE LIVE EASY

Additionally you will need to execute some commands related to AWS CLI. Instead to install and configure another tool, you can have it _installed_ with a Docker image. Execute next command:

- `docker pull amazon/aws-cli`

Now, you can define the alias inside usual files related to profile on your system if it supports:

- alias aws='docker run --rm -ti -v ~/.aws:/root/.aws -v $(pwd):/aws amazon/aws-cli'

On Windows you must to install the tool or remember all this command and apply it as a substitution each time you read the command "**`aws`**" on this document.

Another valid trick on all platforms is to compose a script and put it on some place available on the PATH:

**`Linux/MacOS`**

```shell
#!/bin/bash

docker run --rm -ti -v ~/.aws:/root/.aws -v $(pwd):/aws amazon/aws-cli $*
```

**`Windows`**

```shell
@echo off

docker run --rm -ti -v <your home path where the '.aws' directory is>/.aws:/root/.aws -v $(pwd):/aws amazon/aws-cli $*
```

## CREATE A PROJECT

On this example we will use NodeJs (Javascript) as tech stack and we will follow (more or less) the [published guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html). You can see a lot of [examples published on a "official" repository](https://github.com/aws-samples/serverless-app-examples/tree/master/javascript).

### Steps to generate project

Executing the wizard:

- $ \> `sam init`
  - [SELECT OPTION] \> `AWS Quick Start Templates`
  - [SELECT OPTION] \> `nodejs12.x`
  - [WRITE A VALUE] \> `the_project_name`

Or as a direct command:

- $ \> `sam init -r nodejs12.x -d npm -n the_project_name --app-template hello-world`

and then:

- $ \> `docker pull lambci/lambda:nodejs12.x`
- $ \> `cd the_project_name`

So now we have "a base".

## CONFIGURE THE PROJECT

If we inspect the contents of the directory we will see a full example, named "hello-world" that we can take as an example to create our lambda-function-service.

On the file **`README.md`** we will found a lot of useful information, incuding information about of the build and deploy precesses.

First at all we can see the content of the file **`template.yaml`**, one of the most important ones. Inside we can see how to define a serverless function. Under the section **`Resources`** we can see the example function named **`HelloWorldFunction`**.

Now, we can copy all this section and change the name from **`HelloWorldFunction`** to **`OurChosenNameFunction`**.

The subsection **`OurChosenNameFunction\Properties\CodeUri`** represents the relative path to the directory where is the source code of our function, so that, we will change the value to the path we decide. So It implies to create the directory.

The subsection **`OurChosenNameFunction\Properties\Events`** has a subsection named **`HelloWorld`** that represents the event that will launch the execution of a concrete point the our code. As we copy the whole section, we must change the name of this event (this name already exists on the section of the other function). Too, as we can see, there is defined the endpoint which wll receive the request. The important points here are:

- **`OurChosenNameFunction\Properties\Events\OurChosenEventName\Properties\Path`**: It is a name we chose to represents the URI of the endpoint, by example, **`talk`** (we will use later).
- **`OurChosenNameFunction\Properties\Events\OurChosenEventName\Properties\Method`**: Represents the HTTP method to which is allowed to reply. The possible values are the usual ones (`GET`, `POST`,...) or `ANY` (lets take for this excample) which means that all are permitted.

Lets go to configure the other big section **`Outputs`**. To suymmarize, you must duplicate (copy&paste) all the contained subsections and change the name of this subsections for the proper composed by taking as prefix or infix the name of the function we are using previously, as we can see as with the pattern of the entries of **`HelloWorld`**.

### CONFIGURATION TO HAVE A DynamoDB TABLE ON THE SECOND EXAMPLE

As we can see on file **`template.yaml`** there are a three changes.

The first one is the definition of a new resource, a table on DynamoDB with a very simple specification indicating the type of the resource on **`Resources\OurChosenTableName\Type`** with the value **`AWS::Serverless::SimpleTable`**.

The second change represents the policy which allows the function to access to the new resource, the DynamoDB table. The specification consist on define the entry **`OurChosenNameFunction\Properties\Policies\DynamoDBCrudPolicy\TableName\Ref`** with the value **`OurChosenTableName`**.

The last change defines a environment variable with contains the table name. This variable will be accessed by the source code to known its value.

## DEVELOPING

As we done previously, we have created a folder which name we have use on subsection **`OurChosenNameFunction\Properties\CodeUri`**. Inside this folder we must put/develop our source code. As example, on the folder of this example you can find the subfolder **`nlpjs`** with the source code.

Inside must be the next (most important) files:

- `package.json`
- `app.js`
- `engine.js`

As summary, in the file `package.json` we define as dependency the NPM package **`node-nlp`**, in the file **`app.js`** we define the handler to manage the requests and responses and in the file **`engine.js`** we train/load the model of the NLPjs engine and exposes the method to process phrases and receive responses, which is used on **`app.js`**.
There is many ways to store the NLPjs model. On this example we use the most simply one: on a file inside the directory **`/tmp`**. Without going into details, which can be found in the AWS serverless lambda documentation, we have up to 500MB of volatile space in that directory.

Now, previously to deploy opprocess, we are going to build and test locally. Inside the directory of the source code, execute:

- $ \> `sam build`
- $ \> `sam local start-api`

As response of the second command, we see the RULS on which are listening the process, more concretely, <http://127.0.0.1:3000/hello> for GET requests and <http://127.0.0.1:3000/talk> for GET requests.

As we can see on source code of `app.js`, It analyses the request loking for a parameter named `phrase`, so we can make a call like <http://127.0.0.1:3000/talk?phrase=hello> and see the response generated by the NLPjs engine.

### ACCESSING TO THE DynamoDB TABLE ON THE SECOND EXAMPLE

The main differences between both versions of the file **`engine.js`** are the imports to have access to funcitons and objects to manage DynamoDB tables and the access to the table itself.

>It is not necessary to define the dependencies of AWS framework on file **`package.json`** to deploy but there are included under **`devDependencies`** to make development easier.

To test the scenario execute:

- $ \> `sam build`
- $ \> `sam local start-api`
- $ \> `docker run -d -p 8000:8000 amazon/dynamodb-local`

The last command will start a DynamoDB locally and you can access to a management console on <http://localhost:8000/shell/> ([More info](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.UsageNotes.html)).

You will need to create the table inside your local DyanamoDB before you call the endpoint. The schema is defined inside the file **`schema.json`**. You must execute next command to do so:

> Next command suposes that the _`aws`_ utility is available. Review the previous sections related to [setup](#SETUP-DEVELOPMENT-ENVIRONMENT) and [aws alias](#MAKING-THE-LIVE-EASY)

- aws dynamodb create-table --endpoint-url `http://host.docker.internal:8000` --region eu-west-1 --cli-input-json file://schema.json

In fact, the region does not matters because the important point is the endpoint URL where you are specifying that you want "to manage" your local DynamoDB. It is only required because the command will fail if not specified.

Taking a look inside the file **`engine.js`**, on lines 8 and 10, you will see a reference to a environment variable defined by the tool **`sam`** and which allows to detect if we are working locally, on this case, the instance of the DynamoDb client will have the endpoint URL redefined.

## DEPLOYING

After verify that our example works locally, we are going to deploy it and test in through "real" internet access. From inside the directory of the source code, where is located the file **`temaple.yaml`**, execute next command and introduce the information in wizard process:

- $ \> `sam deploy --guided`
- [WRITE A VALUE] \> `ApplicationNameChosenOnWhichTheFunctionsWillBeEnclosed`
- [WRITE A VALUE] \> `CodeOfRegionChesonWhereToDeploy`  ([see availables](<https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html>))
- [SELECT OPTION] \> `Y`  (confirmation)
- [SELECT OPTION] \> `Y`  (confirmation to allow SAM CLI create a nested role)
- [SELECT OPTION] \> `Y`  (confirmation to save responses for later executions)
- [SELECT OPTION] \> `Y`  (confirmation to deploy changesets)

Finally we can see a extensive report of the deploy process, including the complete URLs to visit which allow us to interact with the defined functions:

- <https://someranmdonlygeneratedprefix.execute-api.ChosenRegionCode.amazonaws.com/Prod/hello/>
- <https://someranmdonlygeneratedprefix.execute-api.ChosenRegionCode.amazonaws.com/Prod/talk/>

With our second example related to DynamoDB the second link will be something llike:

- <https://someranmdonlygeneratedprefix.execute-api.ChosenRegionCode.amazonaws.com/Prod/talkDyDB/>
