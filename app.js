const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');


//require('@tensorflow/tfjs-node');
//require('@tensorflow/tfjs-node-gpu');
require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');

const app = express();
const port = 3350;


let model, labels;

const predict = async () => {
  const threshold = 0.85;
  model = await toxicity.load(threshold);
  labels = model.model.outputNodes.map(d => d.split('/')[0]);
};


predict();

const classify = async (inputs) => {
  const results = await model.classify(inputs);
  return inputs.map((d, i) => {
    const obj = {'text': d};
    results.forEach((classification) => {
      obj[classification.label] = [ classification.results[i].match, classification.results[i].probabilities ] ;
    });
    return obj;
  });
};



app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/fuck', async (req, res) => {

    var line = "Send your stupid line as a POST asshole! Like this, dummy: {\"line\": \"Whatever bullshit you want to test.\"}";

    const response = await classify([line]).then(d => {
          res.json(d);
    });
});

app.post('/fuck', async (req, res) => {
    console.log(JSON.stringify(req.body));
    const line = req.body.line;

    const response = await classify([line]).then(d => {
          res.json(d);
    });
});


app.listen(port, () => console.log(`Hey yo, your shitty app is listening on port ${port}!`));