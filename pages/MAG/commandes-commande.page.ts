/**
 * Appli    : MAGASIN 
 * Page     : COMMANDES 
 * Onglet   : COMMANDE
 * 
 * @author JOSIAS SIE
 * @version 3.1
 * 
 */
import { Page }            from '@playwright/test';

import { TestFunctions }   from '@helpers/functions';

export class CommandesCommande {
    
    public fonction                        = new TestFunctions();

    public readonly messageErreur          = this.page.locator('.feedback-error:NOT(.ng-hide) li');

    public readonly buttonSaisirStockEmb   = this.page.locator('[ng-click="saisirStockEmballage()"]');
    public readonly buttonAFaire           = this.page.locator('.statut-commandes button').nth(0);
    public readonly buttonImprimer         = this.page.locator('[ng-click="imprimerPourCommande(commandeSelectionnee)"]');
    public readonly buttonSaisieEmb        = this.page.locator('[ng-click="saisirStockEmballage()"]');
    public readonly buttonSynthese         = this.page.locator('[ng-click="syntheseGlobale()"]');    
    public readonly buttonEnregistrer      = this.page.locator('[ng-click="enregistrer()"]');
    public readonly buttonEnvoyer          = this.page.locator('[ng-click="envoyer()"]');    
    public readonly buttonEmballageEnregistrer = this.page.locator('.popup-saisir-stock-emballage.in > div.modal-footer > button');

    public readonly gridCmdesChkBox        = this.page.locator('.datagrid-table-wrapper > table > tbody > tr > td:nth-child(1) > input[type="checkbox"]');
    public readonly gridCmdes              = this.page.locator('.datagrid-table-wrapper > table > tbody > tr');    

    public readonly totaux                 = this.page.locator('.total-previsions').nth(0);

    public readonly inputQteCmdee          = this.page.locator('.datagrid-quantiteCommandee > input');
    public readonly inputQtiePrev          = this.page.locator('td.datagrid-quantitePrevisionnelle > input')
    public readonly inputQtePrevSuiv       = this.page.locator('td.datagrid-quantitePrevisionnelleSuivante > input')
    public readonly inputNbEmballage       = this.page.locator('#input-stockEmballage');
    public readonly inputFamilleArticle    = this.page.locator('.filtres > span > input.filter-input');
    
    public readonly listArticle            = this.page.locator('.datagrid-conditionnement-designation');

    public readonly labelDernierEnvoi      = this.page.locator('.containerBT > span');
    public readonly labelCommandeMinimum   = this.page.locator('.minimum-commande');
    public readonly labelConditionnementD  = this.page.locator('td.datagrid-conditionnement-designation > span')

    public readonly lineArticle            = this.page.locator('#dg-lignes-commandes-AC tbody tr')
    public readonly listBoxGrpArticle      = this.page.locator('#input-groupe');

    public readonly datePickerCommande     = this.page.locator('#datepicker-date-commande .link');
    public readonly datePickerLinkPrev     = this.page.locator('div.datepicker-days > table > thead > tr > th.prev');                        // bouton mois précédent du calendrier
    public readonly datePickerFirstDay     = this.page.locator('div.datepicker-days > table > tbody > tr:nth-child(1) > td:nth-child(1)');   // premier jour du calendrier

    public readonly toggleStatut           = this.page.locator('div.statut-commandes button');               // 5 Boutons : "A faire" / "En cours" / Etc.

    public readonly dataGridListesCmd      = this.page.locator('.liste-commandes th.sortable');
    public readonly dataGridLignesCmd      = this.page.locator('.lignes-commandes th');

    public readonly dataGridLibelleCmd     = this.page.locator('td.datagrid-designation');
    public readonly dataGridStatus         = this.page.locator('td.datagrid-statut-designation');
    public readonly dataGridSpinner        = this.page.locator('.datagrid-statut-designation .timer');

    public readonly labelStockEmballage    = this.page.locator('.stock-emballage');

    public readonly tdCommandes            = this.page.locator('.liste-commandes td');

    public readonly lignesArticles         = this.page.locator('#dg-lignes-commandes-AC > div > div.datagrid-table-wrapper > table > tbody > tr');
    public readonly tdCodeArticle          = this.lignesArticles.locator('td.datagrid-article-code > span');
    p

    //-- POPIN : Alerte Sanitaire à traiter -------------------------------------------------------------------------
    public readonly pPlabelAlerteSanitaire = this.page.locator('H3.modal-title');
    
    public readonly pPbuttonFermer         = this.page.locator('.popup-information > div.modal-footer > a');


    //-- POPIN : Saisir le stock d'emballages -----------------------------------------------------------------------
    public readonly pPinputStock           = this.page.locator('#input-stockEmballage');

    public readonly pPbuttonEnregistrer    = this.page.locator('div.popup-saisir-stock-emballage > div.modal-footer > button');

    public readonly pPlinkFermer           = this.page.locator('div.popup-saisir-stock-emballage > div.modal-footer > a');


    //-- POPIN : Synthèse des commandes de la journée ---------------------------------------------------------------
    public readonly dataGridSyntheseCmd    = this.page.locator('p-table[sortfield="groupeArticle.designation"] th');

    public readonly pPlinkFermerSynthese   = this.page.locator('div.p-dialog-footer > p-footer a');

    //-- POPIN : erreur probable de quantité -----------------------------------------------------------------------------
    public readonly pPalerteErrQte         = this.page.locator('.warning-poids-icone');
    public readonly pPbuttonErrConfirmer   = this.page.locator('.alerte-articles-saisie-commande .ui-button .ui-clickable');

    //-- POPIN : articles non commandés -----------------------------------------------------------------------------
    public readonly pPconfArtNonComButConf = this.page.locator('.alerte-articles-non-commandes button').nth(1);

    //-- POPIN : Erreur probable de quantité -----------------------------------------------------------------------------
    public readonly pPerrProbaQteButConf   = this.page.locator('.alerte-articles-saisie-commande button');
    
    //---------------------------------------------------------------------------------------------------------------
    public readonly  elistBoxGrpArticle = this.listBoxGrpArticle;
    //---------------------------------------------------------------------------------------------------------------


    public async clickButtonAFaire (){

        await this.fonction.selectorToBeCharged(this.buttonAFaire);

        var isEnabled = await this.buttonAFaire.isEnabled(); 
        if(isEnabled){
            
            await this.fonction.clickAndWait(this.buttonAFaire,this.page);

            var isVisibleLibelle = await this.dataGridLibelleCmd.first().isVisible();
            if(isVisibleLibelle){ // On verifie si il y a au moins une ligne de commande et si oui on ettendra que que la dernière commande soit charger pour eviter des confusion de selection

                await this.fonction.selectorToBeCharged(this.dataGridLibelleCmd.last())
            }
            return true
        }else{

            return false
        }
    }

    // this.isButtonImprimerVisible = function(){
    //     browser.wait(protractor.ExpectedConditions.visibilityOf(this.buttonImprimer), 10000).then(function(visible){
    //         return visible;
    //     })        
    // }

    // this.isButtonSaisieEmbVisible = function(){
    //     browser.wait(protractor.ExpectedConditions.visibilityOf(this.buttonSaisieEmb), 10000).then(function(visible){
    //         return visible;
    //     })        
    // }

    // this.isButtonSyntheseVisible = function(){
    //     browser.wait(protractor.ExpectedConditions.visibilityOf(this.buttonSynthese), 10000).then(function(visible){
    //         return visible;
    //     })        
    // }

    // this.isButtonEnregistrerVisible = function(){
    //     browser.wait(protractor.ExpectedConditions.visibilityOf(this.buttonEnregistrer), 10000).then(function(visible){
    //         return visible;
    //     })        
    // } 

    // this.isButtonEnvoyerVisible = function(){
    //     browser.wait(protractor.ExpectedConditions.visibilityOf(this.buttonEnvoyer), 10000).then(function(visible){
    //         return visible;
    //     })        
    // }        

    // this.isCmdGridVisible = function(){
    //     browser.wait(protractor.ExpectedConditions.visibilityOf(this.gridCmdes), 10000).then(function(visible){
    //         return visible;
    //     })        
    // }

    // this.isButtonEmballageEnregsitrerVisible = function (){
    //     browser.wait(protractor.ExpectedConditions.visibilityOf(this.buttonEmballageEnregistrer), 10000).then(function(visible){
    //         return visible;
    //     })           
    // }

    // this.isTotauxVisible = function(){
    //     this.totaux.isDisplayed().then(function(visible){
    //         return visible;
    //     })                  
    // }
    
    // this.isLabelDernierEnvoi = function(){
    //     this.labelDernierEnvoi.isDisplayed().then(function(visible){
    //         return visible;
    //     })        
    // }
    
    // //-------------------------------------------------------------------------------------------------------------------


    // this.clickButtonEnregistrer = function(){
    //     browser.wait(protractor.ExpectedConditions.elementToBeClickable(this.buttonEnregistrer), 10000).then(function(clickable){
    //         if (clickable) {
    //             return  this.page.locator('[ng-click="enregistrer()"]').click();
    //         } else {
    //             return false;
    //         }
    //     })          
    // }    

    // this.clickButtonSaisieStock = function(){
    //     browser.wait(protractor.ExpectedConditions.elementToBeClickable(this.buttonSaisieEmb), 10000).then(function(clickable){
    //         if (clickable) {
    //             return   this.page.locator('[ng-click="saisirStockEmballage()"]').click();
    //         } else {
    //             return false;
    //         }
    //     })   
    // }

    // this.clickButtonNbEmballageEnregistrer = function() {
    //     browser.wait(protractor.ExpectedConditions.elementToBeClickable(this.buttonEmballageEnregistrer), 10000).then(function(clickable){
    //         if (clickable) {
    //             return  this.page.locator('.popup-saisir-stock-emballage.in > div.modal-footer > button').click();
    //         } else {
    //             return false;
    //         }
    //     })           
    // }

    // this.clickButtonEnvoyerCommande = function() {
    //     browser.wait(protractor.ExpectedConditions.elementToBeClickable(this.buttonEnvoyer), 10000).then(function(clickable){
    //         if (clickable) {
    //             return this.page.locator('[ng-click="envoyer()"]').click();
    //         } else {
    //             return false;
    //         }
    //     })           
    // }

    public async selectGroupeArticle(groupeArticle:string) {

        var bPresentAndVisible = await this.elistBoxGrpArticle.locator('option[label="' + groupeArticle + '"]').isVisible();
        var bPresentAndHidden  = await this.elistBoxGrpArticle.locator('option[label="' + groupeArticle + '"]').isHidden();
        if (bPresentAndVisible || bPresentAndHidden) {                 // Choix Présente dans la LB     

            await this.elistBoxGrpArticle.selectOption({label: groupeArticle});
        } else {

            if(groupeArticle != 'Tous'){

                console.log('[!] Groupe Article "' + groupeArticle + '" Absent de la liste de choix !');
            }                 
        }
    }

    // //-------------------------------------------------------------------------------------------------------------------

    // this.getNumberOfCmd = function(){
    //     this.page.locator('.datagrid-table-wrapper > table > tbody > tr').count().then(function(nbElements){                              
    //         return nbElements;
    //     })
    // }

    // this.getSelectedNameCmd = function(){
    //     this.page.locator('.datagrid-table-wrapper > table > tbody > tr > td.datagrid-designation > span').getText().then(function(name){
    //         return name;
    //     })
    // }

    // this.checkFirtsCmd = function(){
    //     browser.wait(protractor.ExpectedConditions.elementToBeClickable(this.gridCmdesChkBox.get(0), 10000).then(function(clickable){
    //         if(clickable) {
    //             //this.gridCmdesChkBox.get(0).click();
    //             this.page.locator('.datagrid-table-wrapper > table > tbody > tr > td:nth-child(1) > input[type="checkbox"]').get(0).click();
    //         }
    //     })         
    // }

    // this.getZoneMultipleValue = function(){
    //     // A revoir... marche pô !
    //     var selectorInfoMultiple = this.page.locator('[ng-if="ligneSelectionnee.multipleCommande"]');
    //     selectorInfoMultiple.isPresent().then(function(present){
    //         if (present) {
    //             selectorInfoMultiple.getText().then(function(value){
    //                 return value;
    //             })
    //         } else {
    //             return null;
    //         }
    //     })
    // }

    // this.getLabelStockEmballage = function() {
    //     // A revoir... marche pô !
    //     var selectorLabelEmballage = this.page.locator('.stock-emballage');
    //     selectorLabelEmballage.isPresent().then(function(present){
    //         if (present) {
    //             selectorLabelEmballage.getText().then(function(value){
    //                 return value;
    //             })
    //         } else {
    //             return null;
    //         }
    //     })        
    // }

    // //-------------------------------------------------------------------------------------------------------------------

    // this.setNbEmballage = function(nbEmballage){    
    //     this.inputNbEmballage.clear();
    //     this.inputNbEmballage.sendKeys(nbEmballage);
    //     this.inputNbEmballage.getAttribute('value').then(function(valeur){
    //         return expect(valeur == nbEmballage);
    //     })
    // }

    constructor(public readonly page: Page) {};
};