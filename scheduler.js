console.log('start')
const  schedule = require('node-schedule');

const rule = new schedule.RecurrenceRule();

rule.hour = 4;
rule.minute = 0;

const { exec } = require('child_process');

const job = schedule.scheduleJob(rule, () => {
	const child = exec('node index.js', (error, stdout, stderr) => {
		if (error) {
			console.log(stdout);
			console.error(error);
		} else {
			console.log(stdout);
		}
	});
});