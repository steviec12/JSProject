import { Character } from './Character.js';

export class Warrior extends Character {
    constructor(name,health){
        super(name,health);
        this.mindmg = 5;
        this.maxdmg = 10;
    }
    attack(target, combatLog, combatHistory, attackCallbacks) {
        let hitRoll = Math.random();
        
        // Warrior has better aim (only 5% miss chance)
        if (hitRoll < 0.05) {
            combatLog.innerText = `${this.name} stumbled and MISSED!`;
            combatHistory.push(combatLog.innerText);
            return;
        }
        
        let damage = Math.floor(Math.random() * (this.maxdmg - this.mindmg) + this.mindmg);
        target.health -= damage;
        combatLog.innerText = `Warrior SLASHES for ${damage} damage!`;
        combatLog.style.color = '#52f252';
        combatHistory.push(combatLog.innerText);
        
        attackCallbacks.forEach((cb) => {
            cb(damage);
        });
    }
}