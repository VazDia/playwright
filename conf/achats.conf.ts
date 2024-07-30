/**
 * 
 * Paramètres propres à l'application ACHATS
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
            conFileName         : __filename,                       // Paramètre réservé (Cartouche Info)    
            ville               : 'Albi',          
            fournisseur         : 'Comexa',
            environnement       : 'integration',
            codeArticle         : '5300',                           // Code article commandé par défaut  
            libelleArticle      : '5300 - Banane',                  // Libellé article commandé par défaut
            codeFournisseur     : '00015',                          // Fruidor lyon';
            codeMagasin         : '211',                            // Albi';    
            idRayon             : 4,                                // Fruits et légumes    
            gencod              : 3700551500000,                    // Gencod de référence servant de parent
            dossierAchat        : 'TA_ Dossier Achat - ' + fonction.getToday('us')
        }
    }
   
    public getData = () => {
        return this.data;
    }

}
