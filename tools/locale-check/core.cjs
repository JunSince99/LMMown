(function(root){
'use strict';
const token=/\{\{[A-Za-z_][\w.-]*\}\}|(?<!\{)\{[A-Za-z_][\w.-]*\}(?!\})/g;
function parse(text){
 if(text.length>1000000)throw Error('Use a JSON file below 1 MB.');
 const parts=text.match(/\s+|"(?:[^"\\]|\\.)*"|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}\[\]:,]/g)||[];
 if(parts.join('')!==text)throw Error('Invalid JSON syntax.');
 const t=parts.filter(x=>!/^\s+$/.test(x));let pos=0,keys=0;
 function scan(depth){
  if(depth>40)throw Error('JSON is too deeply nested.');
  if(t[pos]==='{'){
   pos++;const seen=new Set();if(t[pos]==='}'){pos++;return;}
   while(pos<t.length){const key=JSON.parse(t[pos++]);if(typeof key!=='string')throw Error('Invalid object key.');if(seen.has(key))throw Error('Duplicate JSON key: '+key);seen.add(key);if(++keys>10000)throw Error('Limit: 10,000 keys.');if(t[pos++]!==':')throw Error('Missing colon.');scan(depth+1);if(t[pos]==='}'){pos++;return;}if(t[pos++]!==',')throw Error('Invalid object.');}
   throw Error('Unclosed object.');
  }else if(t[pos]==='['){pos++;if(t[pos]===']'){pos++;return;}while(pos<t.length){scan(depth+1);if(t[pos]===']'){pos++;return;}if(t[pos++]!==',')throw Error('Invalid array.');}throw Error('Unclosed array.');}
  else{if(pos>=t.length||/^[}\]:,]$/.test(t[pos]))throw Error('Invalid JSON value.');JSON.parse(t[pos++]);}
 }
 scan(0);if(pos!==t.length)throw Error('Unexpected JSON data.');const data=JSON.parse(text);if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Use a JSON object at the root.');return data;
}
function placeholders(s){const found=s.match(token)||[];const rest=s.replace(token,'');return /[{}<>]/.test(rest)?null:new Set(found);}
function check(a,b){const issues=[];let checked=0;
 const add=(path,kind,data={})=>issues.push({path:path||'/',kind,...data});
 const type=x=>Array.isArray(x)?'array':x===null?'null':typeof x;
 function walk(a,b,path=''){
  if(type(a)!==type(b)){add(path,'type_mismatch');return;}
  if(type(a)==='object')for(const key of [...new Set([...Object.keys(a),...Object.keys(b)])].sort()){
   const p=path+'/'+key.replace(/~/g,'~0').replace(/\//g,'~1');
   if(!Object.hasOwn(b,key))add(p,'missing_key');else if(!Object.hasOwn(a,key))add(p,'extra_key');else walk(a[key],b[key],p);
  }else if(typeof a==='string'){
   const x=placeholders(a),y=placeholders(b);if(!x||!y){add(path,'unsupported_syntax');return;}checked++;
   if(a.trim()&&!b.trim())add(path,'empty_translation');
   const missing=[...x].filter(v=>!y.has(v)),unexpected=[...y].filter(v=>!x.has(v));if(missing.length||unexpected.length)add(path,'placeholder_mismatch',{missing,unexpected});
  }else add(path,'unsupported_value');
 }
 walk(a,b);const unsupported=issues.filter(i=>i.kind.startsWith('unsupported')).length;
 return {status:unsupported?'incomplete':issues.length?'failed':'structural_checks_passed',checked,unsupported,semantic_quality_assessed:false,issues};
}
const api={parse,check};if(typeof module!=='undefined')module.exports=api;else root.LocaleCheck=api;
})(typeof globalThis!=='undefined'?globalThis:this);
