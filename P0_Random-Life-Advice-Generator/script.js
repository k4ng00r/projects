const advices = [
  'Nie odpisuj na maile po północy 😴',
  'Bootcamp raz w życiu, drama na zawsze 😂',
  'AI może i sprytnie podpowiada, ale Twój kod – Twój honor 💪',
  'Kawa to najlepszy debugger ☕',
  'Nie martw się, nawet junior ma prawo do błędów 🤷‍♂️'
];

const colors = ['#C1440E','#E4D3B3','#5A7359','#2A9DF4','#FF7F32', '#8B8C84', '#A0522D'];
const btn = document.querySelector('#advice-btn');
const display = document.querySelector('#advice-display');

btn.addEventListener('click', () => {
  const randomAdvice = advices[Math.floor(Math.random() * advices.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.backgroundColor = randomColor;

  // Fade-out
  display.style.transition = 'opacity 0.25s, transform 0.25s';
  display.style.opacity = '0';
  display.style.transform = 'translateY(10px)';

  setTimeout(() => {
    // change text
    display.textContent = randomAdvice;

    // Fade-in
    display.style.opacity = '1';
    display.style.transform = 'translateY(0)';
  }, 250);
});
