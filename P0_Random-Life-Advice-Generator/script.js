const jsonFiles = [
  'https://k4ng00r.github.io/projects/P0_Random-Life-Advice-Generator/data/jesus.json',
  'https://k4ng00r.github.io/projects/P0_Random-Life-Advice-Generator/data/budda.json',
  'https://k4ng00r.github.io/projects/P0_Random-Life-Advice-Generator/data/confucius.json',
  'https://k4ng00r.github.io/projects/P0_Random-Life-Advice-Generator/data/socrates.json'
];

const colors = ['#C1440E','#E4D3B3','#5A7359','#2A9DF4','#FF7F32', '#8B8C84', '#A0522D'];
const btn = document.querySelector('#advice-btn');
const display = document.querySelector('#advice-display');

btn.addEventListener('click', async () => {
  try {
    // 1️⃣ draw JSON file
    const randomFile = jsonFiles[Math.floor(Math.random() * jsonFiles.length)];

    // 2️⃣ fetch data
    const response = await fetch(randomFile);
    const advices = await response.json();

    // 3️⃣ draw advice
    const randomAdvice = advices[Math.floor(Math.random() * advices.length)];

    // 4️⃣ draw bgc
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;

    // 5️⃣ animation fade-out + fade-in
    display.style.transition = 'opacity 0.25s, transform 0.25s';
    display.style.opacity = '0';
    display.style.transform = 'translateY(10px)';

    setTimeout(() => {
      display.textContent = randomAdvice;
      display.style.opacity = '1';
      display.style.transform = 'translateY(0)';
    }, 250);

  } catch (err) {
    console.error('Błąd ładowania porady:', err);
    display.textContent = 'Nie udało się pobrać porady 😞';
  }
});
