/**
 * Page ACHATS > MENU
 * 
 * @author JOSIAS SIE
 * @version 3.7
 * 
 */

import { TestFunctions } from "@helpers/functions";
import { expect, Locator, Page } from "@playwright/test";

export class MenuAchats {

    public menu                             : any;
    public webService                       : any; 
    public onglets                          : any;
    private verboseMode                     : boolean;

    public readonly linkLangueIT            : Locator;
    public readonly linkLangueFR            : Locator;    
    public readonly listBoxUser             : Locator;
    public readonly linkDeconnexion         : Locator;
    public readonly linkOnglets             : Locator;

    private readonly fonction               : TestFunctions;

    //------------------------------------------------------------------------------------------

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu = {
            accueil         : '#main-navbar .item0 a',
            commandes       : '#main-navbar .item1 a',
            achats          : '#main-navbar .item2 a',
            besoins         : '#main-navbar .item3 a',
            achatsSurPlace  : '#main-navbar .item4 a',
            litiges         : '#main-navbar .item5 a',
            historique      : '#main-navbar .item6 a',
            analyse         : '#main-navbar .item7 a',                      
            referentiel     : '#main-navbar .item8 a',         
            admin           : '#main-navbar .item9 a'
        };

        this.onglets = {
            accueil         : {
                rechercheLot                    : page.locator('a[href="#recherche-lot"]'),
                syntheseAchatsCourants          : page.locator('a[href="#synthese-achats"]'),
            },
            achats          : {
                analyseJournee                  : page.locator('a[href="#vueJournee"]'),
                calendrierAppro                 : page.locator('a[href="#vueCalendier"]'),
                achatsAuxFournisseurs           : page.locator('a[href="#vueFournisseurs"]'),
                fraisFactures                   : page.locator('a[href="#vuePrestation"]')
            },
            besoins         : {
                besoinsMagasin                  : page.locator('a[href="#tabBesoinsMagasin"]'),
                ventilationsArticles            : page.locator('a[href="#tabVentilationsArticle"]'),
                ventilationsMagasins            : page.locator('a[href="#tabVentilationsMagasin"]'),
                besoinsConsolidesFournisseur    : page.locator('a[href="#tabBesoinConsolideFournisseur"]')
            },
            achatsSurPlace  : {
                achatsSurPlace                  : page.locator('a[href="#tabAchatsSurPlace"]'),
                groupesLivraisonDirecte         : page.locator('a[href="#tabGroupeLivraisonDirecte"]')
            },
            litiges         : {
                litigeAuto                      : page.locator('a[href="#litigesList"]'),
                litigeManu                      : page.locator('a[href="#lots"]'),
                demandeAvoir                    : page.locator('a[href="#demandesAvoir"]')
            },
            historique      : {
                arrivagesLots                   : page.locator('a[href="#arrivages-lots"]'),
                lotsReceptionnes                : page.locator('a[href="#solde-manuel-lots"]')
            },
            analyse         : {
                campagne                        : page.locator('a[href="#tabCampagne"]'),
                evaluationPrixRevient           : page.locator('a[href="#tabEvaluationPrixRevient"]')
            },
            referentiel     : {
                articles                        : page.locator('a[href="#articles"]'),
                fournisseurs                    : page.locator('a[href="#fournisseurs"]'),
                formatPalette                   : page.locator('a[href="#formatPalette"]'),
                gencods                         : page.locator('a[href="#gencods"]'),
                emballages                      : page.locator('a[href="#emballages"]'),
                conditionnements                : page.locator('a[href="#conditionnements"]'),
                dossiersAchat                   : page.locator('a[href="#dossiersAchat"]'),
                frais                           : page.locator('a[href="#frais"]'),
                approvisionnementAuto           : page.locator('a[href="#approAuto"]'),
                unitesTransport                 : page.locator('a[href="#unitesTransport"]'),
                fraisTransport                  : page.locator('a[href="#fraisTransports"]')
            },
            admin           : {
                administration                  : page.locator('a[href="#administration"]'),
                diffusion                       : page.locator('a[href="#diffusion"]'),
                Changelog                       : page.locator('a[href="#changelog"]'),
                parametrages                    : page.locator('a[href="#plateformes"]').nth(0),
                parametragesPlateformes         : page.locator('a[href="#plateformes"]').nth(1),
                communicationUtilisateurs       : page.locator('a[href="#communicationUtilisateur"]')
            }
        };

        this.listBoxUser        = page.locator('div.login-utilisateur a.dropdown-toggle');        
        this.linkLangueFR       = page.locator('input[id="fr"]');
        this.linkLangueIT       = page.locator('input[id="it"]');
        this.linkDeconnexion    = page.locator('[ng-click="deconnexion();"]');
        this.linkOnglets        = page.locator('ul.nav-tabs li a');

        this.fonction           = fonction;

        if (fonction !== null)  { 
            this.verboseMode        = fonction.isVerbose();
        } else {
            this.verboseMode        = false;
        }

    }

    //------------------------------------------------------------------------------------------

    /**
    * 
    * Click sur l'onglet {ongletName} situé sur la page {pageName}
    * 
    * @param {string} pageName Le nom de la page     
    * @param {string} ongletName Le nom de l'onglet
    */
    public async clickOnglet(pageName: string, ongletName: string, page: Page, delay:number = 50000, verbose:boolean = this.verboseMode){

        if (this.verboseMode) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ",ongletName);
        }

        try{  
            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            await this.fonction.checkTraductions(await this.onglets[pageName][ongletName].textContent());            
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } catch(erreor) {
            throw new Error('Ooops : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }

    }  

    /**
    * 
    * Click sur le bouton {cible} du menu
    * 
    * @param {string} cible 
    */
    public async click(cible: string, page: Page, delay:number = 50000, verbose:boolean = this.verboseMode){    

        if (this.verboseMode) {
            console.log('');
            this.fonction.cartouche("-- Page : ",cible);
        }

        if (typeof(this.menu[cible]) === 'string' ){  
            await page.locator(this.menu[cible]).click();
            await this.fonction.checkTraductions(await page.locator(this.menu[cible]).textContent());            
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('Ooops : Elément du menu "' + cible + '" inconnu')
        }

    }  

    /**
     * Sélectionne le rayon (Liste déroulante située dans le menu)
     * 
     * @param {string}  cible - élément de la liste déroulante devant être sélectionnée
     */
    public async selectRayonByName(cible:string, page:Page) {
        await page.selectOption('[ng-model="rayon"]', cible);
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }

    /**
     * 
     * @desc : selectionne la langue dans le menu utilisateur 
     * @param {char(2)} lang - Code pays
     * 
     */
    public async selectLang(slang = 'it', page:Page) {

        await this.listBoxUser.click();

        if (slang === 'it') {
            await this.linkLangueIT.click();
        } else {
            await this.linkLangueFR.click();            
        }
        this.fonction.log.set('Langue : ' + slang);
        await this.fonction.waitTillHTMLRendered(page, 30000, false);

    }

    /**
     * 
     * @desc vérifie si un onglet est visible
     * 
     * @param {string} cible Libellé de l'onglet
     * @param {bool} present Visible or not...
     */
    public async isOngletPresent(cible: string, present: boolean = true) {
        var aItemList = await this.linkOnglets.allTextContents(); //textContent()
        if (present) {
            expect(aItemList).toContain(cible);
        } else {
            expect(aItemList).not.toContain(cible);
        }
    }
        
}