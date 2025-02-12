export const Traditional = require("../assets/mead/traditional.jpg");
export const Sack = require("../assets/mead/sack.jpg");
export const Hydromel = require("../assets/mead/hydromel.jpg"); 
export const Melomel = require("../assets/mead/melomel.jpg"); 
export const Cyser = require("../assets/mead/cyser.jpg"); 
export const Pyment = require("../assets/mead/pyment.jpg"); 
export const Metheglin = require("../assets/mead/metheglin.jpg"); 
export const Braggot = require("../assets/mead/braggot.jpg"); 
export const Acerglyn = require("../assets/mead/acerglyn.jpg"); 
export const Bochet = require("../assets/mead/bochet.jpg"); 
export const Capsicumel = require("../assets/mead/capsicumel.jpg"); 
export const Rhodomel = require("../assets/mead/rhodomel.jpg"); 
export const Black = require("../assets/mead/black.jpg"); 
export const Coffeamel = require("../assets/mead/coffeamel.jpg"); 
export const VikingBlood = require("../assets/mead/vikingblood.jpg"); 

export default function Icons(name) {
    switch (name) {
        case "Traditional":
            return Traditional;
        case "Sack":
            return Sack;
        case "Hydromel":
            return Hydromel;
        case "Melomel":
            return Melomel;
        case "Cyser":
            return Cyser;
        case "Pyment":
            return Pyment;
        case "Metheglin":
            return Metheglin;
        case "Braggot":
            return Braggot;
        case "Acerglyn":
            return Acerglyn;
        case "Bochet":
            return Bochet;
        case "Capsicumel":
            return Capsicumel;
        case "Rhodomel":
            return Rhodomel;
        case "Black":
            return Black;
        case "Coffeamel":
            return Coffeamel;
        case "Viking Blood":
            return VikingBlood;
        default:
            return Traditional;
    }
}
