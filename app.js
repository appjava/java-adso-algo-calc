// Configuración de figuras
const shapes2D = {
    cuadrado: { name: 'Cuadrado', inputs: ['lado'] },
    rectangulo: { name: 'Rectángulo', inputs: ['base', 'altura'] },
    triangulo: { 
      name: 'Triángulo Rectángulo', 
      inputs: [
        { id: 'cateto_a', label: 'Cateto A (o lado adyacente al ángulo recto)' },
        { id: 'cateto_b', label: 'Cateto B (o lado opuesto al ángulo recto)' },
        { id: 'hipotenusa', label: 'Hipotenusa (dejar en blanco si no se conoce)' }
      ]
    },
    circulo: { name: 'Círculo', inputs: ['radio'] }
  };
  
  const shapes3D = {
    cubo: { name: 'Cubo', inputs: ['lado'] },
    esfera: { name: 'Esfera', inputs: ['radio'] },
    cilindro: { name: 'Cilindro', inputs: ['radio', 'altura'] },
    cono: { name: 'Cono', inputs: ['radio', 'altura'] },
    piramide: { name: 'Pirámide (base cuadrada)', inputs: ['lado_base', 'altura'] }
  };
  
  // Elementos del DOM
  const menuSection = document.getElementById('menu');
  const formSection = document.getElementById('form-section');
  const volverBtn = document.getElementById('btn-volver');
  const shapeSelect = document.getElementById('shape-select');
  const inputsDiv = document.getElementById('inputs');
  const resultDiv = document.getElementById('result');
  const formTitle = document.getElementById('form-title');
  const btn2D = document.getElementById('btn2d');
  const btn3D = document.getElementById('btn3d');
  const btnCalcular = document.getElementById('btn-calcular');
  
  let mode = null;
  
  // Eventos
  btn2D.addEventListener('click', () => initMode('2d'));
  btn3D.addEventListener('click', () => initMode('3d'));
  volverBtn.addEventListener('click', () => {
    menuSection.style.display = 'block';
    formSection.style.display = 'none';
    volverBtn.style.display = 'none';
    resultDiv.style.display = 'none';
  });
  shapeSelect.addEventListener('change', renderInputs);
  btnCalcular.addEventListener('click', calculate);
  
  function initMode(m) {
    mode = m;
    menuSection.style.display = 'none';
    formSection.style.display = 'block';
    volverBtn.style.display = 'block';
    resultDiv.style.display = 'none';
  
    const shapes = mode === '2d' ? shapes2D : shapes3D;
    formTitle.textContent = mode === '2d' ? 'Figuras Planas (2D)' : 'Sólidos Regulares (3D)';
  
    // Llenar select
    shapeSelect.innerHTML = '';
    Object.keys(shapes).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = shapes[key].name;
      shapeSelect.appendChild(opt);
    });
  
    renderInputs();
  }
  
  function renderInputs() {
    const shapeKey = shapeSelect.value;
    inputsDiv.innerHTML = '';
  
    if (mode === '2d' && shapeKey === 'triangulo') {
      // Triángulo rectángulo
      shapes2D.triangulo.inputs.forEach(input => {
        const label = document.createElement('label');
        label.textContent = input.label + ':';
        label.htmlFor = input.id;
  
        const inputEl = document.createElement('input');
        inputEl.type = 'number';
        inputEl.id = input.id;
        inputEl.step = 'any';
        inputEl.placeholder = input.label;
  
        inputsDiv.appendChild(label);
        inputsDiv.appendChild(inputEl);
      });
    } else {
      // Caso general
      const shapes = mode === '2d' ? shapes2D : shapes3D;
      const shape = shapes[shapeKey];
      shape.inputs.forEach(inputName => {
        const label = document.createElement('label');
        label.textContent = `Ingrese ${inputName.replace(/_/g, ' ')}:`;
        label.htmlFor = inputName;
  
        const input = document.createElement('input');
        input.type = 'number';
        input.id = inputName;
        input.step = 'any';
        input.min = '0';
        input.placeholder = `Valor de ${inputName.replace(/_/g, ' ')}`;
  
        inputsDiv.appendChild(label);
        inputsDiv.appendChild(input);
      });
    }
  }
  
  function calculate() {
    const shapeKey = shapeSelect.value;
    resultDiv.style.display = 'block';
  
    if (mode === '2d' && shapeKey === 'triangulo') {
      calculateRightTriangle();
      return;
    }
  
    // Resto de figuras
    const shapes = mode === '2d' ? shapes2D : shapes3D;
    const shape = shapes[shapeKey];
    const values = {};
    let missing = false;
  
    shape.inputs.forEach(name => {
      const el = document.getElementById(name);
      const val = parseFloat(el.value);
      if (isNaN(val) || val <= 0) {
        missing = true;
        el.style.border = '2px solid red';
      } else {
        el.style.border = '';
        values[name] = val;
      }
    });
  
    if (missing) {
      resultDiv.innerHTML = '⚠️ Por favor, complete todos los campos con valores válidos.';
      resultDiv.style.borderLeftColor = '#f44336';
      return;
    }
  
    let result = '';
    const pi = Math.PI;
  
    if (mode === '2d') {
      let area, perimetro;
      switch (shapeKey) {
        case 'cuadrado':
          area = values.lado ** 2;
          perimetro = 4 * values.lado;
          break;
        case 'rectangulo':
          area = values.base * values.altura;
          perimetro = 2 * (values.base + values.altura);
          break;
        case 'circulo':
          area = pi * values.radio ** 2;
          perimetro = 2 * pi * values.radio;
          break;
      }
      result = `Área: ${area.toFixed(2)}<br>Perímetro: ${perimetro.toFixed(2)}`;
    } else {
      let volumen;
      switch (shapeKey) {
        case 'cubo':
          volumen = values.lado ** 3;
          break;
        case 'esfera':
          volumen = (4 / 3) * pi * values.radio ** 3;
          break;
        case 'cilindro':
          volumen = pi * values.radio ** 2 * values.altura;
          break;
        case 'cono':
          volumen = (1 / 3) * pi * values.radio ** 2 * values.altura;
          break;
        case 'piramide':
          const areaBase = values.lado_base ** 2;
          volumen = (1 / 3) * areaBase * values.altura;
          break;
      }
      result = `Volumen: ${volumen.toFixed(2)}`;
    }
  
    resultDiv.innerHTML = result;
    resultDiv.style.borderLeftColor = '#4CAF50';
  }
  
  function calculateRightTriangle() {
    const aEl = document.getElementById('cateto_a');
    const bEl = document.getElementById('cateto_b');
    const hEl = document.getElementById('hipotenusa');
  
    const a = aEl.value ? parseFloat(aEl.value) : null;
    const b = bEl.value ? parseFloat(bEl.value) : null;
    const h = hEl.value ? parseFloat(hEl.value) : null;
  
    // Restablecer bordes
    aEl.style.border = '';
    bEl.style.border = '';
    hEl.style.border = '';
  
    let catetoA, catetoB, hipotenusa;
  
    // Validar que al menos dos valores estén presentes
    const known = [a, b, h].filter(x => x !== null).length;
    if (known < 2) {
      resultDiv.innerHTML = '⚠️ Ingrese al menos dos valores (dos lados del triángulo rectángulo).';
      resultDiv.style.borderLeftColor = '#f44336';
      return;
    }
  
    // Caso 1: Se conocen ambos catetos
    if (a !== null && b !== null) {
      if (a <= 0 || b <= 0) {
        resultDiv.innerHTML = '⚠️ Los lados deben ser mayores que cero.';
        resultDiv.style.borderLeftColor = '#f44336';
        return;
      }
      catetoA = a;
      catetoB = b;
      hipotenusa = Math.sqrt(a * a + b * b);
    }
    // Caso 2: Se conoce cateto A y hipotenusa
    else if (a !== null && h !== null) {
      if (a <= 0 || h <= 0 || h <= a) {
        resultDiv.innerHTML = '⚠️ La hipotenusa debe ser mayor que el cateto.';
        resultDiv.style.borderLeftColor = '#f44336';
        return;
      }
      catetoA = a;
      hipotenusa = h;
      catetoB = Math.sqrt(h * h - a * a);
    }
    // Caso 3: Se conoce cateto B y hipotenusa
    else if (b !== null && h !== null) {
      if (b <= 0 || h <= 0 || h <= b) {
        resultDiv.innerHTML = '⚠️ La hipotenusa debe ser mayor que el cateto.';
        resultDiv.style.borderLeftColor = '#f44336';
        return;
      }
      catetoB = b;
      hipotenusa = h;
      catetoA = Math.sqrt(h * h - b * b);
    }
    else {
      resultDiv.innerHTML = '⚠️ Combinación inválida. Ingrese dos lados válidos.';
      resultDiv.style.borderLeftColor = '#f44336';
      return;
    }
  
    // Calcular área y perímetro
    const area = (catetoA * catetoB) / 2;
    const perimetro = catetoA + catetoB + hipotenusa;
  
    resultDiv.innerHTML = `
      Área: ${area.toFixed(2)}<br>
      Perímetro: ${perimetro.toFixed(2)}<br>
      <small>Lados calculados: Cateto A = ${catetoA.toFixed(2)}, Cateto B = ${catetoB.toFixed(2)}, Hipotenusa = ${hipotenusa.toFixed(2)}</small>
    `;
    resultDiv.style.borderLeftColor = '#4CAF50';
  }
