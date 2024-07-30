/**
 * 
 * Paramètres propres à l'application PREPARATION
 * 
 * @author SIAKA KONE
 * @version 3.1
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;

    constructor(fonction?:TestFunctions){
        this.data = {
            // Arguments
            conFileName         : __filename,                       // Paramètre réservé (Cartouche Info)
            nomPreparateur      : 'TEST-AUTO_Nom' + fonction.getToday('us')
        };
    }

    public getData = () => {
        return this.data;
    }  
}