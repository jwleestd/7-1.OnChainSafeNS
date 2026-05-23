const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repo = 'jwleestd/OnChainSafeNS';
const mdPath = path.join(__dirname, '..', '..', 'tasks', '0.ISSUES_Qu_V0_6_Phase0__opus47_fn(MVP).md');
const ghPath = 'C:\\Program Files\\GitHub CLI\\gh.exe';

if (!fs.existsSync(mdPath)) {
  console.error(`File not found: ${mdPath}`);
  process.exit(1);
}

const content = fs.readFileSync(mdPath, 'utf8');
const segments = content.split(/\n## /);
const phase0Issues = [];

for (const segment of segments) {
  const lines = segment.split('\n');
  const heading = lines[0].trim();
  
  const idMatch = heading.match(/^([A-Z0-9_a-z-]+)/);
  if (!idMatch) continue;
  const id = idMatch[1];
  
  let title = '';
  let labels = [];
  let bodyStartIndex = -1;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('title:')) {
      title = line.replace(/^title:\s*"/, '').replace(/"$/, '').trim();
    } else if (line.startsWith('labels:')) {
      const labelsStr = line.replace(/^labels:\s*['"]/, '').replace(/['"]$/, '').trim();
      labels = labelsStr.split(',').map(s => s.trim()).filter(Boolean);
    } else if (line.startsWith('```') && title && labels.length > 0) {
      bodyStartIndex = i + 1;
      break;
    }
  }
  
  if (!title || labels.length === 0) continue;
  if (!labels.includes('phase-0')) continue;
  
  let bodyLines = lines.slice(bodyStartIndex);
  if (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === '---') {
    bodyLines.pop();
  }
  if (bodyLines.length > 1 && bodyLines[bodyLines.length - 2].trim() === '---') {
    bodyLines.pop();
    bodyLines.pop();
  }
  
  const body = bodyLines.join('\n').trim();
  
  let milestone = 'Phase-0 Auth + Core Features';
  if (id.match(/^(DB-00[1-8]|API-00[1-9]|LIB-00[1-4]|SEED-00[1-3]|ENV-00[1-4])$/)) {
    milestone = 'Phase-0 Foundation';
  } else if (id.startsWith('TEST-') || id.startsWith('NFR-')) {
    milestone = 'Phase-0 Test & NFR';
  }
  
  phase0Issues.push({ id, title, labels, milestone, body });
}

// Sort issues by ID
const order = ['ENV', 'DB', 'API', 'LIB', 'SEED', 'MW', 'CMD', 'QRY', 'FE', 'TEST', 'NFR'];
phase0Issues.sort((a, b) => {
  const prefixA = a.id.split('-')[0];
  const prefixB = b.id.split('-')[0];
  if (prefixA !== prefixB) {
    const idxA = order.indexOf(prefixA);
    const idxB = order.indexOf(prefixB);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  }
  return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
});

console.log(`Starting registration of ${phase0Issues.length} issues to ${repo}...`);

const tempBodyFile = path.join(__dirname, 'temp_issue_body.md');
const createdLabels = new Set();

for (let i = 0; i < phase0Issues.length; i++) {
  const issue = phase0Issues[i];
  console.log(`[${i + 1}/${phase0Issues.length}] Creating issue: ${issue.id} - ${issue.title}`);
  
  // Ensure all labels exist on GitHub
  for (const label of issue.labels) {
    if (!createdLabels.has(label)) {
      // Try to create the label, ignore error if it already exists
      spawnSync(ghPath, ['label', 'create', label, '--color', '5319e7', '-R', repo], { encoding: 'utf8' });
      createdLabels.add(label);
    }
  }

  // Write body to temp file
  fs.writeFileSync(tempBodyFile, issue.body, 'utf8');
  
  const args = [
    'issue',
    'create',
    '-R', repo,
    '--title', issue.title,
    '--milestone', issue.milestone,
    '--body-file', tempBodyFile
  ];
  
  issue.labels.forEach(label => {
    args.push('--label', label);
  });
  
  const result = spawnSync(ghPath, args, { encoding: 'utf8' });
  
  if (result.status !== 0) {
    console.error(`Error creating issue ${issue.id}:`, result.stderr);
  } else {
    console.log(`Successfully created: ${result.stdout.trim()}`);
  }
  
  // Clean up
  if (fs.existsSync(tempBodyFile)) {
    fs.unlinkSync(tempBodyFile);
  }
  
  // Short sleep to prevent rate limiting
  spawnSync('node', ['-e', 'setTimeout(() => {}, 200)']);
}

console.log('All Phase-0 Issues have been registered successfully!');
