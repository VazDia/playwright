/**
 * 
 * PRICING PAGE > GESTION DES MAGASINS
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class GestionsMagasinPage {
    public readonly buttonCreerGroupeMagasin                    : Locator //('button i.fa-plus');
    public readonly buttonCreerMagasin                          : Locator //('[ng-click="editerMagasin()"]');
    public readonly buttonAssocierMagasin                       : Locator //('button span.icon-fast-backward');

    public readonly inputSearch                                 : Locator //('div.barre-recherche input');

    public readonly checkBoxStrategie                           : Locator //('div.filtres-magasin p-checkbox').nth(0);
    public readonly checkBoxVille                               : Locator //('div.filtres-magasin p-checkbox').nth(1);
    public readonly checkBoxHabitudesAlim                       : Locator //('div.filtres-magasin p-checkbox').nth(2);
    public readonly checkBoxProximiteGeo                        : Locator //('div.filtres-magasin p-checkbox').nth(3);

    public readonly dataGridListeArticles                       : Locator //('div.groupes-magasins-dg th.text-center');
    public readonly dataGridListeMagasins                       : Locator //('div.magasins-dg th.text-center');
    public readonly dataGridlisteActions                        : Locator //('#dgMagasins .contAction');

    public readonly dataGridlinksActions                        : Locator //('#dgMagasins .contAction a');

    //-- Popin : Création d'un groupe ----------------------------------------------------------------------------------------------------
    public readonly pPopinCreationGroupe                        : Locator
    public readonly pButtonGroupeEnregistrer                    : Locator //('button.btn-enregistrer');
    public readonly pButtonGroupeAnnuler                        : Locator //('button.p-button-link'); 

    public readonly pInputGroupeNom                             : Locator //('[formcontrolname="nom"]');
    public readonly pInputGroupeDescription                     : Locator //('[formcontrolname="description"]');
    public readonly pInputGroupeTauxCalculPVC                   : Locator //('[formcontrolname="tauxCalculPvCTheorique"]');
    public readonly pInputGroupeMargePlateforme                 : Locator //('[formcontrolname="margePlateforme"]');
    public readonly pInputGroupeFraisLivraison                  : Locator //('[formcontrolname="fraisLivraisonParKg"]');
    
    //-- Popin : Création d'un magasin ---------------------------------------------------------------------------------------------------
    public readonly pButtonMagSauvegarder                       : Locator //('div.modal.hide.in > div.modal-footer > button').nth(0);
    public readonly pButtonMagAnnuler                           : Locator //('#formSaisieMagasin div.modal-footer > a'); 

    public readonly pInputCode                                  : Locator //('input-code');
    public readonly pInputAbreviation                           : Locator //('input-abreviation');
    public readonly pInputRaisonSociale                         : Locator //('input-raison-sociale');
    public readonly pInputNomEnseigne                           : Locator //('input-nom-enseigne');
    public readonly pInputDateOuverture                         : Locator //('input-date-ouverture');
    public readonly pInputDatePremRepart                        : Locator //('input-date-premiere-repartition');
    public readonly pInputDateFermeture                         : Locator //('input-date-fermeture');
    public readonly pInputMaregLissage                          : Locator //('input-marge-lissage');
    public readonly pInputFraisLivraison                        : Locator //('input-frais-livraison');
    public readonly pInputMargePlateforme                       : Locator //('input-marge-plateforme');
    public readonly pInputAdresse                               : Locator //('input-adresse');
    public readonly pInputAdresseComplement                     : Locator //('input-complement-adresse');
    public readonly pInputCodePostal                            : Locator //('input-code-postal');
    public readonly pInputVille                                 : Locator //('input-ville');
    public readonly pInputNomResponsable                        : Locator //('input-nom-responsable');
    public readonly pInputPrenomResponsable                     : Locator //('input-prenom-responsable');
    public readonly pInputTelephoneResponsable                  : Locator //('input-telephone-responsable');

    public readonly pDatePickerOuverture                        : Locator //('.icon-calendar').nth(0);
    public readonly pDatePickerRepartition                      : Locator //('.icon-calendar').nth(1);
    public readonly pDatePickerFermeture                        : Locator //('.icon-calendar').nth(2);        
    public readonly pDatePickerFilieres                         : Locator //('.table-date-applicabilite .icon-calendar');
    public readonly pDatePickerDaysFiliere                      : Locator //('.datepicker-days td.day:not(.disabled)');

    public readonly pCalendarDay                                : Locator //('.datepicker-days td');

    public readonly pLabelCalendarFilierePrepa                  : Locator //('label.label-datepicker-filiere-preparation');

    public readonly pListBoxStrategie                           : Locator //('select-strategie');
    public readonly pListBoxRegionGeo                           : Locator //('select-region-geographique');
    public readonly pListBoxPays                                : Locator //('select-pays');
    public readonly pListBoxSecteurProsol                       : Locator //('select-secteur-prosol');
    public readonly pListBoxRegionProsol                        : Locator //('select-region-prosol');
    public readonly pListBoxPlateformeFL                        : Locator //('input-plateforme-00');
    public readonly pListBoxPlateformeFD                        : Locator //('input-plateforme-01');
    public readonly pListBoxPlateformeIT                        : Locator //('input-plateforme-21');       
    public readonly pListBoxPrepaSamedi                         : Locator //('chargement-samedi');    
    public readonly pListBoxFilieres                            : Locator //('div.table-plateforme-distribution select');
    public readonly pListBoxProchainePtfExp                     : Locator //('div.table-prochaine-plateforme-expedition select');
    public readonly pListBoxProchainePtf                        : Locator //('table.table-configuration-filieres tr.ng-scope:nth-child(1) div.table-plateforme-distribution option');

    public readonly pListBoxChoixPrepaSamedi                    : Locator //('table.table-configuration-filieres tr.ng-scope:nth-child(1) div.table-chargement-samedi option');
    
    public readonly pCheckBoxMagasinExterne                     : Locator //('input-externe');
    public readonly pCheckBoxTarifAuto                          : Locator //('input-tarification_automatique');
    public readonly pCheckBoxOuvertDimanche                     : Locator //('input-ouverture-dimanche');
    public readonly pCheckBoxPvcInterne                         : Locator //('input-pvc-interne');
    public readonly pCheckBoxTypeClientele                      : Locator //('caract-Clientèle-AIS');
    public readonly pCheckBoxConcurence                         : Locator //('caract-Concurrence-AND');
    public readonly pCheckBoxHabitudeAlim                       : Locator //('caract-Habitude alimentaire-AFR');
    public readonly pCheckBoxProximiteGeo                       : Locator //('caract-Proximité géographique-LIT');
    public readonly pCheckBoxTailleSMEVA                        : Locator //('caract-Taille SMEVA CR-SM4');
    public readonly pCheckBoxTailleMeuble                       : Locator //('caract-Taille meuble UF-MU4');
    public readonly pCheckBoxTypoTraitMer                       : Locator //('caract-Typo. trait. de la mer-T1');
    public readonly pChecBoxCaracteristiques                    : Locator //('.caracteristiques-magasin input');       // la liste des toutes les caractéristiques !

    public readonly pDataGridGroupePlateforme                   : Locator //('.groupes-article-table > thead > tr > th');
    public readonly pDataGridNomGroupe                          : Locator //('.lignes-groupes-magasins table > thead > tr > th');
    public readonly pDataGridLignes                             : Locator //('table.table-configuration-filieres tr.ng-scope');
    public readonly pDataGridListeFilieres                      : Locator //('div.table-filiere-preparation');
    public readonly pDataGridListePtfCourantes                  : Locator //('div.table-plateforme-courante');
    public readonly pDataGridListePtfExpCourant                 : Locator //('div.table-plateforme-expedition-courante');
    public readonly pDataGridListePtfPrepa                      : Locator //('div.table-plateforme-preparation');
    public readonly pDataGridListeFilieresPtf                   : Locator //('div.table-plateforme-distribution');
    public readonly pDataGridListePrepaSamedi                   : Locator //('div.table-chargement-samedi');

    public readonly pFeedBackErrorMessage                       : Locator //('div.feedback-error:not(.ng-hide)');



    constructor(page:Page){

        this.buttonCreerGroupeMagasin                           = page.locator('button i.fa-plus');
        this.buttonCreerMagasin                                 = page.locator('[ng-click="editerMagasin()"]');
        this.buttonAssocierMagasin                              = page.locator('button span.icon-fast-backward');

        this.inputSearch                                        = page.locator('div.barre-recherche input');

        this.checkBoxStrategie                                  = page.locator('div.filtres-magasin p-checkbox').nth(0);
        this.checkBoxVille                                      = page.locator('div.filtres-magasin p-checkbox').nth(1);
        this.checkBoxHabitudesAlim                              = page.locator('div.filtres-magasin p-checkbox').nth(2);
        this.checkBoxProximiteGeo                               = page.locator('div.filtres-magasin p-checkbox').nth(3);

        this.dataGridListeArticles                              = page.locator('div.groupes-magasins-dg th.text-center');
        this.dataGridListeMagasins                              = page.locator('div.magasins-dg th.text-center');
        this.dataGridlisteActions                               = page.locator('#dgMagasins .contAction');

        this.dataGridlinksActions                               = page.locator('#dgMagasins .contAction a');

        //-- Popin : Création d'un groupe ----------------------------------------------------------------------------------------------------
        this.pPopinCreationGroupe                               = page.locator('div.p-dialog-heade')
        this.pButtonGroupeEnregistrer                           = page.locator('button.btn-enregistrer');
        this.pButtonGroupeAnnuler                               = page.locator('button.p-button-link'); 

        this.pInputGroupeNom                                    = page.locator('[formcontrolname="nom"]');
        this.pInputGroupeDescription                            = page.locator('[formcontrolname="description"]');
        this.pInputGroupeTauxCalculPVC                          = page.locator('[formcontrolname="tauxCalculPvCTheorique"]');
        this.pInputGroupeMargePlateforme                        = page.locator('[formcontrolname="margePlateforme"]');
        this.pInputGroupeFraisLivraison                         = page.locator('[formcontrolname="fraisLivraisonParKg"]');
    
        //-- Popin : Création d'un magasin ---------------------------------------------------------------------------------------------------
        this.pButtonMagSauvegarder                              = page.locator('div.modal.hide.in > div.modal-footer > button').nth(0);
        this.pButtonMagAnnuler                                  = page.locator('#formSaisieMagasin div.modal-footer > a'); 

        this.pInputCode                                         = page.locator('input-code');
        this.pInputAbreviation                                  = page.locator('input-abreviation');
        this.pInputRaisonSociale                                = page.locator('input-raison-sociale');
        this.pInputNomEnseigne                                  = page.locator('input-nom-enseigne');
        this.pInputDateOuverture                                = page.locator('input-date-ouverture');
        this.pInputDatePremRepart                               = page.locator('input-date-premiere-repartition');
        this.pInputDateFermeture                                = page.locator('input-date-fermeture');
        this.pInputMaregLissage                                 = page.locator('input-marge-lissage');
        this.pInputFraisLivraison                               = page.locator('input-frais-livraison');
        this.pInputMargePlateforme                              = page.locator('input-marge-plateforme');
        this.pInputAdresse                                      = page.locator('input-adresse');
        this.pInputAdresseComplement                            = page.locator('input-complement-adresse');
        this.pInputCodePostal                                   = page.locator('input-code-postal');
        this.pInputVille                                        = page.locator('input-ville');
        this.pInputNomResponsable                               = page.locator('input-nom-responsable');
        this.pInputPrenomResponsable                            = page.locator('input-prenom-responsable');
        this.pInputTelephoneResponsable                         = page.locator('input-telephone-responsable');

        this.pDatePickerOuverture                               = page.locator('.icon-calendar').nth(0);
        this.pDatePickerRepartition                             = page.locator('.icon-calendar').nth(1);
        this.pDatePickerFermeture                               = page.locator('.icon-calendar').nth(2);        
        this.pDatePickerFilieres                                = page.locator('.table-date-applicabilite .icon-calendar');
        this.pDatePickerDaysFiliere                             = page.locator('.datepicker-days td.day:not(.disabled)');

        this.pCalendarDay                                       = page.locator('.datepicker-days td');

        this.pLabelCalendarFilierePrepa                         = page.locator('label.label-datepicker-filiere-preparation');

        this.pListBoxStrategie                                  = page.locator('select-strategie');
        this.pListBoxRegionGeo                                  = page.locator('select-region-geographique');
        this.pListBoxPays                                       = page.locator('select-pays');
        this.pListBoxSecteurProsol                              = page.locator('select-secteur-prosol');
        this.pListBoxRegionProsol                               = page.locator('select-region-prosol');
        this.pListBoxPlateformeFL                               = page.locator('input-plateforme-00');
        this.pListBoxPlateformeFD                               = page.locator('input-plateforme-01');
        this.pListBoxPlateformeIT                               = page.locator('input-plateforme-21');       
        this.pListBoxPrepaSamedi                                = page.locator('chargement-samedi');    
        this.pListBoxFilieres                                   = page.locator('div.table-plateforme-distribution select');
        this.pListBoxProchainePtfExp                            = page.locator('div.table-prochaine-plateforme-expedition select');
        this.pListBoxProchainePtf                               = page.locator('table.table-configuration-filieres tr.ng-scope:nth-child(1) div.table-plateforme-distribution option');

        this.pListBoxChoixPrepaSamedi                           = page.locator('table.table-configuration-filieres tr.ng-scope:nth-child(1) div.table-chargement-samedi option');
        
        this.pCheckBoxMagasinExterne                            = page.locator('input-externe');
        this.pCheckBoxTarifAuto                                 = page.locator('input-tarification_automatique');
        this.pCheckBoxOuvertDimanche                            = page.locator('input-ouverture-dimanche');
        this.pCheckBoxPvcInterne                                = page.locator('input-pvc-interne');
        this.pCheckBoxTypeClientele                             = page.locator('caract-Clientèle-AIS');
        this.pCheckBoxConcurence                                = page.locator('caract-Concurrence-AND');
        this.pCheckBoxHabitudeAlim                              = page.locator('caract-Habitude alimentaire-AFR');
        this.pCheckBoxProximiteGeo                              = page.locator('caract-Proximité géographique-LIT');
        this.pCheckBoxTailleSMEVA                               = page.locator('caract-Taille SMEVA CR-SM4');
        this.pCheckBoxTailleMeuble                              = page.locator('caract-Taille meuble UF-MU4');
        this.pCheckBoxTypoTraitMer                              = page.locator('caract-Typo. trait. de la mer-T1');
        this.pChecBoxCaracteristiques                           = page.locator('.caracteristiques-magasin input');       // la liste des toutes les caractéristiques !

        this.pDataGridGroupePlateforme                          = page.locator('.groupes-article-table > thead > tr > th');
        this.pDataGridNomGroupe                                 = page.locator('.lignes-groupes-magasins table > thead > tr > th');
        this.pDataGridLignes                                    = page.locator('table.table-configuration-filieres tr.ng-scope');
        this.pDataGridListeFilieres                             = page.locator('div.table-filiere-preparation');
        this.pDataGridListePtfCourantes                         = page.locator('div.table-plateforme-courante');
        this.pDataGridListePtfExpCourant                        = page.locator('div.table-plateforme-expedition-courante');
        this.pDataGridListePtfPrepa                             = page.locator('div.table-plateforme-preparation');
        this.pDataGridListeFilieresPtf                          = page.locator('div.table-plateforme-distribution');
        this.pDataGridListePrepaSamedi                          = page.locator('div.table-chargement-samedi');

        this.pFeedBackErrorMessage                              = page.locator('div.feedback-error:not(.ng-hide)');
    }
}