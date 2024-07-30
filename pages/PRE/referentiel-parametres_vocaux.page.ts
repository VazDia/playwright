/**
 * 
 * PREPARATION PAGE > REFERENTIEL / ONGLET > PARAMETRES VOCAUX
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefParametresVocauxPage {

   
    public readonly inputTempsMoyen         : Locator  //.locator('[ng-model="parametre.valeur"]');  

    public readonly buttonEnregistrerModif  : Locator  //.locator('[ng-click="save()"]');    

    public readonly dataGridListesTaches    : Locator  //.locator('.tab-parametres-vocaux .datagrid-table-wrapper > table > thead > tr > th');  

    constructor(page:Page){

        this.inputTempsMoyen         = page.locator('[ng-model="parametre.valeur"]');  

        this.buttonEnregistrerModif  = page.locator('[ng-click="save()"]');    

        this.dataGridListesTaches    = page.locator('.tab-parametres-vocaux .datagrid-table-wrapper > table > thead > tr > th');  
    }
}