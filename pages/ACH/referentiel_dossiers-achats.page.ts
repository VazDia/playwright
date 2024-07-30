/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : DOSSIERS D'ACHAT
 * 
 * 
 * @author JC CALVIERA
 * @version 3.0
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefDosAch {

    public readonly buttonReaffecterArticle        : Locator;   //(by.css('[ng-click="reaffecterArticles(dg.selection)"]');
    public readonly buttonCreerDossier             : Locator;   //(by.css('[ng-click="creerDossierAchat()"]');
    public readonly buttonModifierDossier          : Locator;   //(by.css('[ng-click="modifierDossierAchat(filtreDossierAchat)"]');
    public readonly buttonSupprimerDossierVide     : Locator;   //(by.css('[ng-click="supprimerDossierAchat(filtreDossierAchat)"]');        

    public readonly listBoxDossierAchat            : Locator;   //(by.id('select-dossier-achat'); 

    public readonly inputFiltreArticle             : Locator;   //(by.css('.filtre-article-input > input');
    public readonly inputFiltreFournisseur         : Locator;   //(by.css('.filtre-fournisseur-input');

    public readonly dataGridDossierAchat           : Locator;   //.all(by.css('.table-dossiers-achat th');
    public readonly dataGridDossierAchatElements   : Locator;   //.all(by.css('.table-dossiers-achat tbody tr');
    public readonly dataGridDossierAchatCode       : Locator;   //.all(by.css('.table-dossiers-achat tbody tr td:nth-child(2)');

    public readonly dataGridNomDossier             : Locator;   //.all(by.css('td.datagrid-designationDossierAchat');

    public readonly checkBoxListeArticles          : Locator;   //.all(by.css('.table-dossiers-achat td input');

    //-- Popin : Création d'un dossier d'achat -------------------------------------------------------------------------------------
    public readonly pInputNomDossier               : Locator;   //(by.id('designationDossierAchat');

    public readonly pListBoxResponsable            : Locator;   //(by.id('acheteur');
    public readonly pListBoxResoonsableItem        : Locator;

    public readonly pButtonEnregistrerDossier      : Locator;   //(by.css('p-footer button.btn-enregistrer');

    public readonly pLinkAnnulerDossier            : Locator;   //(by.css('p-footer button.p-button-link');    

    public readonly pFeedBackErrorDossier          : Locator;   //(by.css('div.alert-danger:NOT(.ng-hide)');

    //-- Popin : Changement de dossier d'achat -------------------------------------------------------------------------------------
    public readonly pButtonEnregistrerChangement   : Locator;   //(by.css('#form-reaffectation-articles .modal-footer button:not(.ng-hide)');

    public readonly pListBoxNomDossierAchat        : Locator;   //(by.id('select-dossier-reaffectation-articles');

    //-- Popin : Suppression d'un dossier d'achat vide -----------------------------------------------------------------------------
    public readonly pButtonSupprimerDossierVide    : Locator;   //(by.css('suppression-dossier-achat-modal-wrapper button.btn-enregistrer');
    
    //----------------------------------------------------------------------------------------------------------------- 

    constructor(public readonly page: Page) {

        this.buttonReaffecterArticle        = page.locator('[ng-click="reaffecterArticles(dg.selection)"]');
        this.buttonCreerDossier             = page.locator('[ng-click="creerDossierAchat()"]');
        this.buttonModifierDossier          = page.locator('[ng-click="modifierDossierAchat(filtreDossierAchat)"]');
        this.buttonSupprimerDossierVide     = page.locator('[ng-click="supprimerDossierAchat(filtreDossierAchat)"]');        
    
        this.listBoxDossierAchat            = page.locator('#select-dossier-achat'); 
    
        this.inputFiltreArticle             = page.locator('.filtre-article-input > input');
        this.inputFiltreFournisseur         = page.locator('.filtre-fournisseur-input');
    
        this.dataGridDossierAchat           = page.locator('.table-dossiers-achat th');
        this.dataGridDossierAchatElements   = page.locator('.table-dossiers-achat tbody tr');
        this.dataGridDossierAchatCode       = page.locator('.table-dossiers-achat tbody tr td:nth-child(2)');
    
        this.dataGridNomDossier             = page.locator('td.datagrid-designationDossierAchat');
    
        this.checkBoxListeArticles          = page.locator('.table-dossiers-achat td input');
    
        //-- Popin : Création d'un dossier d'achat -------------------------------------------------------------------------------------
        this.pInputNomDossier               = page.locator('#designationDossierAchat');
    
        this.pListBoxResponsable            = page.locator('#acheteur');
        this.pListBoxResoonsableItem        = page.locator('ul p-dropdownitem');
    
        this.pButtonEnregistrerDossier      = page.locator('p-footer button.btn-enregistrer');
    
        this.pLinkAnnulerDossier            = page.locator('p-footer button.p-button-link');    
    
        this.pFeedBackErrorDossier          = page.locator('div.alert-danger:NOT(.ng-hide)');
    
        //-- Popin : Changement de dossier d'achat -------------------------------------------------------------------------------------
        this.pButtonEnregistrerChangement   = page.locator('#form-reaffectation-articles .modal-footer button:not(.ng-hide)');
    
        this.pListBoxNomDossierAchat        = page.locator('#select-dossier-reaffectation-articles');
    
        //-- Popin : Suppression d'un dossier d'achat vide -----------------------------------------------------------------------------
        this.pButtonSupprimerDossierVide    = page.locator('suppression-dossier-achat-modal-wrapper button.btn-enregistrer');

    }

}