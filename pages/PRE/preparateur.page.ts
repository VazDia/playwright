/**
 * 
 * APPLI    : PREPARATION 
 * PAGE     : PRODUCTIVITE
 * ONGLET   : GESTION PREPARATEURS
 * 
 * @author Vazoumana Diarrassouba
 * @version 3.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class ProdGestionPreparateursPage {

    public readonly inputCodeIdentification     : Locator;  //.Locator;('#code');   
    public readonly inputNumeroSupport          : Locator;  //.Locator;('form input');

    public readonly feedBackMessage             : Locator;  //.Locator;('span.ui-dialog-title');

    public readonly labelNomPreparateur         : Locator;  //.Locator;('span.nom-preparateur');

    public readonly messageErreur               : Locator;  

    //-- Popin : Erreur de lecture Matricule ------------------------------------------------------------------------------------------
    public readonly pPbuttonErrMatriculeRetour : Locator;  //.Locator;('p-dialog button');               

    //-- Popin : Erreur de lecture Feuille  -------------------------------------------------------------------------------------------
    public readonly pPbuttonErrFeuilleRetour   : Locator;  //.Locator;('#modalBoutonRetour');  

    constructor(page: Page){

        this.inputCodeIdentification    = page.locator('#code');   
        this.inputNumeroSupport         = page.locator('form input');

        this.feedBackMessage            = page.locator('span.ui-dialog-title');

        this.labelNomPreparateur        = page.locator('span.nom-preparateur');

        this.messageErreur              = page.locator('div[role=dialog]').nth(0);

        //-- Popin : Erreur de lecture Matricule ------------------------------------------------------------------------------------------
        this.pPbuttonErrMatriculeRetour = page.locator('p-dialog button');               

        //-- Popin : Erreur de lecture Feuille  -------------------------------------------------------------------------------------------
        this.pPbuttonErrFeuilleRetour   = page.locator('#modalBoutonRetour');  
    }
    
}