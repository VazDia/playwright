/**
 * 
 * FACTURATION PAGE > REGULATION / ONGLET >DEMANDE D'AVOIR CLIENT
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class RegulationDemandeAvoirPage  {

    public readonly buttonCreer                                         : Locator
    public readonly buttonModifier                                      : Locator
    public readonly buttonRegulariser                                   : Locator
    public readonly buttonAccepterEnMasse                               : Locator
    public readonly buttonConsulter            

    public readonly listBoxDossierAchat                                 : Locator  
    public readonly listBoxDemandes                                     : Locator
    public readonly listBoxTypeDemande                                  : Locator   

    public readonly inputSearchClient                                   : Locator 
    public readonly inputSearchArticle                                  : Locator   
    public readonly dataGridClients                                     : Locator      
    public readonly dataGridDemandedAvoir                               : Locator      
    
    //-- Popin : Création d'une demande d'avoir ---------------------------------------------------------------------------------------------
    public readonly pButtonEnregsitrer                                  : Locator   
    public readonly pButtonFermer                                       : Locator   
    public readonly pButtonRechercher                                   : Locator   
    public readonly pButtonMagasin                                      : Locator   

    public readonly pInputArticle                                       : Locator 
    public readonly pInputMagasin                                       : Locator 
    public readonly pInputNbJours                                       : Locator        

    public readonly pListBoxTypeDemande                                 : Locator
    public readonly pDatePickerDateDemande                              : Locator

    public readonly pDataGridListeLots                                  : Locator 

    public readonly pTextAreaObservations                               : Locator  

    constructor(page:Page){
        
        this.buttonCreer                                                = page.locator('[ng-click="ouvrirPopupNewDemandeAvoir()"]');
        this.buttonModifier                                             = page.locator('[ng-click="ouvrirPopupNewDemandeAvoir(data.demandesSelectionnees[0])"]');
        this.buttonRegulariser                                          = page.locator('[ng-click="ouvrirPopupRegularisationDemandeAvoir(data.demandesSelectionnees[0])"]');
        this.buttonAccepterEnMasse                                      = page.locator('[ng-click="ouvrirPopupRegularisationEnMasseDemandeAvoir(data.demandesSelectionnees)"]');
        this.buttonConsulter                                            = page.locator('[ng-click="ouvrirPopupVisualisationDemandeAvoir(data.demandesSelectionnees[0])"]');
    
        this.listBoxDossierAchat                                        = page.locator('[ng-model="dossierAchat"]');
        this.listBoxDemandes                                            = page.locator('[ng-model="dg.filters.AND[0].traite.value"]');
        this.listBoxTypeDemande                                         = page.locator('#input-type-demande');
    
        this.inputSearchClient                                          = page.locator('[ng-model="filterClient"]').locator('[ng-model="ngModel"]');
        this.inputSearchArticle                                         = page.locator('[ng-model="filterArticle"]');    
    
        this.dataGridClients                                            = page.locator('.ecarts-articles .datagrid-table-wrapper > table > thead > tr > th');    
        this.dataGridDemandedAvoir                                      = page.locator('.dg-demandes-avoir-clients .datagrid-table-wrapper > table > thead > tr > th');     
        
        //-- Popin : Création d'une demande d'avoir ---------------------------------------------------------------------------------------------
        this.pButtonEnregsitrer                                         = page.locator('div.modal.hide.in > div.modal-footer > button');
        this.pButtonFermer                                              = page.locator('div.modal.hide.in > div.modal-footer > a');
        this.pButtonRechercher                                          = page.locator('[ng-click="rechercherLots();"]');
        this.pButtonMagasin                                             = page.locator('[ng-click="demande.$type = \'magasin\'; viderAutocompleteTiers()"]');
    
        this.pInputArticle                                              = page.locator('#input-article');
        this.pInputMagasin                                              = page.locator('#input-magasin');
        this.pInputNbJours                                              = page.locator('#input-jours');      
    
        this.pListBoxTypeDemande                                        = page.locator('#formSaisieDemande select#input-type-demande');
    
        this.pDatePickerDateDemande                                     = page.locator('[ng-model="formattedDate"]');
    
        this.pDataGridListeLots                                         = page.locator('.recherche-lots table > thead > tr > th');
    
        this.pTextAreaObservations                                      = page.locator('#observations');
    }
}