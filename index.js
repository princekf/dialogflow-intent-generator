const uuid = require('uuid');
const fs = require('fs');

const uuidv4 = uuid.v4;

const welcomeLabels = ['hi', 'hello', 'heya', 'howdy', 'greetings'];
const yesLabels = ['yes', 'yeah', 'of course', 'for sure', 'yep', 'yep that\'s right', 'I think so', 'sure', 'sounds correct', 'correct', 'that\'s correct', 'right', 'yup', ];
const noLabels = ['no', 'nope', 'no way', 'no no don\'t', 'na', 'no it isn\'t', 'don\'t', 'nah I\'m good', 'nothing', 'I don\'t think so', 'I disagree', 'no don\'t', 'no we are good', 'no thanks', 'definitely not', 'not', 'not at all', 'no never', 'never', 'no way no', 'not really', 'nah', 'I don\'t', ];
const nodeAlert = {
  'name' : 'nodeAlert',
  'question' : 'error message',
}
const nodeSuccess = {
  'name' : 'nodeSuccess',
  'question' : 'success message',
}
const nodeQuestion5YesANoAYes = {
  'name' : 'nodeQuestion5YesANoAYes',
  'question' : 'some question?', 
  'nextNodes' : [
    {
      'labels' : yesLabels,
      'nextNode' : nodeAlert
    },

    {
      'labels' : noLabels,
      'nextNode' : nodeSuccess
    }
  ],
}
const nodeQuestion5YesANo = {
  'name' : 'nodeQuestion5YesANo',
  'question' : 'some question?', 
  'nextNodes' : [
    {
      'labels' : yesLabels,
      'nextNode' : nodeQuestion5YesANoAYes
    },

    {
      'labels' : noLabels,
      'nextNode' : nodeSuccess
    }
  ],
}
const nodeQuestion5Yes = {
  'name' : 'nodeQuestion5Yes',
  'question' : 'some question?', 
  'nextNodes' : [
    {
      'labels' : yesLabels,
      'nextNode' : nodeAlert
    },

    {
      'labels' : noLabels,
      'nextNode' : nodeQuestion5YesANo
    }
  ],
}
const nodeQuestion5 = {
  'name' : 'nodeQuestion5',
  'question' : 'some question?', 
  'nextNodes' : [
    {
      'labels' : yesLabels,
      'nextNode' : nodeQuestion5Yes
    },

    {
      'labels' : noLabels,
      'nextNode' : nodeSuccess
    }
  ],
}
const nodeQuestion4 = {
  'name' : 'nodeQuestion4',
  'question' : 'some question?', 
  'nextNodes' : [
    {
      'labels' : yesLabels,
      'nextNode' : nodeAlert
    },

    {
      'labels' : noLabels,
      'nextNode' : nodeQuestion5
    }
  ],
}
const nodeQuestion3 = {
  'name' : 'nodeQuestion3',
  'question' : 'some question?', 
  'nextNodes' : [
    {
      'labels' : yesLabels,
      'nextNode' : nodeAlert
    },

    {
      'labels' : noLabels,
      'nextNode' : nodeQuestion4
    }
  ],
}

const nodeQuestion2Yes = {
  'name' : 'nodeQuestion2Yes',
  'question' : 'some question?', 
  'nextNodes' : [
    {
      'labels' : yesLabels,
      'nextNode' : nodeQuestion3
    },

    {
      'labels' : noLabels,
      'nextNode' : nodeAlert
    }
  ],
}
  

const nodeQuestion2 = {
  'name' : 'nodeQuestion2',
  'question' : 'some question?', 
  'nextNodes' : [
    {
      'labels' : yesLabels,
      'nextNode' : nodeQuestion2Yes
    },

    {
      'labels' : noLabels,
      'nextNode' : nodeQuestion3
    }
  ],
}

const nodeQuestion1Yes = {
  'name' : 'nodeQuestion1Yes',
  'question' : 'some question?',
  'nextNodes' : [
    {
      'labels' : yesLabels,
      'nextNode' : nodeQuestion2
    },

    {
      'labels' : noLabels,
      'nextNode' : nodeAlert
    }
  ],
}

const nodeQuestion1 = {
  'name' : 'nodeQuestion1',
  'question' : 'some question?',
  'nextNodes' : [
    {
      'labels' : yesLabels,
      'nextNode' : nodeQuestion1Yes
    },

    {
      'labels' : noLabels,
      'nextNode' : nodeQuestion2
    }
  ],
}
const agentPath = '/full/path/of/a/folder';
const intentPath = `${agentPath}/intents`;
const endIntentIds = [];
fs.mkdirSync(intentPath, { recursive: true });
const traverseThroughTree = (nodeObject, parentIntent, rootParentIntent) => {
  const intentId = uuidv4();
  const treeNode = nodeObject.nextNode;
  const intentObject = JSON.parse(fs.readFileSync('./templates/WelcomeIntent.json', 'utf8'));
  intentObject.id = intentId;
  intentObject.name = `${treeNode.name}-${intentId}`;
  intentObject.responses[0].affectedContexts[0].name = `${parentIntent?parentIntent.name:'Q1'}-${treeNode.name}`;
  intentObject.responses[0].messages[0].speech = treeNode.question;
  if(parentIntent){
    intentObject.contexts.push(parentIntent.responses[0].affectedContexts[0].name);
    intentObject.parentId = parentIntent.id;
  }
  if(!rootParentIntent){
    // Welcome intent.
    rootParentIntent = intentObject;
    intentObject.events[0] = {name : "WELCOME"};
    intentObject.responses[0].action = 'input.welcome';
  }else{
    intentObject.responses[0].action = treeNode.name;
    intentObject.rootParentId = rootParentIntent.id;
  }

  if(treeNode.nextNodes){
    // for(let i = 0; i < treeNode.nextNodes.length; i++){
      // traverseThroughTree(treeNode.nextNodes[i], intentObject, rootParentIntent);
      treeNode.nextNodes.forEach(nextNode => {
        traverseThroughTree(nextNode, intentObject, rootParentIntent);
      });
  }else{
    // last node
    endIntentIds.push(intentId);
  }
  const userSays = [];
  // for(let i = 0; i < nodeObject.labels.length; i++) {
    // const label = nodeObject.labels[i];
  nodeObject.labels.forEach(label => {
    sayObj = {
      "id": uuidv4(),
      "data": [
        {
          "text": label,
          "userDefined": false
        }
      ],
      "isTemplate": false,
      "count": 1,
      "updated": 0
    }
    userSays.push(sayObj);
  });
  const fileNameStart = `${intentPath}/${parentIntent ? parentIntent.name : 'Q1'}-${treeNode.name}`;
  fs.writeFileSync(`${fileNameStart}.json`, JSON.stringify(intentObject, null, 2));
  fs.writeFileSync(`${fileNameStart}_usersays_en.json`, JSON.stringify(userSays, null, 2));
}

traverseThroughTree({
  'labels' : welcomeLabels,
  'nextNode' : nodeQuestion1
});
const agentObject = JSON.parse(fs.readFileSync('./templates/agent.json', 'utf8'));
agentObject.googleAssistant.endIntentIds = endIntentIds;
fs.writeFileSync(`${agentPath}/agent.json`, JSON.stringify(agentObject, null, 2));
const fallBackIntentObject = JSON.parse(fs.readFileSync('./templates/FallbackIntent.json', 'utf8'));
fallBackIntentObject.id = uuidv4();
fs.writeFileSync(`${intentPath}/fallback.json`, JSON.stringify(fallBackIntentObject, null, 2));
const packageJson = {
  "version": "1.0.0"
}
fs.writeFileSync(`${agentPath}/package.json`, JSON.stringify(packageJson, null, 2));
