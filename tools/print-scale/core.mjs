export function diagnose({width, height, current = 100}) {
  for (const [name, n, min, max] of [['Width', width, 50, 150], ['Height', height, 50, 150], ['Current scale', current, 50, 200]]) {
    if (!Number.isFinite(n) || n < min || n > max) throw new Error(`${name} must be between ${min} and ${max}.`);
  }
  const x = current * 100 / width, y = current * 100 / height;
  // A 0.5 mm difference on the 100 mm reference may come from measurement.
  // This is a diagnostic threshold, not a printer accuracy specification.
  const uneven = Math.abs(width - height) > 0.5;
  const correct = Math.abs(width - 100) <= 0.5 && Math.abs(height - 100) <= 0.5;
  return {x, y, uneven, correct, suggested: uneven ? null : (x + y) / 2,
    message: uneven ? 'The two axes differ. One scale percentage cannot correct both. Recheck your measurements and paper, borderless and driver settings before changing the scale.'
      : correct ? 'Both measurements are within 0.5 mm of the reference. Recheck the actual pattern or artwork before printing the full job.'
      : 'First turn off Fit / Shrink and borderless enlargement. If the same error remains, try this percentage in the same print workflow, then print and measure another proof.'};
}

const pt = mm => mm * 72 / 25.4;
const f = n => Number(n.toFixed(4));
export function proofPDF(paper = 'a4') {
  if (!['a4', 'letter'].includes(paper)) throw new Error('Choose A4 or US Letter.');
  const [w, h] = paper === 'a4' ? [pt(210), pt(297)] : [612, 792];
  const x = pt(35), top = h - pt(65), bottom = top - pt(100), right = x + pt(100);
  let content = '0 G 0.6 w\n';
  const line = (a,b,c,d) => { content += `${f(a)} ${f(b)} m ${f(c)} ${f(d)} l S\n`; };
  const text = (a,b,size,s) => {content += `BT /F1 ${size} Tf ${f(a)} ${f(b)} Td (${s}) Tj ET\n`;};
  text(pt(20),h-pt(22),20,'Print size proof');
  text(pt(20),h-pt(32),10,'Choose this paper size. Print at Actual size / 100%. Turn Fit off.');
  text(pt(20),h-pt(39),10,'Measure the 100 mm square horizontally AND vertically.');
  content += `${f(x)} ${f(bottom)} ${f(pt(100))} ${f(pt(100))} re S\n`;
  for(let mm=0;mm<=100;mm++) {
    const tick=pt(mm%10===0?4:mm%5===0?2.5:1.5);
    line(x+pt(mm),top,x+pt(mm),top-tick);
    line(x,bottom+pt(mm),x+tick,bottom+pt(mm));
    if(mm%10===0)text(x+pt(mm)-4,top+pt(3),7,String(mm));
  }
  text(x+pt(26),bottom+pt(50),14,'100 mm x 100 mm');
  text(x,bottom-pt(10),9,'Measure line centre to line centre with a physical ruler.');
  text(x,bottom-pt(16),9,'Horizontal: __________ mm     Vertical: __________ mm');
  text(pt(20),pt(52),9,'A PDF proof is not a printer certification. Verify before a full print run.');
  text(pt(20),pt(45),9,'If the axes disagree, one percentage cannot repair both.');
  text(pt(20),pt(36),9,`Paper: ${paper === 'a4' ? 'A4 (210 x 297 mm)' : 'US Letter (8.5 x 11 in)'}`);
  text(pt(20),pt(25),8,'Launchyard / Print scale prototype / No tracking or ads in this file');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${f(w)} ${f(h)}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${content.length} >>\nstream\n${content}endstream`
  ];
  let pdf='%PDF-1.4\n', offsets=[0];
  objects.forEach((o,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${o}\nendobj\n`;});
  const start=pdf.length;
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(const offset of offsets.slice(1)) pdf+=`${String(offset).padStart(10,'0')} 00000 n \n`;
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}
