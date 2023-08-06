function create() {
  document.body.style.backgroundColor = '#102030';
  document.body.style.color = '#eee';

  const canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.marginBottom = '24px';

  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext('2d');

  document.body.style.boxSizing = 'border-box';
  document.body.style.margin = 0;
  document.body.style.padding = '24px';

  const phraseContainer = document.createElement('div');
  phraseContainer.style.boxSizing = 'border-box';
  phraseContainer.style.display = 'flex';

  const phraseTxt = document.createElement('input');
  phraseTxt.style.flex = 1;
  phraseTxt.style.boxSizing = 'border-box';
  phraseTxt.style.display = 'block';
  phraseTxt.style.marginRight = '24px';
  phraseTxt.style.height = '48px';
  phraseTxt.style.fontSize = '24px';
  phraseTxt.placeholder = 'Enter Phrase';
  phraseContainer.appendChild(phraseTxt);

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const renderBtn = document.createElement('button');
  renderBtn.style.boxSizing = 'border-box';
  renderBtn.style.width = '200px';
  renderBtn.style.height = '48px';
  renderBtn.style.marginBottom = '24px';
  renderBtn.innerText = 'Render';
  phraseContainer.appendChild(renderBtn);

  const optionsContainer = document.createElement('div');
  optionsContainer.style.boxSizing = 'border-box';
  optionsContainer.style.display = 'flex';
  optionsContainer.style.alignItems = 'center';
  optionsContainer.style.justifyContent = 'space-between';

  const clearOnRenderLabel = document.createElement('label');
  const clearOnRenderCheckbox = document.createElement('input');
  clearOnRenderCheckbox.type = 'checkbox';

  clearOnRenderLabel.innerText = 'Clear On Render';
  clearOnRenderLabel.style.marginLeft = '4px';
  clearOnRenderLabel.htmlFor = 'cor';
  clearOnRenderCheckbox.id = 'cor';
  clearOnRenderCheckbox.checked = true;

  const rotCountLabel = document.createElement('label');

  rotCountLabel.innerText = 'Alphabet Rotations';
  rotCountLabel.htmlFor = 'rc';
  rotCountLabel.style.marginLeft = '24px';
  rotCountLabel.style.marginRight = '4px';

  const rotCountNum = document.createElement('input');
  rotCountNum.style.width = '64px';
  rotCountNum.style.height = '48px';
  rotCountNum.style.fontSize = '24px';
  rotCountNum.id = 'rc';
  rotCountNum.type = 'number';
  rotCountNum.value = 0;
  rotCountNum.min = 0;
  rotCountNum.max = 9;

  const rotCountContainer = document.createElement('div');

  const clearOnRenderContainer = document.createElement('div');
  clearOnRenderContainer.appendChild(clearOnRenderCheckbox);
  clearOnRenderContainer.appendChild(clearOnRenderLabel);

  const midContainer = document.createElement('div');
  midContainer.style.display = 'flex';
  // midContainer.style.justifyContent = 'space-between';

  const historyContainer = document.createElement('div');
  historyContainer.style.marginLeft = '24px';
  historyContainer.style.flex = 1;

  midContainer.appendChild(canvas);
  midContainer.appendChild(historyContainer);

  document.body.appendChild(phraseContainer);
  document.body.appendChild(midContainer);
  document.body.appendChild(optionsContainer);

  optionsContainer.appendChild(clearOnRenderContainer);

  rotCountContainer.appendChild(rotCountLabel);
  rotCountContainer.appendChild(rotCountNum);
  optionsContainer.appendChild(rotCountContainer);

  const historyState = [];

  let isHistorialPlayback = false;

  const makeHistoryItem = (state) => {
    const itemContainer = document.createElement('div');
    itemContainer.style.cursor = 'pointer';
    itemContainer.addEventListener(
      'mouseover',
      () => {
        itemContainer.style.backgroundColor = 'rgba(255,255,0,0.4)';
      },
      false
    );
    itemContainer.addEventListener(
      'mouseout',
      () => {
        itemContainer.style.backgroundColor = 'transparent';
      },
      false
    );
    itemContainer.addEventListener(
      'click',
      () => {
        phraseTxt.value = state.text;
        rotCountNum.value = state.rotations;
        isHistorialPlayback = true;
        handleRender();
        isHistorialPlayback = false;
      },
      false
    );
    itemContainer.style.flex = 1;
    const itemText = document.createElement('div');
    itemText.innerText = `phrase: "${state.text}"`;
    const itemRot = document.createElement('div');
    itemRot.innerText = `ar: ${state.rotations}`;
    itemContainer.appendChild(itemText);
    itemContainer.appendChild(itemRot);
    return itemContainer;
  };

  const refreshHistory = () => {
    while (historyContainer.firstChild) {
      historyContainer.removeChild(historyContainer.firstChild);
    }
    for (const state of historyState) {
      const itemContainer = makeHistoryItem(state);
      historyContainer.appendChild(itemContainer);
    }
  };

  const loadHistoryFromLS = () => {
    try {
      const lsContent = window.localStorage.getItem('runebuilderhistory');
      if (lsContent) {
        const lsHistory = JSON.parse(lsContent);
        if (Array.isArray(lsHistory)) {
          historyState.length = 0;
          for (const state of lsHistory) {
            historyState.push({ ...state });
          }
          refreshHistory();
        }
      }
    } catch (err) {
      return historyState;
    }
  };

  const saveHistoryToLS = () => {
    try {
      const lsContent = JSON.stringify(historyState);
      window.localStorage.setItem('runebuilderhistory', lsContent);
      return true;
    } catch (err) {
      return null;
    }
  };

  const addToHistory = (state) => {
    historyState.push({ ...state });
    saveHistoryToLS();
    const itemContainer = makeHistoryItem(state);
    historyContainer.appendChild(itemContainer);
  };

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
    const rotations = rotCountNum.valueAsNumber;
    const state = { time: new Date().getTime(), text, rotations };

    render(reduce(text, rotations), ctx);
    if (!isHistorialPlayback) {
      addToHistory(state);
    }
  };

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

  loadHistoryFromLS();
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

function reduce(input, alphabetRotations) {
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

  const alphabet = rotated('abcdefghijklmnopqrstuvwxyz', alphabetRotations);

  const m = alphabet.split('');
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

function rotated(input, count) {
  const output = input.split('');
  for (let i = 0; i < count; i++) {
    output.push(output.shift());
  }
  return output.join('');
}

create();
