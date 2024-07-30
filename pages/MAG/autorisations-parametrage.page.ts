/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * Onglet   : PARAMETRAGE
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */
import { Page} from '@playwright/test';

export class AutorisationsParametrage {

    public readonly popinConfirmerSuppression  = this.page.locator('.modal-confirmation .modal-footer button:NOT(.ng-hide)');

    public readonly modalBackDrop              = this.page.locator('.modal-backdrop');

    public readonly inputFieldFilter           = this.page.locator('.input-assortiment > input');
    public readonly inputDesignation           = this.page.locator('#input-designation');
    public readonly inputHeureDebut            = this.page.locator('input[formcontrolname="heures"]').nth(0);
    public readonly inputHeureDebutOpport      = this.page.locator('input.time-picker-hh');
    public readonly inputMinuteDebut           = this.page.locator('input[formcontrolname="minutes"]').nth(0);
    public readonly inputMinuteDebutOpport     = this.page.locator('input.time-picker-mm');
    public readonly inputHeureFin              = this.page.locator('input[formcontrolname="heures"]').nth(1);
    public readonly inputMinuteFin             = this.page.locator('input[formcontrolname="minutes"]').nth(1);    

    public readonly checkBoxFirstAssort        = this.page.locator('.dg-assortiment th input');
    public readonly checkBoxListeAssortiments2 = this.page.locator('.dg-assortiment td input');
    public readonly checkBoxListeAssortiments  = this.page.locator('.parametrage td input');
    public readonly checkBoxMasquerActif       = this.page.locator('#toggle-actif');    
    public readonly checkBoxListeCommandes     = this.page.locator('.groupes-commandes input');
    public readonly checkBoxCommandesFermes    = this.page.locator('#engagement-commandes-fermes');
    public readonly checkBoxEngPrioSurCmd      = this.page.locator('#engagement_prioritaire');  
    public readonly checkBoxTypeLabel          = this.page.locator('[ng-repeat="type in typesAssortiments"]')  

    public readonly tdLibelleGrpCommande       = this.page.locator('.groupes-commandes .datagrid-nom');
    public readonly tdActionsGrpCommande       = this.page.locator('.groupes-commandes .contAction');
    public readonly tdLibelleAssortiment       = this.page.locator('td.datagrid-designation');

    public readonly listBoxTypeAssortiment     = this.page.locator('select[ng-model="filtre.type"]');
    public readonly listBoxOrigine             = this.page.locator('#input-groupe').nth(0);
    public readonly listBoxGroupeArticle       = this.page.locator('#input-groupe-article-modele');    

    public readonly buttonEnregistrer          = this.page.locator('[ng-click="enregistrer(assortiment)"]');
    public readonly buttonCreerAssort          = this.page.locator('[ng-click="nouvelAssortiment()"]');
    public readonly buttonSupprimerAssort      = this.page.locator('[ng-click="confirmerSuppressionAssortiment(assortiment)"]');
    public readonly buttonCreerGrpCmd          = this.page.locator('[ng-click="creerGroupeCommande(assortiment)"]');
    public readonly buttonAjoutFraisDePort     = this.page.locator('[ng-click="openPopupFraisPort(assortiment)"]');

    public readonly onglets                    = this.page.locator('.nav-tabs > li > a');
    public readonly ongletParametrage          = this.onglets.nth(3);

    public readonly listResponses              = this.page.locator('.datagrid-designation > span');  // <<<< pas propre !!!! A revoir

    public readonly dataGridListeAssort        = this.page.locator('.span3 div.datagrid-table-wrapper > table > thead > tr > th');     

    public readonly pictoModifier              = this.page.locator('.icon-pencil');
    public readonly pictoGrpCmdRemove          = this.page.locator('.groupes-commandes .actiontd .icon-remove');

    public readonly radioTypeEng               = this.page.locator('typeAssortiment');
    public readonly radioButtonEngagement      = this.page.locator('.type-assortiment input').nth(2);

    public readonly labelTypeEngagement        = this.page.locator('.type-assortiment label');    
    
    public readonly datePickerDebutEng         = this.page.locator('p-calendar[name="date-debut-commande"]');
    public readonly datePickerFinEng           = this.page.locator('p-calendar[name="date-fin-commande"]');   
    public readonly datePickerOppFinSaisie     = this.page.locator('.fin-de-saisie-opportunite .datepicker-wrapper input');
    public readonly datePickerFinSaisieIcon    = this.page.locator('.fin-de-saisie-opportunite .datepicker-wrapper i.icon-calendar')    
    public readonly datePickerOppExpedition    = this.page.locator('.date-expedition-opportunite .datepicker-wrapper input');  
    public readonly datePickerExpeditionIcon   = this.page.locator('.date-expedition-opportunite .datepicker-wrapper  i.icon-calendar')   
    public readonly datePickerDay              = this.page.locator('table.p-datepicker-calendar td:NOT(.p-datepicker-other-month):NOT(.p-datepicker-weeknumber)');
    public readonly datePickerToday            = this.page.locator('td.ui-datepicker-today');
    public readonly datePickerTodayOpport      = this.page.locator('td.today');
    public readonly datePickerActiveDay        = this.page.locator('.datepicker-days td:NOT(.old ):NOT(.new)')

    public readonly columnActionsGrpCmd        = this.page.locator('.groupes-commandes .actiontd');

    //--POPIN : Modification / Création d'un groupe de commande ------------------------------------------------------------------    
    public readonly pInputNom                  = this.page.locator('#input-nom');

    public readonly pDatePickerHeureDebut      = this.page.locator('.time-picker-hh').nth(0);
    public readonly pDatePickerMinuteDebut     = this.page.locator('.time-picker-mm').nth(0);
    public readonly pDatePickerHeureFin        = this.page.locator('.time-picker-hh').nth(1);
    public readonly pDatePickerMinuteFin       = this.page.locator('.time-picker-mm').nth(1);    

    public readonly pCheckBoxAllMagasin        = this.page.locator('.liste-magasin th input');
    public readonly pCheckBoxAllSelectMag      = this.page.locator('.p-datatable-thead p-checkbox');

    public readonly pButtonEnregistrer         = this.page.locator('.popup-groupe-commande .modal-footer button');

    //-- POPIN : Confirmer la suppression ----------------------------------------------------------------------------------------    
    public readonly pPictoClose                = this.page.locator('.modal-header .close').nth(0);

    public readonly pButtonOui                 = this.page.locator('div.modal.hide.in > div.modal-footer > button.btn.btn-primary.modal-btn-primary');
    public readonly pButtonNon                 = this.page.locator('div.modal.hide.in > div.modal-footer > a');

    //-- POPIN : Ajout des frais de port -----------------------------------------------------------------------------------------
    public readonly pPradioFdpQuantitePoids    = this.page.locator('[ng-model="qtePoids"]');
    public readonly pPradioFdpQuantiteColis    = this.page.locator('[ng-model="qteColis"]');
    public readonly pPradioFdpFixe             = this.page.locator('[ng-model="fixe"]');
    public readonly pPradioFdpTranche          = this.page.locator('[ng-model="qteTranche"]');

    public readonly pPinputDesignation         = this.page.locator('input.p-multiselect-filter')
    public readonly pPinputFdpQuantitePoidsPrix= this.page.locator('input[ng-model="fraisPort.montantQtePoids"]');
    public readonly pPinputFdpQuantitePoidsQte = this.page.locator('input[ng-model="fraisPort.quantitePoids"]');
    public readonly pPinputFdpQuantiteColisPrix= this.page.locator('input[ng-model="fraisPort.montantQteColis"]');
    public readonly pPinputFdpQuantiteColisQte = this.page.locator('input[ng-model="fraisPort.quantiteColis"]');
    public readonly pPinputFdpFixePrix         = this.page.locator('input[ng-model="fraisPort.montantFixe"]');
    public readonly pPinputFdpTrancheUne       = this.page.locator('input[ng-model="tranche.montant"]');
    public readonly pPinputFdpTrancheHt        = this.page.locator('input[ng-model="tranche.seuil"]');
    public readonly pMutipleSelection          = this.page.locator('p-multiselectitem span:NOT(.p-checkbox-icon)')

    public readonly pPdataGridFdp              = this.page.locator('.liste-magasin th');

    public readonly pPcheckBoxFdpListeMagasins = this.page.locator('.liste-magasin td input');

    public readonly pPbuttonFdpEnregistrer     = this.page.locator('.popup-frais-port .modal-footer button');

    public readonly pPlinkFdpFermer            = this.page.locator('.popup-frais-port .modal-footer a');
    public readonly pTdDesignationMag          = this.page.locator('#magasins-dg table .multi-select-full-width .p-multiselect');


    constructor(public readonly page: Page) {};
}