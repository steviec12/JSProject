import { Character } from './Character.js';
import { Warrior } from './Warrior.js';


const HEROES = {
    warrior: { name: "Knight", health: 100, minDmg: 5, maxDmg: 10, image: "images/warrior.png" },
    mage: { name: "Mage", health: 70, minDmg: 8, maxDmg: 15, image: "images/mage.png" },
    rogue: { name: "Rogue", health: 80, minDmg: 6, maxDmg: 12, image: "images/rogue.png" }
};

//  DATA 
let combatHistory = [];
let attackCallbacks = [];

// DOM ELEMENTS
let combatLog = document.getElementById('combat-log');
let hero = null;
let monster = new Character('Loading...', 100);

let hero_name = document.getElementById('hero-name');
let hero_health_bar = document.getElementById('hero-health-bar');
let monster_name = document.getElementById('monster-name');
let monster_health_bar = document.getElementById('monster-health-bar');
let monsterCard = document.getElementById('monster-content');
let heroCard = document.getElementById('hero-content');

let overlay = document.getElementById('game-overlay');
let message = document.getElementById('game-message');
let resetBtn = document.getElementById('reset-btn');

// === HERO SELECTION ===
const heroSelection = document.getElementById('hero-selection');
const gameContainer = document.getElementById('game-container');
const heroOptions = document.querySelectorAll('.hero-option');

heroOptions.forEach(option => {
    option.addEventListener('click', function() {
        let heroType = this.dataset.hero;
        let heroData = HEROES[heroType];
        
        // Create hero with selected stats
        hero = new Warrior(heroData.name, heroData.health);
        hero.minDmg = heroData.minDmg;
        hero.maxDmg = heroData.maxDmg;
        
        // Update UI
        document.querySelector('.hero-image').src = heroData.image;
        hero_name.innerText = hero.name;
        updateBars();
        
        // Hide selection, show game
        heroSelection.style.display = 'none';
        gameContainer.style.display = 'grid';
        
        // Load monster
        loadMonsters();
    });
});

//hero_name.innerText = hero.name;
//monster_name.innerText = monster.name;
//updateBars();

// === ATTACK BUTTON ===
let isFighting = false;
let hero_attack = document.getElementById('attack-btn-h');

hero_attack.addEventListener('click', function() {
    if (isFighting) return;
    isFighting = true;
    hero_attack.style.opacity = '0.5';
    if (hero.health <= 0 || monster.health <= 0) return;
    
    hero.attack(monster, combatLog, combatHistory, attackCallbacks);
    animateHit(monsterCard);
    updateBars();

    if (monster.health <= 0) {
        endGame("VICTORY");
        return;
    }
    
    setTimeout(() => {
        if (monster.health > 0) {
            monster.attack(hero, combatLog, combatHistory, attackCallbacks);
            animateHit(heroCard);
            updateBars();
            isFighting = false;
            hero_attack.style.opacity = '1';
            if (hero.health <= 0) {
                endGame("YOU DIED...");
            }
        }
    }, 600);
});

// === FUNCTIONS ===
function updateBars() {
    if (hero.health < 0) hero.health = 0;
    if (monster.health < 0) monster.health = 0;
    hero_health_bar.style.width = (hero.health / hero.maxHealth) * 100 + '%';
    monster_health_bar.style.width = (monster.health / monster.maxHealth) * 100 + '%';
}

function animateHit(card) {
    card.classList.add('hit-animation');
    setTimeout(() => card.classList.remove('hit-animation'), 500);
}

function endGame(resultText) {
    message.innerText = resultText;
    overlay.style.display = 'block';
    hero_attack.disabled = true;
    hero_attack.style.opacity = '0.5';
    displayHistory();
    if (resultText === 'VICTORY'){
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
   
}

resetBtn.addEventListener('click', function() {
    hero.health = hero.maxHealth;
    monster.health = monster.maxHealth;
    isFighting = false;
    updateBars();
    overlay.style.display = 'none';
    hero_attack.disabled = false;
    hero_attack.style.opacity = '1';
});

function displayHistory() {
    combatHistory.forEach((item) => console.log(item));
    console.log("Critical hits:", getCriticalHits());
    console.log(getNumberedHistory());
}

function getCriticalHits() {
    return combatHistory.filter((msg) => msg.includes("CRITICAL"));
}

function getNumberedHistory() {
    return combatHistory.map((msg, index) => `${index + 1}. ${msg}`);
}

function onAttack(callback) {
    attackCallbacks.push(callback);
}


function createDamagetracker() {
    let tolDamage = 0;
    return function(damage) {
        tolDamage = tolDamage + damage;
        console.log("Total Damage: " + tolDamage);
        return tolDamage;
    };
}

let tracker = createDamagetracker();
onAttack(function(dmg) {
    console.log("Damage dealt:", dmg);
    tracker(dmg);
});

async function loadMonsters(){
    try{
        let info = await fetch('https://www.dnd5eapi.co/api/monsters');
        let list = await info.json();
        let monsters = list.results;
        let idx = Math.floor(Math.random()*monsters.length);
        let randomMonster = monsters[idx];

        let monsterResponse = await fetch('https://www.dnd5eapi.co/api/monsters/' + randomMonster.index);
        let monsterData = await monsterResponse.json();
        
        monster = new Character(monsterData.name, monsterData.hit_points);
        monster_name.innerText = monster.name;
        updateBars();
        console.log("Loaded:", monster.name, "with", monster.health, "HP");
    }
    catch (error) {
        console.log("Error:", error);
    }

   
}

//loadMonsters();