/**
 * 
 * APPLI    : PREPARATION 
 * PAGE     : PRODUCTIVITE 
 * ONGLET   : GESTION PREPARATEURS
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class ProdGestionPreparateursPage {

    public readonly buttonPreparateurAdd         : Locator;  //.locator('[ng-click="popupCreationPreparateur()"]');
    public readonly buttonPreparateurUpdate      : Locator;  //.locator('[ng-click="popupModificationPreparateur(preparateursSelectionnes[0])"]');
    public readonly buttonPreparateurDelete      : Locator;  //.locator('[ng-click="confirmerSuppresionPreparateur()"]');    
    
    public readonly inputSearchPreparateur       : Locator;  //.locator('.tableau-preparateurs input.filter-input');    

    public readonly checkBoxListePreparateurs    : Locator;  //.locator('.tableau-preparateurs td input');

    public readonly tdNomsPreparateurs          : Locator;

    public readonly pictoModifier               : Locator;

    public readonly dataGridPreparateurs         : Locator;  //.locator('.tableau-preparateurs th'); 

    //-- Popin : Création d'un préparateur ------------------------------------------------------------------------------------------
    public readonly pPopinCreationPreparateur    : Locator;
    public readonly pPinputCrePreNom             : Locator;  //.locator('[formcontrolname="nom"]');
    public readonly pPinputCrePrePrenom          : Locator;  //.locator('[formcontrolname="prenom"]');
    public readonly pPinputCrePreMatricule       : Locator;  //.locator('[formcontrolname="code"]');

    public readonly pPlistBoxCrePreEquipe        : Locator;  //.locator('#preparateur-equipe-id');
    public readonly pPlistBoxCrePreStatut        : Locator;  //.locator('#preparateur-statut-id');

    public readonly pPdatepickerCrePreEntree     : Locator;  //.locator('p-calendar button span.pi-calendar');

    public readonly pPcalendarCrePre             : Locator;  //.locator('table.p-datepicker-calendar td span');       

    public readonly pPcheckBoxCrePreActif        : Locator;  //.locator('[formcontrolname="actif"]');
    public readonly pPcheckBoxCrePrePrepaVocal   : Locator;  //.locator('[formcontrolname="preparationEnVocal"]');
    public readonly pPcheckBoxCrePreResponsable  : Locator;  //.locator('[formcontrolname="responsable"]');
    public readonly pPcheckBoxCrePreReception    : Locator;  //.locator('[formcontrolname="receptionnaire"]');
    public readonly pPcheckBoxCrePreTpsPartiel   : Locator;  //.locator('[formcontrolname="tempsPartiel"]');
    public readonly pPcheckBoxCrePreContratRecep : Locator;
    public readonly pPcheckBoxCrePreListPlatef   : Locator;  //.locator('div.plateformes p-checkbox label');
    public readonly pPcheckBoxCrePreListPlatAct  : Locator;  //.locator('div.plateformes label.p-checkbox-label-active');
    public readonly pPcheckBoxCrePreChargeur     : Locator;  //.locator('[formcontrolname="chargeur"]');
    public readonly pPcheckBoxCrePreMagasinier   : Locator;  //.locator('[formcontrolname="magasinier"]');

    //public readonly pPLibelleCrePreListPlatef  = element.all(by.css('.plateforme'));

    public readonly pPbuttonCrePreCreer          : Locator;  //.locator('#modal-footer-valider');

    public readonly pPlinkCrePreAnnuler          : Locator;  //.locator('a.close-link');

    public readonly pPfeedBackErrorMessage       : Locator;  //.locator('.alert-error');

    //-- Popin : Modification d'un préparateur ------------------------------------------------------------------------------------------
    public readonly pPinputModPreNom             : Locator;  //.locator('[formcontrolname="nom"]');
    public readonly pPinputModPrePrenom          : Locator;  //.locator('[formcontrolname="prenom"]');
    public readonly pPinputModPreCode            : Locator;  //.locator('[formcontrolname="code"]');

    public readonly pPlistBoxModPreEquipe        : Locator;  //.locator('[formcontrolname="equipe"]');
    public readonly pPlistBoxModPreStatut        : Locator;  //.locator('[formcontrolname="statut"]');

    public readonly pPdatepickerModPreEntree     : Locator;  //.locator('p-calendar span.pi-calendar');

    public readonly pPcalendarModPre             : Locator;  //.locator('table.p-datepicker-calendar td span');       

    public readonly pPcheckBoxModPreActif        : Locator;  //.locator('[formcontrolname="actif"]');
    public readonly pPcheckBoxModPrePrepaVocal   : Locator;  //.locator('[formcontrolname="preparationEnVocal"]');
    public readonly pPcheckBoxModPreResponsable  : Locator;  //.locator('[formcontrolname="responsable"]');
    public readonly pPcheckBoxModPreReception    : Locator;  //.locator('[formcontrolname="receptionnaire"]');
    public readonly pPcheckBoxModPreTpsPartiel   : Locator;  //.locator('[formcontrolname="tempsPartiel"]');

    public readonly pPlateformeColumn            : Locator;

    public readonly pPcheckBoxModPreListPaltef   : Locator;  //.locator('div.plateformes p-checkbox div.p-checkbox-box');

    public readonly pPbuttonModPreModifier       : Locator;  //.locator('#modal-footer-valider');

    public readonly pPlinkModPreAnnuler          : Locator;  //.locator('a.close-link');

    //-- Popin : Suppression d'un préparateur ------------------------------------------------------------------------------------------
    public readonly pPbuttonSupPreConfirmer      : Locator;  //.locator('.popup-supprimer-preparateur button.btn-primary')
    public readonly pPbuttonSupPreAnnuler        : Locator;  //.locator('div.popup-supprimer-preparateur a')

    constructor(page: Page){

        this.buttonPreparateurAdd         = page.locator('[ng-click="popupCreationPreparateur()"]');
        this.buttonPreparateurUpdate      = page.locator('[ng-click="popupModificationPreparateur(preparateursSelectionnes[0])"]');
        this.buttonPreparateurDelete      = page.locator('[ng-click="confirmerSuppresionPreparateur()"]');    
        
        this.inputSearchPreparateur       = page.locator('.tableau-preparateurs input.filter-input');    
    
        this.checkBoxListePreparateurs    = page.locator('.tableau-preparateurs td input');

        this.tdNomsPreparateurs             = page.locator('td.datagrid-nom');
            
        this.dataGridPreparateurs         = page.locator('.tableau-preparateurs th'); 

        this.pictoModifier              = page.locator('a i.icon-pencil');
    
        //-- Popin : Création d'un préparateur ------------------------------------------------------------------------------------------
        this.pPopinCreationPreparateur    = page.locator('div.p-dialog-header')
        this.pPinputCrePreNom             = page.locator('[formcontrolname="nom"]');
        this.pPinputCrePrePrenom          = page.locator('[formcontrolname="prenom"]');
        this.pPinputCrePreMatricule       = page.locator('[formcontrolname="code"]');
    
        this.pPlistBoxCrePreEquipe        = page.locator('#preparateur-equipe-id');
        this.pPlistBoxCrePreStatut        = page.locator('#preparateur-statut-id');
    
        this.pPdatepickerCrePreEntree     = page.locator('p-calendar button span.pi-calendar');
    
        this.pPcalendarCrePre             = page.locator('table.p-datepicker-calendar td span');       
    
        this.pPcheckBoxCrePreActif        = page.locator('[formcontrolname="actif"]');
        this.pPcheckBoxCrePrePrepaVocal   = page.locator('[formcontrolname="preparationEnVocal"]');
        this.pPcheckBoxCrePreResponsable  = page.locator('[formcontrolname="responsable"]');
        this.pPcheckBoxCrePreReception    = page.locator('[formcontrolname="receptionnaire"]');
        this.pPcheckBoxCrePreTpsPartiel   = page.locator('[formcontrolname="tempsPartiel"]');
        this.pPcheckBoxCrePreContratRecep = page.locator('[formcontrolname="contratReceptionnaire"]')
        this.pPcheckBoxCrePreListPlatef   = page.locator('div.plateformes p-checkbox label');
        this.pPcheckBoxCrePreListPlatAct  = page.locator('div.plateformes label.p-checkbox-label-active');
        this.pPcheckBoxCrePreChargeur     = page.locator('[formcontrolname="chargeur"]');
        this.pPcheckBoxCrePreMagasinier   = page.locator('[formcontrolname="magasinier"]');

        //this.pPLibelleCrePreListPlatef  = element.all(by.css('.plateforme'));
    
        this.pPbuttonCrePreCreer          = page.locator('#modal-footer-valider');
    
        this.pPlinkCrePreAnnuler          = page.locator('a.close-link');
    
        this.pPfeedBackErrorMessage       = page.locator('.alert-error');
    
        //-- Popin : Modification d'un préparateur ------------------------------------------------------------------------------------------
        this.pPinputModPreNom             = page.locator('[formcontrolname="nom"]');
        this.pPinputModPrePrenom          = page.locator('[formcontrolname="prenom"]');
        this.pPinputModPreCode            = page.locator('[formcontrolname="code"]');
    
        this.pPlistBoxModPreEquipe        = page.locator('[formcontrolname="equipe"]');
        this.pPlistBoxModPreStatut        = page.locator('[formcontrolname="statut"]');
    
        this.pPdatepickerModPreEntree     = page.locator('p-calendar span.pi-calendar');
    
        this.pPcalendarModPre             = page.locator('table.p-datepicker-calendar td span');       
    
        this.pPcheckBoxModPreActif        = page.locator('[formcontrolname="actif"]');
        this.pPcheckBoxModPrePrepaVocal   = page.locator('[formcontrolname="preparationEnVocal"]');
        this.pPcheckBoxModPreResponsable  = page.locator('[formcontrolname="responsable"]');
        this.pPcheckBoxModPreReception    = page.locator('[formcontrolname="receptionnaire"]');
        this.pPcheckBoxModPreTpsPartiel   = page.locator('[formcontrolname="tempsPartiel"]');

        this.pPcheckBoxModPreListPaltef   = page.locator('div.plateformes p-checkbox div.p-checkbox-box');
    
        this.pPlateformeColumn            = page.locator('.column p-checkbox')
        this.pPbuttonModPreModifier       = page.locator('#modal-footer-valider');
    
        this.pPlinkModPreAnnuler          = page.locator('a.close-link');
    
        this.pPfeedBackErrorMessage       = page.locator('.alert-error');
    
        //-- Popin : Suppression d'un préparateur ------------------------------------------------------------------------------------------
        this.pPbuttonSupPreConfirmer      = page.locator('.popup-supprimer-preparateur button.btn-primary');
        this.pPbuttonSupPreAnnuler        = page.locator('div.popup-supprimer-preparateur a');
    }
}