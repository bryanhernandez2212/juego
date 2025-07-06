const NUM_BOXES = 5;
// Números 1-3 aleatorios, 4 penúltimo, 5 último
function getBoxNumbers() {
    const nums = [1, 2, 3];
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return [...nums, 4, 5];
}
const boxNumbers = getBoxNumbers();
const doubleGiftIndex = Math.floor(Math.random() * NUM_BOXES); // Caja aleatoria con dos regalos

const container = document.getElementById('game-container');
const message = document.getElementById('message');

function createBoxes() {
    for (let i = 0; i < NUM_BOXES; i++) {
        const box = document.createElement('div');
        box.className = 'box';
        box.dataset.index = i;

        // Cinta vertical
        const ribbon = document.createElement('div');
        ribbon.className = 'box-ribbon';
        box.appendChild(ribbon);

        // Base de la caja
        const base = document.createElement('div');
        base.className = 'box-base';
        box.appendChild(base);

        // Tapa de la caja
        const lid = document.createElement('div');
        lid.className = 'box-lid';
        // Lazo
        const bow = document.createElement('div');
        bow.className = 'bow';
        lid.appendChild(bow);
        box.appendChild(lid);

        // Mensaje arriba del número
        const msg = document.createElement('div');
        msg.className = 'message-above-number';
        if (i === doubleGiftIndex) {
            msg.textContent = `¡Felicidades! Tu número de regalo es el ${boxNumbers[i]} y tienes un regalo extra.`;
        } else {
            msg.textContent = `Tu número de regalo es el ${boxNumbers[i]}. ¡Destápalo para ver qué sorpresa es!`;
        }
        box.appendChild(msg);

        // Número grande (inicialmente oculto)
        const bigNumber = document.createElement('div');
        bigNumber.className = 'big-number-above';
        bigNumber.textContent = boxNumbers[i];
        box.appendChild(bigNumber);

        // Bloquear cajas 4 y 5 al inicio
        if (i === 3 || i === 4) {
            box.classList.add('box-disabled');
        }

        box.addEventListener('click', openBox);
        container.appendChild(box);
    }
}

function createSparkles(box) {
    // Más destellos, de diferentes tamaños y colores
    const colors = ['#fffbe7', '#ffd700', '#fff', '#ffe066', '#fff9c4'];
    for (let i = 0; i < 18; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        const size = 6 + Math.random() * 16;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        sparkle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random()*colors.length)]} 60%, #ffd700 100%, transparent 100%)`;
        // Posición aleatoria sobre la caja
        sparkle.style.left = (30 + Math.random() * 50) + 'px';
        sparkle.style.top = (10 + Math.random() * 50) + 'px';
        sparkle.style.animationDelay = (Math.random() * 0.7) + 's';
        sparkle.style.opacity = 0.7 + Math.random() * 0.3;
        box.appendChild(sparkle);
    }
}

function showDedicationCard() {
    const card = document.getElementById('dedication-card');
    card.innerHTML = `<h2>¡Felicidades guerita!</h2><p>Has destapado todos tus regalos.<br>Te deseo mucha alegría y que cada sorpresa sea especial recuerda que eres la mejor guerita del mundo, que siempre estare para ti, no sabes cuanto le agradezco a Diosito por tenerte aún conmigo<br><br>¡Esta carta es para ti, con mucho cariño y de mucho corazón de parte de Bry!</p>`;
    card.style.display = 'flex';
}

function openBox(e) {
    const box = e.currentTarget;
    const index = parseInt(box.dataset.index);
    if (box.classList.contains('box-disabled')) return;

    document.querySelectorAll('.box').forEach(b => {
        if (b !== box && !b.classList.contains('opened')) b.classList.add('box-disabled');
    });
    box.classList.add('box-center');
    setTimeout(() => {
        box.classList.add('opened');
        box.removeEventListener('click', openBox);
        createSparkles(box);
        const bigNumber = box.querySelector('.big-number-above');
        const msg = box.querySelector('.message-above-number');
        bigNumber.classList.add('show-bg');
        msg.classList.add('show-bg');
        bigNumber.style.opacity = '1';
        msg.style.opacity = '1';
        setTimeout(() => {
            setTimeout(() => {
                box.classList.remove('box-center');
                msg.textContent = 'Regalo abierto';
                setTimeout(() => {
                    bigNumber.classList.remove('show-bg');
                    msg.classList.remove('show-bg');
                }, 400);
                const boxes = document.querySelectorAll('.box');
                const openedCount = document.querySelectorAll('.box.opened').length;
                // Solo desbloquear la 4 y 5 cuando ya se hayan abierto 3 cajas
                if (boxes.length - openedCount === 2 && openedCount === 3) {
                    boxes.forEach((b, i) => {
                        if (!b.classList.contains('opened')) b.classList.remove('box-disabled');
                    });
                } else {
                    boxes.forEach(b => b.classList.remove('box-disabled'));
                    boxes.forEach((b, i) => {
                        if ((i === 3 || i === 4) && boxes.length - openedCount > 2) {
                            b.classList.add('box-disabled');
                        }
                    });
                }
                if (openedCount === boxes.length) {
                    showDedicationCard();
                }
            }, 1500);
        }, 900);
    }, 500);
}

function showInstructionsCard() {
    const card = document.getElementById('instructions-card');
    card.innerHTML = `<h2>¡Bienvenido!</h2><p>Hay 5 cajas de regalo frente a ti.<br><br>
    Solo puedes abrir las primeras 3 en el orden que quieras.<br>
    Las dos últimas se desbloquearán cuando hayas destapado las demás.<br><br>
    Haz clic en cada caja para descubrir tu número y una sorpresa especial.<br><br>
    ¡Mucha suerte y disfruta el juego!</p>
    <button id='start-game-btn'>Comenzar</button>`;
    card.style.display = 'flex';
    document.getElementById('game-container').style.filter = 'blur(2px)';
}

function hideInstructionsCard() {
    const card = document.getElementById('instructions-card');
    card.style.display = 'none';
    document.getElementById('game-container').style.filter = '';
}

window.addEventListener('DOMContentLoaded', () => {
    // Fondo de partículas animadas
    const bg = document.getElementById('bg-animated');
    for (let i = 0; i < 32; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 8 + Math.random() * 22;
        p.style.width = p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = (Math.random() * 90 + 2) + 'vh';
        p.style.opacity = 0.5 + Math.random() * 0.5;
        p.style.animationDelay = (Math.random() * 8) + 's';
        bg.appendChild(p);
    }

    createBoxes();

    showInstructionsCard();
    document.getElementById('instructions-card').addEventListener('click', function(e) {
        if (e.target.id === 'start-game-btn') {
            hideInstructionsCard();
        }
    });
}); 