class Character{
    constructor(name,health){
        this.name = name;
        this.health = health;
        this.maxHealth = health;
    }

    attack(target){
        let hitRoll = Math.random()
        if (hitRoll < 0.10) {
            combatLog.innerText = `${this.name} MISSED!`;
            combatLog.style.color = 'gray';
            combatHistory.push(combatLog.innerText);
            return; 
        }
        let critRoll = Math.random();
        let dmg = 10;
        let isCrit = false;

        if (critRoll < 0.20){
            dmg = dmg * 2;
            isCrit = true;
        }

        target.health -= dmg

        if (isCrit){
            combatLog.innerText = `CRITICAL HIT! ${this.name} deals ${dmg} damage!`;
            combatLog.style.color = '#ffffe0';
            combatHistory.push(combatLog.innerText);
        }
        else{
            combatLog.innerText = `${this.name} attacks for ${dmg} damage.`;
            combatLog.style.color = 'white';
            combatHistory.push(combatLog.innerText);
        }
    }
}

class Warrior extends Character{
    attack(target){
        let hitRoll = Math.random();
        
        // Warrior has better aim (only 5% miss chance)
        if (hitRoll < 0.05) { 
            combatLog.innerText = `${this.name} stumbled and MISSED!`;
            combatHistory.push(combatLog.innerText);
            return;
        }
        let damage = Math.floor(Math.random() * (25 - 15) + 15);
        target.health -= damage;
        combatLog.innerText = `Warrior SLASHES for ${damage} damage!`;
        combatLog.style.color = '#52f252'; // Hero Green
        combatHistory.push(combatLog.innerText);
    }
}

let combatHistory = [];

let isFighting = false;
let combatLog = document.getElementById('combat-log');
let hero = new Warrior('Warrior',100);
let monster = new Character('Monster',150);

let hero_name = document.getElementById('hero-name');
let hero_health_bar = document.getElementById('hero-health-bar');
let monster_name = document.getElementById('monster-name');
let monster_health_bar = document.getElementById('monster-health-bar');
let monsterCard = document.getElementById('monster-content');
let heroCard = document.getElementById('hero-content');


let overlay = document.getElementById('game-overlay');
let message = document.getElementById('game-message');
let resetBtn = document.getElementById('reset-btn');





hero_name.innerText = hero.name;

monster_name.innerText = monster.name;
updateBars()

let monster_attack = document.getElementById('attack-btn-m')
let hero_attack = document.getElementById('attack-btn-h');
hero_attack.addEventListener('click',function(){
    if (isFighting){
        return;
    }
    isFighting = true;
    hero_attack.style.opacity = '0.5';
    if (hero.health <= 0 || monster.health <= 0) return;
    hero.attack(monster);
    animateHit(monsterCard);
    updateBars();

    if (monster.health <= 0){
        endGame("VICTORY");
        return;
    }
    setTimeout(() =>{
        if (monster.health > 0){
            monster.attack(hero);
            animateHit(heroCard);
            updateBars();
            isFighting = false;
            hero_attack.style.opacity = '1';
            if (hero.health <= 0){
                endGame("YOU DIED...")
            }
        }
    },600);
})
    

function updateBars(){
    if (hero.health < 0) hero.health = 0;
    if (monster.health < 0) monster.health = 0;

    hero_health_bar.style.width = (hero.health/hero.maxHealth)*100 + '%';
    monster_health_bar.style.width = (monster.health/monster.maxHealth)*100 + '%';
}

function animateHit(card) {
    card.classList.add('hit-animation');
    setTimeout(() => {
        card.classList.remove('hit-animation');
    }, 500);
}


function endGame(resultText) {
    message.innerText = resultText;
    
    // Show the overlay
    overlay.style.display = 'block'; 
    
    // Disable attack button visually (optional polish)
    hero_attack.disabled = true;
    hero_attack.style.opacity = '0.5';
    displayHistory();
}

resetBtn.addEventListener('click', function() {
    // 1. Reset Data
    hero.health = hero.maxHealth;
    monster.health = monster.maxHealth;
    isFighting = false;

    // 2. Reset UI
    updateBars();

    
    // 3. Hide Overlay
    overlay.style.display = 'none';
    
    // Re-enable button
    hero_attack.disabled = false;
    hero_attack.style.opacity = '1';
});

function displayHistory(){
    combatHistory.forEach((item) => {
        console.log(item);
    })
    console.log("Critical hits:",getCriticalHits());
    console.log(getNumberedHistory());
}

function getCriticalHits(){
    return combatHistory.filter((msg) => msg.includes("CRITICAL"));
}

function getNumberedHistory() {
    return combatHistory.map((msg, index) => {
        return `${index+1}.${msg}`;
    });
}