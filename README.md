# dialogflow-intent-generator
Generate complex intents and agent so that user can import the agent into dialogflow.

Represent the scenarios as JSON objects as below
```javascript
const welcomeNode = {
                      'labels' : ['hello', 'hi'],
                      'nextNode' : node1
                    };
const node1 = {
  'name' : 'node1',
  'question' : 'What type of service?',
  'nextNodes' : [
    {
      'labels' : ['rental'],
      'nextNode' : rentalNode1
    },

    {
      'labels' : ['repair', 'mechanic'],
      'nextNode' : repairNode1
    }
  ],
}
```

* yarn install
* yarn start
* it will generate the files into the folder specified in index.js
* now zip the files and upload into DialogFlow console.
