import kaboom from "kaboom";
import { scale } from "./constants";

export const k = kaboom({
    /*fits in 16:9 aspect ratio*/
    width: 296 * scale,
    height: 145 * scale, 
    /*to scale canvas regardless of screen size and while keeping the aspect ratio*/
    letterbox: true,
    /*Work around for a Kaboom bug. Need to both set scaling here and scale sprites so that
    each pixel takes mostly the correct amount of space.*/
    scale:scale,
    /*only be able to kaboom related functions from this constant*/
    global: false,

});