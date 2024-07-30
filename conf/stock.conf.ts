/**
 * 
 * Paramètres propres à l'application STOCK
 * 
 * @author SIAKA KONE
 * @version 3.0
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;

    constructor(fonction?:TestFunctions){
        this.data = {
            
            idPlateforme        : 'CHA',                            // Plateforme par défaut : Chaponnay
            prefixBL            : 'TEST-AUTO-BL',
            codeArticle         : 5300,                             // code article utilisé par défaut
            defaultWeight       : 1,                                // Poids par défaut nécessaire pour certaines plateformes
            conFileName         : __filename,                       // Paramètre réservé (Cartouche Info)
            search              : null,                             // Valeur saisie par défaut dans le champ de recherche   
            environnement       : 'integration',
            nomTransporteur     : 'TEST-AUTO_Nom Transporteur'
        };
    }

    public getData = () => {
        return this.data;
    }  

};

