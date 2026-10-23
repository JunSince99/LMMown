import {diagnose, proofPDF} from './core.mjs';
const $ = id => document.getElementById(id);
let mode='own';
for(const id of ['width','height','current']) $(id).addEventListener('input',()=>{
  mode='own'; $('result').removeAttribute('data-state');
  $('result').textContent='Measurements changed. Check again to update your next step.';
});
$('paper').addEventListener('change',()=>{ $('download-status').textContent=''; });
$('download').addEventListener('click', () => {
  const paper = $('paper').value;
  const url = URL.createObjectURL(new Blob([proofPDF(paper)], {type:'application/pdf'}));
  const link = document.createElement('a'); link.href=url; link.download=`print-size-proof-${paper}.pdf`; link.click();
  $('download-status').textContent=`${paper==='a4'?'A4':'US Letter'} PDF ready. Print at Actual size / 100%.`;
  setTimeout(()=>URL.revokeObjectURL(url),30000);
});
$('diagnostic').addEventListener('submit', e => {
  e.preventDefault(); const el=$('result'); el.replaceChildren();
  try {
    const r=diagnose({width:Number($('width').value),height:Number($('height').value),current:Number($('current').value)});
    const label=document.createElement('p'), title=document.createElement('h3'), text=document.createElement('p');
    label.className='result-label'; label.textContent=mode==='sample'?'Example result — not your measurements':'Your next step';
    title.textContent=r.uneven?'Remeasure before changing the scale':r.correct?'Your test is close to the correct size':`Try ${r.suggested.toFixed(3)}% on another test`;
    text.textContent=r.message;el.append(label,title,text);
    el.dataset.state=r.uneven?'uneven':r.correct?'correct':'adjust';
    if(r.uneven){const detail=document.createElement('p');detail.className='quiet';detail.textContent=`Horizontal calculation: ${r.x.toFixed(3)}%. Vertical: ${r.y.toFixed(3)}%. One percentage cannot correct both axes.`;el.append(detail);}
    if(!r.uneven&&!r.correct){const tip=document.createElement('p');tip.textContent='If your print app rounds the percentage, use the closest setting it accepts. Print the test sheet again and remeasure before printing the full job.';el.append(tip);}
    if(r.correct){const tip=document.createElement('p');tip.textContent='Keep your current setting for this workflow. Check the test square on your actual pattern or template before printing every page.';el.append(tip);}
  } catch(err) {el.textContent=err.message;el.dataset.state='uneven';}
  el.focus({preventScroll:true});
  if(matchMedia('(max-width: 760px)').matches) el.scrollIntoView({behavior:'smooth',block:'nearest'});
});
$('example').addEventListener('click',()=>{mode='sample';$('width').value='95';$('height').value='95';$('current').value='100';$('diagnostic').requestSubmit();});
