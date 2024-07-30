/**
 * 
 * PREPARATION PAGE > AUTRES TRAVAUX / ONGLET > HISTORIQUE 
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class AurtresTravTHistoriquePage {

    public readonly datePickerFrom         : Locator //.locator('#input-start-date');
    public readonly datePickerTo           : Locator //.locator('#input-end-date');    
    
    public readonly inputSearchPreparateur : Locator //.locator('#preparateur-id');  
    
    public readonly listBoxTache           : Locator //.locator('#filtre-tache');

    public readonly buttonRechercher       : Locator //.locator('[ng-click="rechercherTachesHistorique()"]');    

    public readonly dataGridListesTaches   : Locator //.locator('#form-taches-historique .datagrid-table-wrapper > table > thead > tr > th');   

    constructor(page:Page){

        this.datePickerFrom          = page.locator('#input-start-date');
        this.datePickerTo            = page.locator('#input-end-date');    
        
        this.inputSearchPreparateur  = page.locator('#preparateur-id');  
        
        this.listBoxTache            = page.locator('#filtre-tache');

        this.buttonRechercher        = page.locator('[ng-click="rechercherTachesHistorique()"]');    

        this.dataGridListesTaches    = page.locator('#form-taches-historique .datagrid-table-wrapper > table > thead > tr > th'); 
    }
}