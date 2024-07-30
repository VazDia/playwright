/**
 * 
 * APPLI    : PRICING
 * PAGE     : TARIFICATION
 * ONGLET   : SIMULATION PRIX
 * 
 * @author JC CALVIERA
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class SimulationPrixPage {
    
    public readonly buttonEnregistrer                               : Locator;
    public readonly buttonRechercher                                : Locator;
    public readonly buttonExporter                                  : Locator;
    public readonly buttonCalculerMarges                            : Locator;
    public readonly buttonModifierPrixCession                       : Locator;
    public readonly buttonModifierPVCTTC                            : Locator;
    public readonly buttonAppliquerModifications                    : Locator;
    public readonly buttonModifierVentes                            : Locator;
    public readonly buttonAjouterLigne                              : Locator;
         
    public readonly datePickerSimulation                            : Locator;

    public readonly listBoxEnseigne                                 : Locator;

    public readonly inputFournisseur                                : Locator;

    public readonly checkBoxAffUniqLignesModif                      : Locator;
    
    public readonly dataGridListeArticles                           : Locator;
    
    constructor(page:Page){
        this.buttonEnregistrer                                      = page.locator('footer button').nth(0);
        this.buttonExporter                                         = page.locator('footer button').nth(1);
        this.buttonCalculerMarges                                   = page.locator('footer button').nth(2);
        this.buttonModifierPrixCession                              = page.locator('footer button').nth(3);
        this.buttonModifierPVCTTC                                   = page.locator('footer button').nth(4);
        this.buttonAppliquerModifications                           = page.locator('footer button').nth(5);
        this.buttonModifierVentes                                   = page.locator('footer button').nth(6);
        this.buttonAjouterLigne                                     = page.locator('footer button').nth(4);       
         
        this.datePickerSimulation                                   = page.locator('p-calendar[inputid="recherche-date-simulation"]');
    
        this.listBoxEnseigne                                        = page.locator('p-multiselect[inputid="recherche-enseigne"]');
    
        this.inputFournisseur                                       = page.locator('input[id="recherche-fournisseur"]');

        this.checkBoxAffUniqLignesModif                             = page.locator('p-checkbox[inputid="filtre-lignes-modifiees"]');
       
        this.dataGridListeArticles                                  = page.locator('table tr:nth-child(1) th'); 

    }

}