function create() {
  document.body.style.backgroundColor = '#102030';
  document.body.style.color = '#eee';

  const canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.marginBottom = '24px';

  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext('2d');

  document.body.appendChild(canvas);

  ctx.fillStyle = '#fff';

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const handleRender = () => {
    if (phraseTxt.value.length < 2) {
      return;
    }
    const text = phraseTxt.value;
    phraseTxt.value = '';
    if (clearOnRenderCheckbox.checked) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    render(reduce(text), ctx);
  };

  const phraseTxt = document.createElement('input');
  phraseTxt.style.display = 'block';
  phraseTxt.style.marginBottom = '24px';
  phraseTxt.style.width = '512px';
  phraseTxt.style.height = '48px';
  phraseTxt.style.fontSize = '24px';
  phraseTxt.placeholder = 'Enter Phrase';
  document.body.appendChild(phraseTxt);

  const renderBtn = document.createElement('button');
  renderBtn.style.width = '200px';
  renderBtn.style.height = '48px';
  renderBtn.innerText = 'Render';
  document.body.appendChild(renderBtn);

  const clearOnRenderLabel = document.createElement('label');
  const clearOnRenderCheckbox = document.createElement('input');
  clearOnRenderCheckbox.type = 'checkbox';

  clearOnRenderLabel.innerText = 'Clear On Render';
  clearOnRenderLabel.htmlFor = 'cor';
  clearOnRenderCheckbox.id = 'cor';
  clearOnRenderCheckbox.checked = true;

  document.body.appendChild(clearOnRenderCheckbox);
  document.body.appendChild(clearOnRenderLabel);

  phraseTxt.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Enter' || e.key === 'Return') {
        handleRender();
      }
    },
    false
  );

  renderBtn.addEventListener(
    'click',
    () => {
      handleRender();
    },
    false
  );
}

function render(indices, ctx) {
  const cellWidth = ctx.canvas.width / 5;
  const cellHeight = ctx.canvas.height / 5;

  const points = [];
  for (let i = 0; i < indices.length; i++) {
    const pointIndex = indices[i];
    const pointX =
      cellWidth * (1 + Math.floor(pointIndex % 3)) + cellWidth * 0.5;
    const pointY =
      cellHeight * (1 + Math.floor(pointIndex / 3)) + cellHeight * 0.5;
    points.push([pointX, pointY]);
  }

  ctx.strokeStyle = '#000';
  ctx.lineWidth = Math.ceil(Math.max(cellWidth, cellHeight) * 0.125);
  ctx.beginPath();

  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }

  ctx.stroke();
}

function reduce(input) {
  // input: "some text"
  // output: [p0, p1, pN]

  let output = [];
  let table = {};
  const words = input.split(' ');
  for (const word of words) {
    let letters = word.split('').filter(Boolean);
    let wrd = '';
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i].toLowerCase();
      if (letter in table) {
        continue;
      }
      table[letter] = 1;
      wrd += letter;
    }
    output.push(wrd);
  }

  const input2 = output.filter(Boolean).join('');

  const m = 'abcdefghijklmnopqrstuvwxyz'.split('');
  output = [];
  letters = input2.split('');
  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i].toLowerCase();
    const idx = 1 + (m.indexOf(letter) % 9);
    output.push(idx);
  }
  const nums = [];
  for (let i = 0; i < output.length - 1; i++) {
    if (output[i] !== output[i + 1]) {
      nums.push(output[i]);
    }
  }
  nums.push(output[output.length - 1]);
  const input3 = nums.join('');

  const indices = '492357816';
  output = [];
  letters = input3.split('');
  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i].toLowerCase();
    const index = indices.indexOf(letter);
    output.push(index);
  }

  return output;

  // return [2, 6, 1, 7, 8, 4, 8, 0, 3, 2, 0, 5];
}

create();
