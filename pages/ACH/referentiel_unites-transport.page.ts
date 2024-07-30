/**
 * Appli    : ACHATS 
 * Page     : REFERENTIEL
 * Onglet   : UNITES DE TRANSPORT
 * 
 * 
 * @author JC CALVIERA
 * @version 3.2
 * 
 */
import { Locator, Page }    from "@playwright/test"

export class PageRefUniTrp {

    public readonly buttonCreerUniteTransport       : Locator;   //(by.css('[ng-click="openSaisieUniteTransport()"]');
    public readonly buttonModifierUniteTransport    : Locator;   //(by.css('[ng-click="openSaisieUniteTransport(dgUnitesTransport.selection[0])"]');
    public readonly buttonSupprimerUniteTransport   : Locator;   //(by.css('[ng-click="confirmerSupprimerUniteTransport(dgUnitesTransport.selection[0])"]');
    public readonly buttonCreerParametrage          : Locator;   //(by.css('[ng-click="openSaisieParamPlateformeGroupe()"]');
    public readonly buttonModifierParametrage       : Locator;   //(by.css('[ng-click="openSaisieParamPlateformeGroupe(dgParamsPlateformeGroupe.selection[0])"]');
    public readonly buttonSupprimerParametrage      : Locator;   //(by.css('[ng-click="confirmerSupprimerParamPlateformeGroupe(dgParamsPlateformeGroupe.selection[0])"]');

    public readonly dataGridUniteTransport          : Locator;   //.all(by.css('.tab-unite-transport-div-gauche div.datagrid-table-wrapper > table > thead > tr > th');
    public readonly dataGridUniteTransportParam     : Locator;   //.all(by.css('.tab-unite-transport-div-gauche div.datagrid-table-wrapper > table > thead > tr > th');      
    
    public readonly trUniteTransportParam           : Locator;

    public readonly dataGridListeActif              : Locator;
    public readonly dataGridListeNomsUnites         : Locator;   //.all(by.css('td.datagrid-nom');
    public readonly dataGridListeParamGroupe        : Locator;   //.all(by.css('td.datagrid-groupe-designation');
    public readonly dataGridListeParamPlateforme    : Locator;   //.all(by.css('td.datagrid-plateforme-designation');
    public readonly dataGridListeParamUniteTransp   : Locator;   //.all(by.css('td.datagrid-uniteTransport-nom');
    public readonly dataGridListeParamCoef          : Locator;   //.all(by.css('td.datagrid-coefficientFoisonnement');
    public readonly dataGridListeParamMarchandise   : Locator;   //.all(by.css('td.datagrid-natureMarchandise-designation');

    public readonly pictogramErrorMessageClose      : Locator;   //(by.css('.feedback-error button');

    public readonly errorMessage                    : Locator;


    //-- Popin : Création d'une unité de transport --------------------------------------------------------------------------------------------
    public readonly pPinputAddNom                   : Locator;   //(by.model('popupCreationUnite.unite.nom');
    public readonly pPinputAddVolume                : Locator;   //(by.model('popupCreationUnite.unite.volumeEnM3');

    public readonly pPbuttonAddOk                   : Locator;   //(by.css('.popup-creation-unite-transport .modal-footer button');

    public readonly pPlinkAddAnnuler                : Locator;   //(by.css('.popup-creation-unite-transport .modal-footer a');


    //-- Popin : Supprimer une unité de transport --------------------------------------------------------------------------------------------
    public readonly pPbuttonDelOk                   : Locator;   //(by.css('.popup-supprimer-unite-transport .modal-footer button');

    public readonly pPlinkDelAnnuler                : Locator;   //(by.css('.popup-supprimer-unite-transport .modal-footer a');


    //-- Popin : Suppression d'un paramétrage d'unité de transport ---------------------------------------------------------------------------
    public readonly pPbuttonDelParamOk              : Locator;   //(by.css('.popup-supprimer-param-plateforme-groupe .modal-footer button');


    //-- Popin : Création d'un paramétrage d'unité de transport ------------------------------------------------------------------------------
    public readonly pPbuttonAddParamCreer           : Locator;   //(by.css('.modal-saisie-param-plateforme-groupe .modal-footer button');    

    public readonly pPLinkAddParamAnnuler           : Locator;   //(by.css('.modal-saisie-param-plateforme-groupe .modal-footer a');    

    public readonly pPlistBoxAddParamGroupe         : Locator;   //(by.model('popupSaisieParamPlateformeGroupe.groupe');
    public readonly pPlistBoxAddParamUniteTransp    : Locator;   //(by.model('popupSaisieParamPlateformeGroupe.uniteTransport');
    public readonly pPlistBoxAddParamPlateforme     : Locator;   //(by.model('popupSaisieParamPlateformeGroupe.plateforme');
    public readonly pPlistBoxAddParamNature         : Locator;   //(by.model('popupSaisieParamPlateformeGroupe.natureMarchandise');

    public readonly pPinputAddParamCoef             : Locator;   //(by.model('popupSaisieParamPlateformeGroupe.coefficientFoisonnement');

    public readonly pPcheckBoxAddParamActif         : Locator;   //(by.model('popupSaisieParamPlateformeGroupe.actif');

    //------------------------------------------------------------------------------------------------------------------------------------------

    constructor(public readonly page: Page) {
        
        this.buttonCreerUniteTransport      = page.locator('[ng-click="openSaisieUniteTransport()"]');
        this.buttonModifierUniteTransport   = page.locator('[ng-click="openSaisieUniteTransport(dgUnitesTransport.selection[0])"]');
        this.buttonSupprimerUniteTransport  = page.locator('[ng-click="confirmerSupprimerUniteTransport(dgUnitesTransport.selection[0])"]');
        this.buttonCreerParametrage         = page.locator('[ng-click="openSaisieParamPlateformeGroupe()"]');
        this.buttonModifierParametrage      = page.locator('[ng-click="openSaisieParamPlateformeGroupe(dgParamsPlateformeGroupe.selection[0])"]');
        this.buttonSupprimerParametrage     = page.locator('[ng-click="confirmerSupprimerParamPlateformeGroupe(dgParamsPlateformeGroupe.selection[0])"]');

        this.dataGridUniteTransport         = page.locator('.tab-unite-transport-div-gauche div.datagrid-table-wrapper > table > thead > tr > th');
        this.dataGridUniteTransportParam    = page.locator('.tab-unite-transport-div-droite div.datagrid-table-wrapper > table > thead > tr > th');     

        this.trUniteTransportParam          = page.locator('.tab-unite-transport-div-droite div.datagrid-table-wrapper > table > tbody > tr');          

        this.dataGridListeActif             = page.locator('td.datagrid-actif');
        this.dataGridListeNomsUnites        = page.locator('td.datagrid-nom');
        this.dataGridListeParamGroupe       = page.locator('td.datagrid-groupe-designation');
        this.dataGridListeParamPlateforme   = page.locator('td.datagrid-plateforme-designation');
        this.dataGridListeParamUniteTransp  = page.locator('td.datagrid-uniteTransport-nom');
        this.dataGridListeParamCoef         = page.locator('td.datagrid-coefficientFoisonnement');
        this.dataGridListeParamMarchandise  = page.locator('td.datagrid-natureMarchandise-designation');

        this.pictogramErrorMessageClose     = page.locator('.feedback-error button');

        this.errorMessage                   = page.locator('.feedback-error:NOT(.ng-hide)');

        //-- Popin : Création d'une unité de transport --------------------------------------------------------------------------------------------
        this.pPinputAddNom                  = page.locator('[ng-model="popupCreationUnite.unite.nom"]');
        this.pPinputAddVolume               = page.locator('[ng-model="popupCreationUnite.unite.volumeEnM3"]');

        this.pPbuttonAddOk                  = page.locator('.popup-creation-unite-transport .modal-footer button');

        this.pPlinkAddAnnuler               = page.locator('.popup-creation-unite-transport .modal-footer a');

        //-- Popin : Supprimer une unité de transport --------------------------------------------------------------------------------------------
        this.pPbuttonDelOk                  = page.locator('.popup-supprimer-unite-transport .modal-footer button');

        this.pPlinkDelAnnuler               = page.locator('.popup-supprimer-unite-transport .modal-footer a');

        //-- Popin : Suppression d'un paramétrage d'unité de transport ---------------------------------------------------------------------------
        this.pPbuttonDelParamOk             = page.locator('.popup-supprimer-param-plateforme-groupe .modal-footer button');

        //-- Popin : Création d'un paramétrage d'unité de transport ------------------------------------------------------------------------------
        this.pPbuttonAddParamCreer          = page.locator('.modal-saisie-param-plateforme-groupe .modal-footer button:NOT(.ng-hide)');    

        this.pPLinkAddParamAnnuler          = page.locator('.modal-saisie-param-plateforme-groupe .modal-footer a');    

        this.pPlistBoxAddParamGroupe        = page.locator('[ng-model="popupSaisieParamPlateformeGroupe.groupe"]');
        this.pPlistBoxAddParamUniteTransp   = page.locator('[ng-model="popupSaisieParamPlateformeGroupe.uniteTransport"]');
        this.pPlistBoxAddParamPlateforme    = page.locator('[ng-model="popupSaisieParamPlateformeGroupe.plateforme"]');
        this.pPlistBoxAddParamNature        = page.locator('[ng-model="popupSaisieParamPlateformeGroupe.natureMarchandise"]');

        this.pPinputAddParamCoef            = page.locator('[ng-model="popupSaisieParamPlateformeGroupe.coefficientFoisonnement"]');

        this.pPcheckBoxAddParamActif        = page.locator('[ng-model="popupSaisieParamPlateformeGroupe.actif"]');

    }

}