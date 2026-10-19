const test=require('node:test');const assert=require('node:assert/strict');const {spawnSync}=require('node:child_process');const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const run=(a,b)=>{const r=spawnSync(process.execPath,[path.join(__dirname,'check.cjs'),path.join(root,a),path.join(root,b)],{encoding:'utf8'});if(r.error)throw r.error;return r;};
test('CLI exposes a broken translation as failing JSON report',()=>{const r=run('examples/en.json','examples/es-broken.json');assert.equal(r.status,1);const j=JSON.parse(r.stdout);assert.equal(j.issues.length,3);assert.equal(j.semantic_quality_assessed,false);});
test('review candidate passes only supported structure',()=>{const r=run('examples/en.json','examples/es-candidate.json');assert.equal(r.status,0);assert.equal(JSON.parse(r.stdout).semantic_quality_assessed,false);});
test('unsupported ICU never returns success',()=>{const r=run('examples/icu.json','examples/icu.json');assert.equal(r.status,2);assert.equal(JSON.parse(r.stdout).status,'incomplete');});
