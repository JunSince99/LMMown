#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const checker=require('./core.cjs');
if(process.argv.length!==4){console.error('Usage: node tools/locale-check/check.cjs source.json target.json');process.exit(2);}
try{
 const texts=process.argv.slice(2).map(p=>{if(fs.statSync(p).size>1000000)throw Error('Use files below 1 MB.');return fs.readFileSync(p,'utf8');});
 const report=checker.check(...texts.map(checker.parse));
 console.log(JSON.stringify(report,null,2));
 process.exitCode=report.status==='incomplete'?2:report.issues.length?1:0;
}catch(e){console.error(JSON.stringify({status:'input_error',error:e.message,semantic_quality_assessed:false}));process.exitCode=2;}
