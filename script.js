// script.js — SI‑Vorsilben Trainer

document.addEventListener("DOMContentLoaded", () => {
  // Offizielle SI‑Präfixe (inkl. 2022 Ergänzungen)
  const prefixes = [
    {name:'quetta', sym:'Q', exp:30},
    {name:'ronna', sym:'R', exp:27},
    {name:'yotta', sym:'Y', exp:24},
    {name:'zetta', sym:'Z', exp:21},
    {name:'exa', sym:'E', exp:18},
    {name:'peta', sym:'P', exp:15},
    {name:'tera', sym:'T', exp:12},
    {name:'giga', sym:'G', exp:9},
    {name:'mega', sym:'M', exp:6},
    {name:'kilo', sym:'k', exp:3},
    {name:'hekto', sym:'h', exp:2},
    {name:'deka', sym:'da', exp:1},
    {name:'', sym:'(ohne Symbol)', exp:0}, // kein Präfix
    {name:'dezi', sym:'d', exp:-1},
    {name:'zenti', sym:'c', exp:-2},
    {name:'milli', sym:'m', exp:-3},
    {name:'mikro', sym:'µ', exp:-6},
    {name:'nano', sym:'n', exp:-9},
    {name:'piko', sym:'p', exp:-12},
    {name:'femto', sym:'f', exp:-15},
    {name:'atto', sym:'a', exp:-18},
    {name:'zepto', sym:'z', exp:-21},
    {name:'yocto', sym:'y', exp:-24},
    {name:'ronto', sym:'r', exp:-27},
    {name:'quecto', sym:'q', exp:-30}
  ];

  let mode = null;
  let qIndex = 0;
  let currentQuestion = null;
  const totalQuestions = 5;

  const questionText = document.getElementById('questionText');
  const showAnswerBtn = document.getElementById('showAnswerBtn');
  const answerArea = document.getElementById('answerArea');
  const progress = document.getElementById('progress');
  const menuButtons = document.querySelectorAll('.menu button');
  const questionArea = document.getElementById('questionArea');

  // Menü-Klicks
  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      menuButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      startMode(btn.dataset.mode);
    });
  });

  function startMode(m) {
    mode = m;
    qIndex = 0;
    answerArea.textContent = '';
    showAnswerBtn.disabled = false;
    nextQuestion();
  }

  function nextQuestion() {
    answerArea.textContent = '';
    showAnswerBtn.disabled = false;

    if (qIndex >= totalQuestions) {
      questionText.textContent = 'Fertig! Du hast alle Fragen beantwortet.';
      progress.textContent = `5 / ${totalQuestions} abgeschlossen`;
      showAnswerBtn.disabled = true;
      return;
    }

    qIndex++;
    progress.textContent = `${qIndex} / ${totalQuestions}`;

if (mode === 'si-prefix') {
  currentQuestion = genPrefixQuestion();
  questionText.innerHTML = currentQuestion.prompt;
} else if (mode === 'to-si') {
  currentQuestion = genNumberToSi();
  questionText.innerHTML = currentQuestion.prompt;
} else if (mode === 'to-expo') {
  currentQuestion = genExpoQuestion(); // <- Funktion aufrufen
  questionText.innerHTML = currentQuestion.prompt;
} else if (mode === 'to-si-expert') {
  currentQuestion = genNumberToSiExpert();
  questionText.innerHTML = currentQuestion.prompt;
} else {
  questionText.textContent = 'Diese Funktion ist noch nicht implementiert.';
  showAnswerBtn.disabled = true;
}
  }

  showAnswerBtn.addEventListener('click', () => {
    if (!currentQuestion) return;
    answerArea.innerHTML = currentQuestion.answerHTML;
    showAnswerBtn.disabled = true;
  });

  // Klick in Frage- oder Antwortbereich → nächste Frage
  [questionArea, answerArea].forEach(el => {
    el.addEventListener('click', () => {
      if (showAnswerBtn.disabled && mode) {
        nextQuestion();
      }
    });
  });

  // Hilfsfunktionen
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  //1.Funktion
  function genPrefixQuestion() {
    const p = pickRandom(prefixes);
    const variants = ['name', 'symbol', 'exp'];
    const chosen = pickRandom(variants);
    let prompt, answerHTML;

    const displayName = p.name || '(kein Präfix)';
    const displaySym = p.sym || '';

    if (chosen === 'name') {
      prompt = `Welche Angaben gehören zur Vorsilbe <strong>${displayName}</strong>?`;
      answerHTML = `
        <div class="answer-line"><strong>Symbol:</strong> ${displaySym}</div>
        <div class="answer-line"><strong>Zehnerpotenz:</strong> 10<sup>${p.exp}</sup></div>
      `;
    } else if (chosen === 'symbol') {
      prompt = `Welche Angaben gehören zum Symbol <strong>${displaySym}</strong>?`;
      answerHTML = `
        <div class="answer-line"><strong>Name:</strong> ${displayName}</div>
        <div class="answer-line"><strong>Zehnerpotenz:</strong> 10<sup>${p.exp}</sup></div>
      `;
    } else {
      prompt = `Welche Angaben gehören zu 10<sup>${p.exp}</sup>?`;
      answerHTML = `
        <div class="answer-line"><strong>Name:</strong> ${displayName}</div>
        <div class="answer-line"><strong>Symbol:</strong> ${displaySym}</div>
      `;
    }

    return { prompt, answerHTML };
  }

  //2.Funktion
  function genNumberToSi() {
  const exponents = prefixes.map(p => p.exp);
  const chosenExp = pickRandom(exponents);
  const mant = (Math.random() * 9 + 1).toFixed(3);
  const value = Number(mant) * Math.pow(10, chosenExp);

  // Auswahl technischer/physikalischer Einheiten
  const units = ['m', 'g', 'L', 's', 'W', 'V', 'A', 'J', 'Pa', 'Hz', 'Ω', 'F', 'H', 'N'];
  const unit = pickRandom(units);

  // Aufgabe als Frage: Zahl ohne Zehnerpotenz mit SI-Vorsilbe darstellen
  const prompt = `Stelle die angegebene Zahl ohne Zehnerpotenz mit SI-Vorsilbe dar: <strong>${mant}·10<sup>${chosenExp}</sup> ${unit}</strong>`;

  const prefix = prefixes.find(pp => pp.exp === chosenExp) || {name:'(kein Präfix)', sym:'', exp:0};
  const scaled = value / Math.pow(10, prefix.exp);

  const answerHTML = `
    <div class="answer-line"><strong>Zahl:</strong> ${scaled} ${prefix.sym}${unit}</div>
    <div class="answer-line"><strong>Vorsilbe:</strong> ${prefix.name} (${prefix.sym})</div>
    <div class="answer-line"><strong>Als Zehnerpotenz:</strong> ${scaled}·10<sup>${prefix.exp}</sup> ${unit}</div>
  `;

  return { prompt, answerHTML };
}
//3. Funktion
function genExpoQuestion() {
  // Zufällige Einheit
  const units = ['m', 'g', 'L', 's', 'W', 'V', 'A', 'J', 'Pa', 'Hz', 'Ω', 'F', 'H', 'N'];
  const unit = pickRandom(units);

  // Zufälliger Exponent -12..12
  const exponent = Math.floor(Math.random() * 25) - 12;

  // Zufällige Mantisse 1..10
  let mantissa = Math.random() * 9 + 1;

  // Aufgabe: Zahl ohne Zehnerpotenz darstellen
  // Wir erzeugen den Dezimalstring manuell
  let valueStr;
  if (exponent >= 0) {
    // Ganze Zahl oder Dezimalzahl > 1
    valueStr = (mantissa * Math.pow(10, exponent)).toLocaleString('fullwide', {useGrouping: false, maximumFractionDigits: 12});
  } else {
    // Dezimalzahl < 1
    // pad mit führenden Nullen
    let zeros = '0.' + '0'.repeat(-exponent - 1);
    valueStr = zeros + mantissa.toFixed(-exponent).replace(/^0\./,'');
    valueStr = parseFloat(valueStr).toFixed(-exponent + 3).replace(/\.?0+$/, '');
  }

  const prompt = `Stelle die Zahl mit Zehnerpotenz so dar, dass sie zwischen 1 und 10 liegt:<br><strong>${valueStr} ${unit}</strong>`;

  // Mantisse für die Antwort auf 3 Nachkommastellen runden
  let answerMantissa = parseFloat(mantissa.toFixed(3));

  // Antwort mit Zehnerpotenz
  const answerHTML = `
    <div class="answer-line"><strong>Darstellung:</strong> ${answerMantissa} · 10<sup>${exponent}</sup> ${unit}</div>
  `;

  return { prompt, answerHTML };
}

//4.Funktion 4
function genNumberToSiExpert() {
  // Zufällige Einheit
  const units = ['m','g','L','s','W','V','A','J','Pa','Hz','Ω','F','H','N'];
  const unit = pickRandom(units);

  // Zufälliger Exponent -12..12
  const exponent = Math.floor(Math.random() * 25) - 12;
  // Zufällige Mantisse 1..10
  const mantissa = Math.random() * 9 + 1;
  // Ursprüngliche Zahl
  const value = mantissa * Math.pow(10, exponent);

  // Aufgabe: zufällig normal oder als Zehnerpotenz
  const useExponent = Math.random() < 0.5;
  let valueStr;

  if (useExponent) {
    // Mantisse zwischen 1 und 10, Exponent wie oben
    let mant = parseFloat(mantissa.toFixed(3));
    valueStr = `${mant} · 10<sup>${exponent}</sup> ${unit}`;
  } else {
    // Zahl ohne Zehnerpotenz sauber formatieren
    // max 12 Nachkommastellen, keine e-Notation
    let str = value.toFixed(12);
    // Überflüssige Nullen und Punkt entfernen
    str = str.replace(/\.?0+$/,'');
    valueStr = `${str} ${unit}`;
  }

  const prompt = `Stelle die Zahl mit SI-Vorsilbe dar:<br><strong>${valueStr}</strong>`;

  // Lösung: Zahl so skalieren, dass sie zwischen 1 und 100 liegt
  let suitablePrefixes = prefixes.filter(p => value / Math.pow(10, p.exp) <= 100);
  let closest = suitablePrefixes.length ? suitablePrefixes[suitablePrefixes.length - 1] : prefixes[0];

  const scaled = value / Math.pow(10, closest.exp);

  const answerHTML = `
    <div class="answer-line"><strong>Zahl:</strong> ${parseFloat(scaled.toFixed(3))} ${closest.sym}${unit}</div>
    <div class="answer-line"><strong>Vorsilbe:</strong> ${closest.name} (${closest.sym})</div>
  `;

  return { prompt, answerHTML };
}




}); // Ende DOMContentLoaded
