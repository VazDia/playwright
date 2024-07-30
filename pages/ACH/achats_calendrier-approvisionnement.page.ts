/**
 * Appli    : ACHATS
 * Menu     : ACHATS
 * Onglet   : CALENDRIER D'APPROVISIONNEMENT
 * 
 * 
 * @author JC CALVIERA
 * @version 3.3
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageAchCalApp {

    public readonly inputCodeFournisseur    : Locator;
    public readonly inputAchete             : Locator;
    public readonly inputQteAchetee         : Locator;

    public readonly listBoxDossierAchat     : Locator;
    public readonly listBoxCentraleAchat    : Locator;
    public readonly listBoxPtfDistrib       : Locator;

    public readonly toggleAutresFourn       : Locator;

    public readonly datePickerAchatsDu      : Locator;
    
    public readonly tdListPlateformes       : Locator;
    public readonly tdListFournisseurs      : Locator;
    public readonly tdListArticles          : Locator;
    public readonly tdListActionsSelected   : Locator;

    public readonly pictoBasculerCrossDock  : Locator;

    public readonly buttonAcheterConfirmer  : Locator;
    public readonly buttonEnregistrer       : Locator;

    public readonly pPbuttonAcheterConfOk   : Locator;

    //--
    public readonly pPiniListBoxCalibre     : Locator;
    public readonly pPiniListBoxConditionnement : Locator;
    public readonly pPiniListBoxOrigine     : Locator;
    public readonly pPiniListBoxIncoterm    : Locator;
    public readonly pPiniListBoxUniteAchat  : Locator;

    public readonly pPiniButtonEnregistrer  : Locator;

    public readonly pPfeedBackErrorMessage  : Locator;

    public readonly dataGridCrossDocking    : Locator;
    public readonly dataGridCrossDockbody   : Locator;

    public readonly spinnerLoadPage         : Locator;
    public readonly pPLinkAnnuler           : Locator;

    constructor(public readonly page: Page) {

        this.inputCodeFournisseur           = page.locator('#achat-a-effectuer-vue-calendrier-input-fournisseur');
        this.inputAchete                    = page.locator('div.col-achete input');
        this.inputQteAchetee                = page.locator('[ng-model="ligneArticleDestinataire.quantiteAchetee"]');

        this.listBoxDossierAchat            = page.locator('#select-dossier-achat');
        this.listBoxCentraleAchat           = page.locator('#select-centrale-achat');
        this.listBoxPtfDistrib              = page.locator('#plateforme-reception');

        this.toggleAutresFourn              = page.locator('gfit-switch');
    
        this.datePickerAchatsDu             = page.locator('#date-livraison'); 

        this.tdListPlateformes              = page.locator('.plateformes td.datagrid-designation');
        this.tdListFournisseurs             = page.locator('div.fournisseurs-avec-commande td.datagrid-designation');
        this.tdListArticles                 = page.locator('div.row-libelle-article');
        this.tdListActionsSelected          = page.locator('tr.selectionne td.actiontd');

        this.pictoBasculerCrossDock         = page.locator('i.icon-resize-horizontal');

        this.buttonAcheterConfirmer         = page.locator('button i.icon-shopping-cart');
        this.buttonEnregistrer              = page.locator('button i.icon-hdd');

        this.pPfeedBackErrorMessage         = page.locator('div.feedback-error:not(.ng-hide)');

        this.spinnerLoadPage                = page.locator('.progressRingCentre:NOT(.ng-hide)');

        //-- Popin : Acheter et Confirmer ------------------------------------------------------------------------------
        this.pPbuttonAcheterConfOk          = page.locator('.acheter-et-confirmer .modal-footer button:not(.ng-hide)');


        //-- Popin :Initialiser les données des nouveaux articles ------------------------------------------------------
        this.pPiniListBoxCalibre            = page.locator('p-dropdown[formcontrolname="calibre"]');
        this.pPiniListBoxConditionnement    = page.locator('p-dropdown[formcontrolname="conditionnement"]');
        this.pPiniListBoxOrigine            = page.locator('p-dropdown[formcontrolname="origine"]');
        this.pPiniListBoxIncoterm           = page.locator('p-dropdown[formcontrolname="incoterm"]');
        this.pPiniListBoxUniteAchat         = page.locator('p-dropdown[formcontrolname="uniteAchat"]');

        this.pPiniButtonEnregistrer         = page.locator('p-footer button:NOT(.p-button-link)');

        this.dataGridCrossDocking           = page.locator('[name="formArticlesVueCalendrierCrossDocking"] thead tr:nth-child(1) th');
        this.dataGridCrossDockbody          = page.locator('[name="formArticlesVueCalendrierCrossDocking"] tbody tr');
        this.pPLinkAnnuler                  = page.locator('p-footer .p-button-link')
       
    }

}