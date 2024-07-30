/**
 * 
 * Paramètres propres à l'application MAGASIN
 * 
 * @author Vazoumana DIARRASSOUBA
 * @version 3.0
 * 
 */

import { TestFunctions } from "@helpers/functions";

export default class  LocalConfigFile {

    public data: any;

    constructor(fonction?:TestFunctions){

        this.data = {
            URL : {
                integration : 'http://magasin.int.sigale.prosol.pri/',
                integration2: 'http://app1.int2.sigale.prosol.pri:9087/',
                formation   : 'http://app1.form.sigale.prosol.pri:9087/',
                fab         : 'http://app1.fab.sigale.prosol.pri:9087/',
                demo        : 'http://magasin-app.demo.sigale.prosol.pri:9087/',
                preprod     : 'http://magasin-app1.prep.sigale.prosol.pri:80/',
                REC1        : 'http://10.147.100.192:9087/',
                AVS         : 'http://magasin-app.prep.sigale.prosol.pri:80'
            },
            defaultUser             : 'lunettes',
            designationGroupe       : 'TEST-AUTO',
            nomGroupeCommande       : 'TEST-GroupeCommande',
            gammeToRecomm           : ['TA_Designation3 ' + fonction.getToday() + '/' + 'Elaborés', 'TA_Designation4 ' + fonction.getToday() + '/' + 'Marée'],
            gammeToUpdate           : 'TA_Designation1 ' + fonction.getToday() + '/' + 'Poissonnerie',
            gammesToDelete          : ['TA_Designation1 ' + fonction.getToday(), 'TA_Designation2 ' + fonction.getToday(), 'TA_Designation3 ' + fonction.getToday(),  'TA_Designation4 ' + fonction.getToday()],
            listeVilles             : ['Bergerac', 'Bron', 'Compiègne', 'Gaillarde', 'Mérignac', 'Toulouse'],
            ville                   : 'Malemort (G914)',                // Ville exploitée par défaut si cet argument n'est pas transmis au navigateur
            articlesCibles          : [5300, 5100, 5070],               // Liste d'articles
            codeArticle             : 5700,                             // Article par défaut
            stockEmballage          : 4,
            conFileName             : __filename,                       // Paramètre réservé (Cartouche Info)
            groupeArticle           : 'FL',                             // Code groupe Article par défaut si info non transmise au navigateur
            environnement           : 'integration',
            aGroupesArticles        : {
                'CC'    : 'Coupe / Corner',
                'FD'    : 'Fraîche découpe',
                'FL'    : 'Fruits et légumes',
                'FLS'   : 'Frais LS',
                'maree' : 'Marée',
                'negoce': 'Négoce',
                'TDLM'  : 'Traiteur de la mer',
                'tous'  : 'Tous'
            },
            aAutoriEchanges     : [ 
                ['GF234PO', 'GF153PO', 'GF153PO'], 
                ['GF144FL', 'GF202FL', 'GF202FL'], 
                ['GC912CR', 'GC105CR', 'GC105CR'] 
            ],
    
        };
    }

    public getData = () => {
        return this.data
    }
}