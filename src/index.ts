import * as express from 'express';
import * as bodyParser from 'body-parser';
import { recurrent } from 'brain.js';
import * as path from 'path';
import * as fs from 'fs';
const app = express();
const lstm = new recurrent.LSTM();
const json = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'brainjs', 'net.json'), 'utf8')
);
lstm.fromJSON(json);
app.use(bodyParser.json());

const html = (text: string, response: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <body>
    <h1>${text}</h1>
    <pre>${response}</pre>
    </body>
    </html>
  `;
};

app.get('/', function(req, res) {
  let text = req.query.text || 'empty';
  const answer = lstm.run(text);
  console.log(answer, typeof answer);
  res.send(html(text, JSON.stringify(answer, null, 4)));
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
