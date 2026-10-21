import {diagnose, proofPDF} from './core.mjs';
const $ = id => document.getElementById(id);
$('download').addEventListener('click', () => {
  const paper = $('paper').value;
  const url = URL.createObjectURL(new Blob([proofPDF(paper)], {type:'application/pdf'}));
  const link = document.createElement('a'); link.href=url; link.download=`print-size-proof-${paper}.pdf`; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
});
$('diagnostic').addEventListener('submit', e => {
  e.preventDefault(); const el=$('result'); el.replaceChildren();
  try {
    const r=diagnose({width:Number($('width').value),height:Number($('height').value),current:Number($('current').value)});
    const title=document.createElement('h3'),text=document.createElement('p');
    title.textContent=r.uneven?'Pause: the axes disagree':r.correct?'Close to the reference':`Try ${r.suggested.toFixed(3)}% on a new proof`;
    text.textContent=r.message;el.append(title,text);
    el.dataset.state=r.uneven?'uneven':r.correct?'correct':'adjust';
    if(r.uneven){const detail=document.createElement('p');detail.textContent=`Separate calculations: horizontal ${r.x.toFixed(3)}%; vertical ${r.y.toFixed(3)}%. These are not a combined printer setting.`;el.append(detail);}
  } catch(err) {el.textContent=err.message;el.dataset.state='uneven';}
});
$('example').addEventListener('click',()=>{$('width').value='95';$('height').value='95';$('current').value='100';$('diagnostic').requestSubmit();});
