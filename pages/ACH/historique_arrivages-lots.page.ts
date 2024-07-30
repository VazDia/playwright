/**
 * Appli    : ACHATS
 * Menu     : HISTORIQUE
 * Onglet   : ARRIVAGE LOTS
 * 
 * 
 * @author JC CALVIERA
 * @version 3.1
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageHisArrLot {

    public readonly listBoxGroupeArticle   : Locator;   //(by.id('select-groupe');

    public readonly datePickerRecepFrom    : Locator;   //(by.id('input-date-debut-plage');
    public readonly datePickerRecepTo      : Locator;   //(by.id('input-date-fin-plage');

    public readonly inputFournCommande     : Locator;   //(by.model('filtre.nomFournisseurCommande');
    public readonly inputFournFacture      : Locator;   //(by.id('achat-a-effectuer-vue-founisseur-input-fournisseur_facturant');
    public readonly inputFiltreArticle     : Locator;   //(by.id('recherche-article');
    public readonly inputFiltreAchat       : Locator;   //.all(by.css('div.span2 > input').nth(1);
    public readonly inputFiltreMagasin     : Locator;
    public readonly inputFiltreBL          : Locator;   //.all(by.css('div.span2 > input').nth(2);
    public readonly inputFiltreFacture     : Locator;   //.all(by.css('div.span2 > input').nth(3);

    public readonly autoCompleteFournisseur: Locator;   //.all(by.css('ul.gfit-autocomplete-results li');

    public readonly buttonRechercher       : Locator;   //(by.css('.rechercher > button');
    public readonly buttonGenererDEB       : Locator;   //(by.css('[ng-click="popupGenerationDeb.open = true"]');
    public readonly buttonModifierBL       : Locator;   //(by.css('[ng-click="shared.openPopupModifierBLWithSelectedArrivages()"]');
    public readonly buttonFournFacturant   : Locator;   //(by.css('[ng-click="shared.openPopupPreciserFournisseurFacturantWithSelectedArrivage()"]');

    public readonly checkBoxArrivageAvecDA : Locator;   //(by.id('demande-avoir');
    public readonly checkBoxArrivageSansFacture : Locator;   //(by.id('arrivage-sans-facture');    

    public readonly dataGridAchats         : Locator;   //.all(by.css('.tableau th');

    public readonly tdLotArticle           : Locator; 
    public readonly tdLotNumeroAchat       : Locator;   //.all(by.css('td.datagrid-numeroAchat');
    public readonly tdLotNumeroLot         : Locator;   //.all(by.css('td.datagrid-numeroAchat');
    public readonly tdLotQuantiteUA         : Locator;

    public readonly pagination             : Locator;   //(by.css('.pagination');

    //-- Popin : Génération de fichier DEB PRO Douane ------------------------------------------------------------------------------
    public readonly pPdatePeackerGenDEB    : Locator;   //(by.id('mois');

    public readonly pPdatePeackerGenDEBMonth: Locator;   //.all(by.css('span.p-monthpicker-month:NOT(.p-disabled)');

    public readonly pPbuttonGenDEBPrevisu  : Locator;   //.all(by.css('div.p-dialog-footer button').nth(0);
    public readonly pPbuttonGenDEBDefinitif: Locator;   //.all(by.css('div.p-dialog-footer button').nth(1);

    public readonly pPlinkAnnuler          : Locator;   //.all(by.css('div.p-dialog-footer button').nth(2);

    public readonly pPmessageErreur        : Locator;   //(by.css('div.alert:NOT(.ng-hide)');
    
    //-- Popin : Modifier le BL des arrivages -------------------------------------------------------------------------------------    
    public readonly pPinputModifBL         : Locator;   //(by.model('popupModifierBL.nouveauBL');

    public readonly pPbuttonModifBLEnregistrer : Locator;   //(by.css('.modal-footer button');

    //----------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.page = page;
        
        this.listBoxGroupeArticle   = page.locator('[id="select-groupe"]');

        this.datePickerRecepFrom    = page.locator('#input-date-debut-plage');
        this.datePickerRecepTo      = page.locator('#input-date-fin-plage');
    
        this.inputFournCommande     = page.locator('#achat-a-effectuer-vue-founisseur-input-fournisseur_commande');
        this.inputFournFacture      = page.locator('#achat-a-effectuer-vue-founisseur-input-fournisseur_facturant');
        this.inputFiltreArticle     = page.locator('#recherche-article');
        this.inputFiltreAchat       = page.locator('input[ng-model="filtre.numeroAchat"]');
        this.inputFiltreMagasin     = page.locator('input[ng-model="filtre.nomMagasin"]');
        this.inputFiltreBL          = page.locator('input[ng-model="filtre.numeroBL"]');
        this.inputFiltreFacture     = page.locator('input[ng-model="filtre.numeroFacture"]');
    
        this.autoCompleteFournisseur= page.locator('ul.gfit-autocomplete-results li');
    
        this.buttonRechercher       = page.locator('.rechercher > button');
        this.buttonGenererDEB       = page.locator('[ng-click="popupGenerationDeb.open = true"]');
        this.buttonModifierBL       = page.locator('[ng-click="shared.openPopupModifierBLWithSelectedArrivages()"]');
        this.buttonFournFacturant   = page.locator('[ng-click="shared.openPopupPreciserFournisseurFacturantWithSelectedArrivage()"]');
    
        this.checkBoxArrivageAvecDA = page.locator('#demande-avoir');
        this.checkBoxArrivageSansFacture = page.locator('#arrivage-sans-facture');    
    
        this.dataGridAchats         = page.locator('.tableau th');
    
        this.tdLotArticle           = page.locator('td.datagrid-codeArticle');
        this.tdLotNumeroAchat       = page.locator('td.datagrid-numeroAchat');
        this.tdLotNumeroLot         = page.locator('td.datagrid-numeroLot');
        this.tdLotQuantiteUA        = page.locator('td.datagrid-quantiteUA');
    
        this.pagination             = page.locator('.pagination');
    
        //-- Popin : Génération de fichier DEB PRO Douane ------------------------------------------------------------------------------
        this.pPdatePeackerGenDEB    = page.locator('#mois');
    
        this.pPdatePeackerGenDEBMonth= page.locator('span.p-monthpicker-month:NOT(.p-disabled)');
    
        this.pPbuttonGenDEBPrevisu  = page.locator('div.p-dialog-footer button').nth(0);
        this.pPbuttonGenDEBDefinitif= page.locator('div.p-dialog-footer button').nth(1);
    
        this.pPlinkAnnuler          = page.locator('div.p-dialog-footer button').nth(2);
    
        this.pPmessageErreur        = page.locator('div.alert:NOT(.ng-hide)');
        
        //-- Popin : Modifier le BL des arrivages -------------------------------------------------------------------------------------    
        this.pPinputModifBL         = page.locator('[ng-model="popupModifierBL.nouveauBL"]');
    
        this.pPbuttonModifBLEnregistrer = page.locator('.modal-footer button');

    }

}