console.log('start')
const  schedule = require('node-schedule');

import {
    START_SCHEDULER_TIME,
} from './CONFIG.js'

const rule = new schedule.RecurrenceRule();

// rule.hour = 4;
// rule.minute = 0;
[rule.hour, rule.minute] = START_SCHEDULER_TIME.split(':').map(el=>+el)

console.log(rule);

import { /*exec,*/ spawn } from 'child_process';

const job = schedule.scheduleJob(rule, () => {

	console.log('Запуск дочінього процесу та перенаправлення виводу');

	const child = spawn('node', ['index.js']);

	child.stdout.on('data', (data) => {
		console.log(`${data}`);
	});

	child.stdout.on('end', () => {
		console.log('Дочірній процес завершено!');
	});

	child.on('close', (code) => {
		console.log(`Дочірінй процес завершено з кодом: ${code}`);
	});

});
