/**
 * 
 * Appli    : PREPARATION 
 * PAGE     : AUTRES TRAVAUX
 * ONGLET   : TACHES DU JOUR  
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.1
 * 
 */

import { Locator, Page } from "@playwright/test"

export class AurtresTacheDuJourPage {

    
    public readonly buttonTacheAdd          : Locator;  // .locator('[ng-click="popupCreationModificationTache()"]');
    public readonly buttonTacheUpdate       : Locator;  // .locator('[ng-click="popupCreationModificationTache(tachesSelectionnees[0])"]');
    public readonly buttonTacheDelete       : Locator;  // .locator('[ng-click="supprimerTache(tachesSelectionnees[0])"]');   
    public readonly buttonImpAutresTaches   : Locator;
    
    public readonly inputSearchPreparateur  : Locator;  // .locator('[ng-model="ngModel"]');    

    public readonly listBoxTache            : Locator;  // .locator('#filtre-tache');

    public readonly checkBoxAfficherTermine : Locator;  // .locator('#checkbox-toggle-articles');    

    public readonly dataGridListetaches     : Locator;  // .locator('.taches-du-jour .datagrid-table-wrapper > table > thead > tr > th'); 
    
    //-- Popin : Créer une tâche ---------------------------------------------------------------------------------------------
    public readonly pPopinCreerTache        : Locator;
    public readonly pButtonCreer            : Locator;  // .locator('div.modal.hide.in > div.modal-footer > button').nth(0);  
    public readonly pButtonAnnuler          : Locator;  // .locator('div.modal.hide.in > div.modal-footer > a'); 

    public readonly pInputPrepareteur       : Locator;  // .locator('#preparateur-id');
    public readonly pInputHeureDebut        : Locator;  // .locator('[ng-model="model.heureDebut"]');
    public readonly pInputMinuteDebut       : Locator;  // .locator('[ng-model="model.minuteDebut"]');
    public readonly pInputHeureFin          : Locator;  // .locator('[ng-model="model.heureFin"]');
    public readonly pInputMinuteFin         : Locator;  // .locator('[ng-model="model.minuteFin"]');

    public readonly pListBoxTache           : Locator;  // .locator('#tache-id');

    public readonly pTextAreaCommentaire    : Locator;  // .locator('[ng-model="model.commentaire"]');

    public readonly pAutoCompleteNomPrepa   : Locator;  // .locator('.gfit-autocomplete-results li');

    //-- Popin : Impression des autres tâches ----------------------------------------------------------------------------------------------------------
    public readonly pPopinImpAutresTaches   : Locator;
    public readonly pInputFieldNombreImp    : Locator;
    public readonly pButtonImprimer         : Locator;
    public readonly pLinkFermer             : Locator;

    constructor(page:Page){
        
        this.buttonTacheAdd          = page.locator('[ng-click="popupCreationModificationTache()"]');
        this.buttonTacheUpdate       = page.locator('[ng-click="popupCreationModificationTache(tachesSelectionnees[0])"]');
        this.buttonTacheDelete       = page.locator('[ng-click="supprimerTache(tachesSelectionnees[0])"]');  
        this.buttonImpAutresTaches   = page.locator('[ng-click="imprimerTypesTaches()"]') 
        
        this.inputSearchPreparateur  = page.locator('[ng-model="ngModel"]');    

        this.listBoxTache            = page.locator('#filtre-tache');

        this.checkBoxAfficherTermine = page.locator('#checkbox-toggle-articles');    

        this.dataGridListetaches     = page.locator('.taches-du-jour .datagrid-table-wrapper > table > thead > tr > th'); 
        
        //-- Popin : Créer une tâche ---------------------------------------------------------------------------------------------
        this.pPopinCreerTache        = page.locator('.modal-backdrop');
        this.pButtonCreer            = page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);  
        this.pButtonAnnuler          = page.locator('div.modal.hide.in > div.modal-footer > a'); 

        this.pInputPrepareteur       = page.locator('#preparateur-id');
        this.pInputHeureDebut        = page.locator('[ng-model="model.heureDebut"]');
        this.pInputMinuteDebut       = page.locator('[ng-model="model.minuteDebut"]');
        this.pInputHeureFin          = page.locator('[ng-model="model.heureFin"]');
        this.pInputMinuteFin         = page.locator('[ng-model="model.minuteFin"]');

        this.pListBoxTache           = page.locator('#tache-id');

        this.pTextAreaCommentaire    = page.locator('[ng-model="model.commentaire"]');

        this.pAutoCompleteNomPrepa   = page.locator('.gfit-autocomplete-results li');

        // -- Popin : Impression des tâches --------------------------------------------------------------------------------------------------
        this.pPopinImpAutresTaches   = page.locator('div.p-dialog-header');

        this.pInputFieldNombreImp    = page.locator('div.table-types-tache input');

        this.pButtonImprimer         = page.locator('p-footer button');

        this.pLinkFermer             = page.locator('p-footer a');

    }
    
}