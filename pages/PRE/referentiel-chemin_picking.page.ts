/**
 * 
 * APPLI    : PREPARATION 
 * PAGE     : REFERENTIEL 
 * ONGLET   : CHEMIN DE PICKING
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefCheminPickingPage {

    public readonly  inputSearchEmplacement     : Locator;  // .locator('[ng-model="ngModel"]');  
    public readonly  inputOrdre                 : Locator;  // .locator('[ng-model="nouvellePosition.ordre"]');
    public readonly  inputEmplacement           : Locator;  // .locator('#autocomplete-emplacement'); 
    public readonly  inputCodeArticle           : Locator;  // .locator('#autocomplete-article');   

    public readonly  buttonCreerChemin          : Locator;  // .locator('[ng-click="popupCreationModificationCheminPicking()"]');
    public readonly  buttonPlus                 : Locator;  // .locator('[ng-click="ajouterPosition(nouvellePosition)"]');    
    public readonly  buttonRecalculerOrdre      : Locator;  // .locator('[ng-click="recalculerOrdre()"]');

    public readonly  dataGridListesTaches       : Locator;  // .locator('.chemin-picking .datagrid-table-wrapper > table > thead > tr > th'); 

    //-- Popin : Créer un chemin -------------------------------------------------------------------------------------------------------
    public readonly  pPopinCreerChemin          : Locator;
    public readonly  pPinputNomChemDesignation  : Locator;  // .locator('#chemin-designation');
    public readonly  pPinputNomChemOrdre        : Locator;  // .locator('#chemin-ordre');

    public readonly  pCheckBoxFusionClient      : Locator;
    
    public readonly  pPbuttonNomChemCreer       : Locator;  // .locator('.form-modifier-chemin-picking .modal-footer button:not(.ng-hide)');
    public readonly  pPbuttonAnnuler            : Locator;

    constructor(page:Page) {

        this.inputSearchEmplacement     = page.locator('[ng-model="ngModel"]');  
        this.inputOrdre                 = page.locator('[ng-model="nouvellePosition.ordre"]');
        this.inputEmplacement           = page.locator('#autocomplete-emplacement'); 
        this.inputCodeArticle           = page.locator('#autocomplete-article');   
    
        this.buttonCreerChemin          = page.locator('[ng-click="popupCreationModificationCheminPicking()"]');
        this.buttonPlus                 = page.locator('[ng-click="ajouterPosition(nouvellePosition)"]');    
        this.buttonRecalculerOrdre      = page.locator('[ng-click="recalculerOrdre()"]');
    
        this.dataGridListesTaches       = page.locator('.chemin-picking .datagrid-table-wrapper > table > thead > tr > th'); 
    
        //-- Popin : Créer un chemin -------------------------------------------------------------------------------------------------------
        this.pPopinCreerChemin          = page.locator('.modal-backdrop');
        this.pPinputNomChemDesignation  = page.locator('#chemin-designation');
        this.pPinputNomChemOrdre        = page.locator('#chemin-ordre');

        this.pCheckBoxFusionClient      = page.locator('.gfit-switch-slider');
    
        this.pPbuttonNomChemCreer       = page.locator('.form-modifier-chemin-picking .modal-footer button:not(.ng-hide)');
        this.pPbuttonAnnuler            = page.locator('.modal-footer a[ng-click="onClickClose($event)"]').nth(0);
    }
}