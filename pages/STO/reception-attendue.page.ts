/**
 * Page     : STOCK 
 * Menu     : RECEPTION
 * Onglet   : Livraisons Attendues
 * 
 * author JOSIAS SIE & SIAKA KONE
 * 
 * @version 3.2
 * 
 * 
 */

import { Page }             from '@playwright/test';
import { TestFunctions }    from '@helpers/functions.js';

export class ReceptionAttendue{

    public fonction                        = new TestFunctions();

    //-- Onglet livraisons attendues ---------------------------------------------------------------------------------------------------    
    
    public readonly thDateArriveePrevue    = this.page.locator('th.datagrid-dateArriveePrevueDuJour');
    public readonly thConfirmee            = this.page.locator('th.datagrid-confirme');

    public readonly listBLResults          = this.page.locator('td.datagrid-numeroBL > span');
    public readonly listLivraison          = this.page.locator('.datagrid-table-wrapper.paginator > table > tbody > tr > td > input[type="checkbox"]').nth(0);
    public readonly listLivAttendues       = this.page.locator('.tableau-receptions-attendues .datagrid-wrapper td input');
    public readonly listBoxRoutage         = this.page.locator('#filtre-routage');

    public readonly checkBoxNumBL          = this.page.locator('#checkbox-numerosBLLivraisonOuLots');
    public readonly checkBoxTransporteur   = this.page.locator('#checkbox-transporteur');
    public readonly checkBoxNumeroAchat    = this.page.locator('#checkbox-numerosAchat');
    public readonly checkBoxFournisseur    = this.page.locator('#checkbox-fournisseurs');
    public readonly checkBoxAffToutesLivr  = this.page.locator('.en-bout-de-ligne');

    //public readonly popinReception         = this.page.locator('.modal-saisie-livraison');
    //public readonly autoComplete           = this.page.locator('.gfit-autocomplete-result');

    public readonly ongletRecepTerminee    = this.page.locator('.nav-tabs > li > a').nth(2);
    public readonly ongletRecepEnCours     = this.page.locator('.nav-tabs > li > a').nth(1);

    //public readonly confirmMessage         = this.page.locator('.confirmation-terminer-reception');
    //public readonly confirmPrintMessage    = this.page.locator('.confirmation-impression-etiquettes');

    //-- Boutons Footer
    public readonly buttonScinder          = this.page.locator('[ng-click="openScinderLivraison(dg.selection[0])"]');
    public readonly buttonModifier         = this.page.locator('[ng-click="openModifierLivraison(dg.selection[0])"]');    
    public readonly buttonReceptionner     = this.page.locator('popup-reception-wrapper em.icon-download-alt');
    public readonly buttonSupprimer        = this.page.locator('[ng-click="openConfirmationAbandon(dg.selection[0])"]');
    public readonly buttonDetail           = this.page.locator('[ng-click="openDetailsLivraison(dg.selection[0])"]');
    public readonly buttonImprimerBord     = this.page.locator('[ng-click="imprimerBordereaux()"]');
    public readonly buttonVisualiserBord   = this.page.locator('[ng-click="visualiserBordereaux()"]');          

    //----------------------------------------------------------------------------------------------------------
    //-- pop up Réception attendue -----------------------------------------------------------------------------
    //-- Boutons Footer
    public readonly buttonSauvegarder      = this.page.locator('[title="Sauvegarder la réception"]');
    public readonly buttonImprimerNon      = this.page.locator('[title="Ne pas imprimer les étiquettes"]').nth(0);
    public readonly buttonSauvImprimer     = this.page.locator('[title="Sauvegarder la réception et imprimer le bordereau"]'); 
    public readonly buttonTerminer         = this.page.locator('[title="Terminer la réception"]'); 
    
    public readonly ongletInfoGenerales    = this.page.locator('[role=presentation]').nth(0);
    public readonly ongletPalettesFourn    = this.page.locator('[role=presentation]').nth(1);

    //-- onglet Informations générales
    public readonly inputRefBL             = this.page.locator('div.informations-generales input.numeroBL');
    
    public readonly listBoxReceptionnaire  = this.page.locator('div.informations-generales #receptionnaire1 button.p-button');
    public readonly listBoxQuaiAffecte     = this.page.locator('div.informations-generales #quai .p-dropdown');

    public readonly PictoPlusComptage      = this.page.locator('.type-emballage .sigale-button');

    public readonly InputQuantiteEmballage = this.page.locator('.quantite.ligne-type-emballage.reception');
    public readonly inputTempArriere       = this.page.locator('[id=temperatureArriereCamion]');
    public readonly inputTempMilieu        = this.page.locator('[id=temperatureMilieuCamion]');
    public readonly inputTempFond          = this.page.locator('[id=temperatureFondCamion]');
    public readonly inputTempProduit       = this.page.locator('[id=temperatureProduit]')
    
    //-- onglet Palettes fournisseurs
    public readonly buttonAppliquerMasse   = this.page.locator('.fieldset-saisie-en-masse .btn-primary');
    public readonly buttonMassePB          = this.page.locator('div.fieldset-saisie-en-masse p-selectbutton div[role="button"]').nth(0);
    public readonly buttonMasseAUTRE       = this.page.locator('div.fieldset-saisie-en-masse p-selectbutton div[role="button"]').nth(1);

    public readonly checkBoxAllRecep       = this.page.locator('[role="checkbox"]').nth(0);

    public readonly inputEmplacement       = this.page.locator('.fieldset-saisie-en-masse .emplacement .p-inputtext');      // Saisie en masse Emplacements
    public readonly imputEmplacementItem   = this.page.locator('.fieldset-saisie-en-masse .emplacement  li[role="option"]')
    public readonly inputDlc               = this.page.locator('.global.dlc.p-inputtext');                                  // Saisie en masse DLC
    public readonly inputLot               = this.page.locator('.global.numeroLotFournisseur.p-inputtext');                 // Saisie en masse Lot

    public readonly dataGridPalette        = this.page.locator('.p-treetable-tbody'); 
    
    public readonly inputDlcOblig          = this.page.locator('.dlcs.required>ul>li>input');                                // Champ DLC obligatoires
    public readonly inputDlcPasOblig       = this.page.locator('.dlcs.p-chips>ul>li>input');                                // Champ DLC pas obligatoires
    public readonly inputLotOblig          = this.page.locator('.lots-fournisseur.required>ul>li>input');                    // Champ Lot obligatoire
    public readonly inputLotPasOblig       = this.page.locator('.lots-fournisseur.p-chips>ul>li>input');                    // Champ Lot pas obligatoire
         
    public readonly inputFilter            = this.page.locator('.filter-receptions-attendues > span > input');
    public readonly inputPoids             = this.page.locator('.datagrid-poidsRecu > input');
    public readonly inputNumeroBL          = this.page.locator('input.filter-input');
    
    //-- Ligne regroupement article
    public readonly inputPoidsOblig        = this.page.locator('.poids-total.required>input');                               // Champ Poids total obligatoire
    public readonly inputPoidsTotal        = this.page.locator('.poids-total>input');                                        // Champ Poids total (tous)
    public readonly inputAlertPoids        = this.page.locator('.pi-minus-circle');                                          // Alerte saisie poids trop petit 
    public readonly dataLibArticle         = this.page.locator('.article');                                                  // Description de l'article 

    //-- pop up Terminer la réception
    public readonly buttonConfTerminer     = this.page.locator('[title="Terminer sans imprimer les étiquettes"]');

    public readonly inputEmplacements      = this.page.locator('.palette-dechargement-colonne-emplacement > input');
    public readonly checkBoxLivraisonsAtt  = this.page.locator('.tableau-receptions-attendues div.datagrid-table-wrapper > table').nth(0).locator('tbody > tr > td');     
    public readonly dataGridLivraisons     = this.page.locator('.tableau-receptions-attendues div.datagrid-table-wrapper > table').nth(0).locator('thead > tr > th');
    
    public readonly messageAlert           = this.page.locator('.pi-exclamation-triangle');

    //-- Popin : Scinder une réception ------------------------------------------------------------------------------
    public readonly pButtonScinderSauvegarder = this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);
    public readonly pButtonScinderAnnuler  = this.page.locator('div.modal.hide.in > div.modal-footer > a');

    public readonly pInputScinderBL1       = this.page.locator('div.div-bl input').nth(0);
    public readonly pInputScinderBL2       = this.page.locator('div.div-bl input').nth(1);

    public readonly pDataGridScinder       = this.page.locator('.arrivages-scinder table > thead > tr > th')

    //-- Popin : Modification d'une réception ------------------------------------------------------------------------
    public readonly pButtonModifSauvegarder= this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);
    public readonly pButtonModifAnnuler    = this.page.locator('div.modal.hide.in > div.modal-footer > a');

    public readonly pInputModifReferenceBL = this.page.locator('.numeroBL .control-group input').nth(0);

    public readonly pDataGridModifier      = this.page.locator('.arrivages-modification table > thead > tr > th');

    //-- Popin : Réception (Attendue) ---------------------------------------------------------------------------------
    
    public readonly pButtonRecepSauvegarder = this.page.locator('#sauvegarder-reception');
    public readonly pButtonRecepTerminer    = this.page.locator('#terminer-reception');
    public readonly pButtonRecepSauvImprimer= this.page.locator('#sauvegarder-imprimer-reception');
    public readonly pButtonRecepAnnuler     = this.page.locator('div.modal.hide.in > div.modal-footer > a');
    public readonly pButtonRecepAjouter     = this.page.locator('[ng-click="ajouterPalette()"]');
    public readonly pButtonRecepAppliquer   = this.page.locator('[ng-click="appliquerValeursGlobales(colisRecusGlobal.value, dlcGlobal.value, lotFournisseurGlobal.value, emplacementGlobal);verifierConformite()"]');
    public readonly pButtonEmballageValider = this.page.locator('[ng-click="sauvegarderModifications(); close($event);"]');
    public readonly pButtonTerminer         = this.page.locator('div.sigale-popover.arrow-down-terminer button').nth(1);
    
    public readonly pInputRecepHeureArrivee = this.page.locator('hh').nth(0);
    public readonly pInputRecepMinuteArrivee=this.page.locator('mm').nth(0);
    public readonly pInputRecepHeureUnload  = this.page.locator('hh').nth(1);
    public readonly pInputRecepMinuteUnload =this.page.locator('mm').nth(1);    
    public readonly pInputRecepReferenceBL  = this.page.locator('div.informations-generales #numeroBL input:NOT([readonly])');
    public readonly pInputHeureDebutDechargement = this.page.locator('#heureDebutDechargement input');
    public readonly pInputRecepTptRear      = this.page.locator('#t-arriere');
    public readonly pInputRecepTptMiddle    = this.page.locator('#t-milieu');
    public readonly pInputRecepTptBack      = this.page.locator('#t-fond');
    public readonly pInputRecepNbRecus      = this.page.locator('colisRecusGlobal.value');    
    public readonly pInputRecepDlcGlobal    = this.page.locator('dlcGlobal.value'); 
    public readonly pInputRecepLotFourn     = this.page.locator('lotFournisseurGlobal.value');
    public readonly pInputRecepEmplacement  = this.page.locator('emplacementGlobal.filtre');
    
    public readonly pRadioConformeBL        = this.page.locator('#conformite-true');

    public readonly pListBoxRecepReceptionnaire1 = this.page.locator('[inputid="receptionnaire1"] button');
    public readonly pListBoxItemReceptionnaire1 = this.page.locator('.p-autocomplete-items li.p-autocomplete-item')
    public readonly pListBoxRecepQuai        = this.page.locator('#quai');  
    public readonly pListBoxItemQuaiAffecte  = this.page.locator('.p-dropdown-items p-dropdownitem li[role="option"]:NOT(.p-highlight)');  
    public readonly pListBoxRecepTransporteur= this.page.locator('#transporteur'); 

    public readonly pTextAreaRecepCommentaire= this.page.locator('#commentaire');

    public readonly pCheckBoxRecepConforme   = this.page.locator('#conformite-true');
    public readonly pCheckBoxRecepNonConforme= this.page.locator('#conformite-false');

    public readonly pDataGridRecepLots       = this.page.locator('.livraison-lots table > thead > tr > th');
    public readonly pDataGridRecepPalettes   = this.page.locator('.livraison-palettes table > thead > tr > th');    

    //-- Popin : Réception (Attendue) ---------------------------------------------------------------------------------
    public readonly pButtonSupprConfirmer    = this.page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);   
    public readonly pButtonSupprAnnuler      = this.page.locator('div.modal.hide.in > div.modal-footer > a');

    //----------------------------------------------------------------------------------------------------------------
    public readonly ButtonConfOui            = this.page.locator('.confirmation-terminer-reception > a').nth(0);
    public readonly ButtonImpNon             = this.page.locator('[title="Ne pas imprimer les étiquettes"]').nth(0);

    constructor(public readonly page: Page) {}    
    //----------------------------------------------------------------------------------------------------------------    

    /**
     * 
     * Effectue un tri sur la colonne "Date d'Arrivée Prévue"
     * 
     */
    public async clickThDateArriveePrevue() {
        await this.fonction.clickElement(this.thDateArriveePrevue);
    }
    
    public async buttonConfirmerOui() {
        await this.fonction.clickElement(this.ButtonConfOui);
    }

    public async clickbuttonImprimerNon() {
        await this.fonction.clickElement(this.ButtonImpNon);
    }
    
    public async clickOngletRecepTerminee() {
        await this.fonction.clickElement(this.ongletRecepTerminee);
    }
    
    public async clickOngletRecepEnCours() {
        await this.fonction.clickElement(this.ongletRecepEnCours);
    }

    public async clickButtonTerminer() {
        await this.fonction.clickElement(this.buttonTerminer);
    }

    public async setRefBL(RefBL: string) {       
        await this.fonction.sendKeys(this.pInputRecepReferenceBL, RefBL)
    }

    public async selectReceptionnaire (selecteur:any, selecteurItem:any) {
        await this.fonction.clickElement(selecteur);
        await selecteurItem.first().waitFor()
        var nb = await selecteurItem.count()
        var rnd = Math.floor(this.fonction.random() * nb);
        await selecteurItem.nth(rnd).click()
    }

    public async selectQuaiAffecte() {
        await this.fonction.clickElement(this.pListBoxRecepQuai);
        await this.pListBoxItemQuaiAffecte.first().waitFor()
        var nb = await this.pListBoxItemQuaiAffecte.count()
        var rnd = Math.floor(this.fonction.random() * nb);
        await this.pListBoxItemQuaiAffecte.nth(rnd).click()
    }

    /**
     * Déclenche le lancement de l'autocomplétion dans le champ "EMPLACEMENTS"
     * et sélectionne le premier élément de la liste
     */
    public async setEmplacements() {
        await this.fonction.sendKeys(this.inputEmplacement, '1');                                    // On saisie un chiffre affin de faire apparaître la liste autocomplétée
        await this.imputEmplacementItem.first().waitFor()
        var nb = await this.imputEmplacementItem.count()
        var rnd = Math.floor(this.fonction.random() * nb);
        await this.imputEmplacementItem.nth(rnd).click()
    }
    
    public readonly setEmpRungis = function() {                             // Exception pour Rungis qui n'a pas d'emplacements numérotés
        // this.inputEmplacement.fill('Rungis');                               // On saisie un chiffre affin de faire apparaître la liste autocomplétée
        // browser.sleep(800);                                                 // Petite tempo pour le chargement de la liste

        // // On clique sur le premier élément de la liste  
        // browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();    // Déplacement dans la liste avec les flêches Haut / Bas  
        // browser.actions().sendKeys(protractor.Key.ENTER).perform();         // Validation du choix
    }


    /**
     * Saisie la valeur {value} dans le champ de recherche
     * @param {*} value 
     */
    public async setSearch(value: string) {
        await this.fonction.sendKeys(this.inputFilter, value);
    }


    /**
     * Saisie le poids {poids} dans les champs "poids (Kilos)"
     * 
     * @param {number} poids 
     * @param {DOM Object} selector 
     */
    public setPoids (poids, selector = this.inputPoids) {
        // selector.each(function(article) {           
        //     article.isEnabled().then(function(present){
        //         if (present) {
        //             article.sendKeys(poids); 
        //         }  
        //     })                             
        // })
    }    

    public async setDlc(dateDlc: string) {
        await this.fonction.sendKeys(this.inputDlc, dateDlc);
    }
}