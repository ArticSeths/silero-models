import {PythonShell} from 'python-shell';

let options = {
  args: [process.argv[2]]
};

PythonShell.run('test.py', options, function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('results: %j', results);
});
