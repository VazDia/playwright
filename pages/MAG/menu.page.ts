/**
 * Page MAGASIN > MENU
 * 
 * @author JOSIAS SIE
 * @version 3.11
 * 
 */

import { TestFunctions } from '@helpers/functions';
import { expect, Page, Locator } from '@playwright/test';

export class MenuMagasin {

    public menu                                 : any;
    public onglets                              : any;
    private verboseMode                         : boolean;
    private readonly fonction                   : TestFunctions;

    private readonly linkOnglets                : Locator;
    public  readonly listBoxUser                : Locator;
    private readonly checkBoxLangueIT           : Locator;
    private readonly checkBoxLangueFR           : Locator;   
    public  readonly linkBrowserSecurity        : Locator;
    public  readonly inputVille                 : Locator;
    public  readonly listBoxVille               : Locator;
    public  readonly pPopinAlerteSanitaire      : Locator;
    public  readonly pPlabelAlerteSanitaire     : Locator;
    public  readonly pPbuttonFermer             : Locator;
    public  readonly linkMenus                  : Locator;
    public  readonly linkDeconnexion            : Locator;
    public  readonly linkDelegation             : Locator;
    public  readonly menuInMenusItem            : Locator;
    public  readonly ongletsAlertes             : Locator;
    public  readonly ongletsAuto                : Locator;
    public  readonly ongletSCFooterBtn          : Locator;
    public  readonly ongletACFooterBtn          : Locator;

    //-- POPIN: Délégation en mon absence --------------------------------------------

    public  readonly  pPdelegButtonPlus         : Locator;
    public  readonly  pPdelegButtonEnregist     : Locator;

    public  readonly  pPdelegInputUser          : Locator;

    public  readonly  pPdelegTdLieuxVentes      : Locator;

    public  readonly  pPdelegLinkAnnuler        : Locator;

    public  readonly  pPdelegCheckBoxAllDeleg   : Locator;

   //---------------------------------------------------------------------------------

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu = {
            accueil         : '#main-navbar .item0 a',
            commandes       : '#main-navbar .item1 a',
            stock           : '#main-navbar .item2 a',
            prix            : '#main-navbar .item3 a',
            facturation     : '#main-navbar .item4 a',
            ventes          : '#main-navbar .item5 a',
            emballages      : '#main-navbar .item6 a',        
            access          : '#main-navbar .item11 a',
            alertes         : '#main-navbar .item10 a',  
            preparation     : '#main-navbar .item12 a',     
            tableauBord     : '#main-navbar .item13 a',
            autorisations   : '#main-navbar .item7 a',                 
            referentiel     : '#main-navbar .item9 a',         
        };

        //------------------------------------------------------------------------------------------

        this.onglets = {

            //-----------------------Page accueil------------------------

            accueil: {
                commandes               : page.locator('a[href="#etat-commandes"]'),
                etatEngagements         : page.locator('a[href="#etat-engagements"]'),
                meteo                   : page.locator('a[href="#meteo"]')
            },

            //-----------------------Page commandes------------------------

            commandes: {
                commande                : page.locator('a[href="#commande"]').nth(0),
                achatSurPlace           : page.locator('a[href="#commande"]').nth(1),
                engagements             : page.locator('a[href="#commande"]').nth(2),
                opportunites            : page.locator('a[href="#opportunite"]'),
                commandeSelonModele     : page.locator('a[href="#commande"]').nth(3)
            },

            //-----------------------Page stock----------------------------

            stock: {
                livraisons              : page.locator('a[href="#livraisons"]'),
                stock                   : page.locator('a[href="#stock"]'),
                stockASurveiller        : page.locator('a[href="#stockASurveiller"]'),
                casse                   : page.locator('a[href="#casse"]'),
                dons                    : page.locator('a[href="#dons"]'),
                histoInventaire         : page.locator('a[href="#historiqueInventaires"]'),
                implantation            : page.locator('a[href="#implatationMagasin"]'),
                stockFinJournee         : page.locator('a[href="#stock-fin-journee"]')
            },

            //-----------------------Page Prix----------------------------

            prix: {
                gestionPrix             : page.locator('a[href="#gestionPrix"]'),
                impressionEtiquettes    : page.locator('a[href="#impressionEtiquettes"]')
            },

            //-----------------------Page facturation----------------------

            facturation: {
                blDefinitifs            : page.locator('a[href="#bons-livraisons"]'),
                demandeAvoir            : page.locator('a[href="#demandes-avoir"]'),
                demandeEchange          : page.locator('a[href="#demandes-echange"]')
            },

            //-----------------------Page ventes----------------------------

            ventes: {
                venteJournee            : page.locator('a[href="#analyse-ventes"]'),
                evenementsExceptionnels : page.locator('a[href="#evenement-exceptionnel"]')
            },

            //-----------------------Page emballages-----------------------

            emballages: {
                stockBons               : page.locator('a[href="#emballages"]'),
                suiviBons               : page.locator('a[href="#suiviDesbons"]')
            },

            //-----------------------Page alertes--------------------------

            alertes: {
                suiviCentrale           : page.locator('a[href="#suiviGeneral"]'),
                historiqueCentrale      : page.locator('a[href="#HistoriqueGeneral"]'),
                modeleAlertes           : page.locator('a[href="#modeleAlerte"]'),
                infosQualite            : page.locator('a[href="#suiviInfoQualite"]'),
                traitementMagasin       : page.locator('a[href="#traitementMagasin"]'),
                historiqueMagasin       : page.locator('a[href="#HistoriqueTraitementAlerte"]'),
                infoQualiteMagasin      : page.locator('a[href="#infoQualiteMagasin"]')
            },
            
            //-----------------------Page access---------------------------

            access: {
                lienExterne1            : page.locator('a[href="#lienExterne1"]'),
                lienExterne2            : page.locator('a[href="#lienExterne2"]')
            },

            //-----------------------Page autorisations--------------------

            autorisations: {
                autorisationAchatCentrale     : page.locator('a[href="#autorisations-ace"]'),
                modelesAssortiment            : page.locator('a[href="#autorisations-modele-assortiment"]'),
                autorisationLivraisonsDirectes: page.locator('a[href="#autorisations-asp"]'),
                engagements                   : page.locator('a[href="#autorisations-engagement"]'),
                opportunites                  : page.locator('a[href="#autorisations-opportunite"]'),
                modelesCommande               : page.locator('a[href="#modeles-commande"]'),
                parametrage                   : page.locator('a[href="#parametrage"]'),
                blocage                       : page.locator('a[href="#blocage"]'),
                echanges                      : page.locator('a[href="#echanges"]'),
                groupeMagasins                : page.locator('a[href="#groupes-magasins"]'),
                gammes                        : page.locator('a[href="#gammes"]'),
                recomOuverture                : page.locator('a[href="#recommandations-ouverture"]'),
                prixLocaux                    : page.locator('a[href="#prix-locaux"]')
            },

            //-----------------------Page referentiel----------------------

            referentiel: {
                admin                         : page.locator('a[href="#admin"]'),
                communication                 : page.locator('a[href="#communicationUtilisateur"]'),
                renvoyer                      : page.locator('a[href="#renvoyerCommandes"]'),
                suppimer                      : page.locator('a[href="#supprimerCommandes"]'),
                modifEngagement               : page.locator('a[href="#modifierEngagements"]'),
                GenerAuto                     : page.locator('a[href="#generationsAutomatiques"]'),
                suiviGener                    : page.locator('a[href="#suiviGenerationsAc"]'),
                executor                      : page.locator('a[href="#executors"]'),
                changelog                     : page.locator('a[href="#changelog"]'),
                parametrage                   : page.locator('a[href="#parametrage"]'),
                LDV                           : page.locator('a[href="#lieuxVente"]'),
                stockDLC                      : page.locator('a[href="#stockDlc"]'),
                utilisateurs                  : page.locator('a[href="#utilisateurs"]')
            }
        };

        this.linkOnglets            = page.locator('ul.nav-tabs li a');
        this.listBoxUser            = page.locator('div.login-utilisateur a.dropdown-toggle');
        this.linkDeconnexion        = page.locator('[ng-click="deconnexion();"]');
        this.linkDelegation         = page.locator('[ng-click="delegation();"]');
        this.linkMenus              = page.locator('ul.nav');
        this.linkBrowserSecurity    = page.locator('[ng-click="$event.preventDefault(); navigateurNonSupporte = false;"]');

        this.checkBoxLangueIT       = page.locator('input[id="it"]');
        this.checkBoxLangueFR       = page.locator('input[id="fr"]');

        this.inputVille             = page.locator('[ng-model="autocompleteLieuDeVente.codeLieuDeVente"]');

        this.listBoxVille           = page.locator('[ng-model="lieuVenteSelectionneInScope"]');

        this.pPopinAlerteSanitaire  = page.locator('.modal[data-backdrop="static"]').nth(2);

        this.pPlabelAlerteSanitaire = page.locator('div.popup-information H3.modal-title');

        this.pPbuttonFermer         = page.locator('.popup-information > div.modal-footer > a');

        this.menuInMenusItem        = page.locator('#main-navbar li a[ng-click="$event.preventDefault();"] span:nth-child(1)') ;

        this.ongletsAlertes         = page.locator('[ng-controller="AlerteControleur"] ul li a[ng-click="$event.preventDefault();"]');
        this.ongletSCFooterBtn      = page.locator('div.form-btn-section div.containerBT button:NOT([ng-show="!estLectureSeule()"])');
        this.ongletsAuto            = page.locator('[ng-controller="AutorisationsControleur"] ul li a[ng-click="$event.preventDefault();"]');
        this.ongletACFooterBtn      = page.locator('div.form-btn-section div.containerBT button');

        //-- POPIN: Délégation en mon absence --------------------------------------------

        this.pPdelegButtonPlus          = page.locator('[title="Ajouter le délégué au lieu de vente."]');
        this.pPdelegButtonEnregist      = page.locator('.modal-footer button[ng-click="onClickOk()"]').nth(1)
        
        this.pPdelegInputUser           = page.locator('#autocompleteUser');

        this.pPdelegTdLieuxVentes       = page.locator('tbody .datagrid-designation');

        this.pPdelegLinkAnnuler         = page.locator('.modal-footer a[ng-click="onClickClose($event)"]').nth(1);

        this.pPdelegCheckBoxAllDeleg    = page.locator('modal[titre="Délégation en mon absence"] .modal-body datagrid thead input[type="checkbox"]');

        // --------------------------------------------------------------------------------

        this.fonction               = fonction;
        
        if (fonction !== null)  { 
            this.verboseMode        = fonction.isVerbose();
        } else {
            this.verboseMode        = false;
        }

    }

    /**
     * 
     * @description : selectionne la langue dans le menu utilisateur 
     * @param {string} lang - Code pays
     * 
     */
    public async selectLang(lang:string = 'it') {
        await this.listBoxUser.click();
        if (lang == 'it') {
            await this.checkBoxLangueIT.click();
        } else {
            await this.checkBoxLangueFR.click();            
        }
    }

    /**
     * 
     * @desc : Sélectionnne une ville de la liste déroulante située dans le menu
     * @param {string} ville - Nom de la ville (Exemple : 'Bergerac (550)')
     * @param {Page} page
     * 
     */
    public async selectVille(ville: string, page:Page) {      

        const clickable  = await page.isEnabled('[ng-model="lieuVenteSelectionneInScope"]');

        if (clickable) {
            await this.listBoxVille.selectOption({label: ville});
            await this.fonction.waitTillHTMLRendered(page, 30000, false);
            await this.removeArlerteMessage();                             // Peut être qu'une alerte Sanitaire est apparue ?
        }else {
            throw new Error('Ooops : ListBox des Lieux de vente non sélectionnable');
        }
        
    }

    /**
     * 
     * @desc : Suppression du message d'alerte si celui-ci s'affiche
     * 
     */
    public async removeArlerteMessage() {              
        if (await this.pPlabelAlerteSanitaire.isVisible()) {                       
            await this.pPbuttonFermer.click();
        } 
    }

    /**
     * 
     * @desc : Saisie le code du lieu de vente
     * @param {integer} codeSociete - Nom de la ville (Exemple : 'Bergerac')
     * @param {Locator} selector 
     * 
     */
    public async selectVilleByKeys(codeSociete: string, selector:Locator = this.listBoxVille) {

        const clickable  = await selector.isEnabled();

        if (clickable) {
            await selector.click();            // SetFocus
            await selector.fill(codeSociete);
            await this.removeArlerteMessage(); // Peut être qu'une alerte Sanitaire est positionnée sur la nouvelle ville
        } else {
            throw new Error('Ooops : L\'inputField du code' +codeSociete+ 'societe du Lieu de vente non sélectionnable');                
        }
    } 

    /**
     * 
     * @desc vérifie si un onglet est visible
     * 
     * @param {string} cible Libellé de l'onglet
     * @param {bool} present Visible or not...
     */
    public async isOngletPresent(cible: string, present: boolean = true) {
        if (present) {
            var aItemList = await this.linkOnglets.allTextContents(); //textContent()
            expect(aItemList).toContain(cible);
        } else {
            var aItemList = await this.linkOnglets.allTextContents();
            expect(aItemList).not.toContain(cible);
        }
    }

    /**
     * 
     * @desc vérifie si un menu est visible
     * 
     * @param {string} cible Libellé du menu
     * @param {bool} present Visible or not...
     */
    public async isMenuPresent(cible: string, present: boolean = true) {
        if (present) {
            var aItemList = await this.linkMenus.allTextContents();
            expect(aItemList).toContain(cible);
        } else {
            var aItemList = await this.linkMenus.allTextContents();
            expect(aItemList).not.toContain(cible);
        }
    }

    /**
    * 
    * Click sur l'onglet {ongletName} situé sur la page {pageName}
    * 
    * @param {string} pageName   Le nom de la page
    * @param {string} ongletName Le nom de l'onglet
    */
    public async clickOnglet(pageName: string, ongletName: string, page: Page, delay:number = 500000, verbose:boolean = this.verboseMode){

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ",ongletName);
        }

        if (this.onglets[pageName][ongletName]) {
            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            this.fonction.checkTraductions(this.onglets[pageName][ongletName].textContent());
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
            await this.removeArlerteMessage();                             // Peut être qu'une alerte Sanitaire est apparue ?
        } else {
            throw new Error('Ooops : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }
    }  

    /**
    * 
    * Click sur le bouton {cible} du menu
    * 
    * @param {string} cible 
    */
    public async click(ongletName: string, page: Page, delay:number = 50000, verbose:boolean = this.verboseMode) {

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Page : ",ongletName);
        }

        
        if (typeof(this.menu[ongletName]) === 'string' )
        {  
            var target = page.locator(this.menu[ongletName]);
            //await expect(target).toBeEnabled();
            await target.click();
            this.fonction.checkTraductions(await target.textContent());
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
            await this.removeArlerteMessage();                             // Peut être qu'une alerte Sanitaire est apparue ?
        } else {
            throw new Error('Ooops : Elément du menu "' + ongletName + '" inconnu');
        }
    } 

     /**
     * 
     * @param {string} pageName       : Nom du menu
     * @param {string} ongletName     : Nom de l'Onglet (optionnel)
     * @param {Page} page
     * @returns Nombre pastilles
     * @description Retourle le nombre de pastilles visibles dans le menu ou l'onglet
     * 
     **/
    public async getPastilles (pageName:string,  page: Page, ongletName: string = '') {
        if (ongletName !== '') {
            // On souhaite afficher le nombre de pastilles contenues dans l'ONGLET
            const tbOngletName = Object.keys(this.onglets[pageName]);
            const index        = tbOngletName.indexOf(ongletName);

            if (index > -1) {
                const ePastille = page.locator(`ul.nav-tabs li:nth-child(${index + 1}) span.badge-important:not(.ng-hide)`);
                
                if (await ePastille.isVisible()) {
                    const iNbPastilles = await ePastille.innerText();
                    return parseInt(iNbPastilles, 10);
                } else {
                    return 0;
                }
            } else {
                throw new Error(`NotFoundError : Onglet "${ongletName}" inconnu dans la page "${pageName}".`);
            }
        } else {
            // On souhaite afficher le nombre de pastilles contenues dans le MENU
            if (typeof this.menu[pageName] === 'string') {
                const ePastille = page.locator(`${this.menu[pageName]} span.badge-important:not(.ng-hide)`);
    
                if (await ePastille.isVisible()) {
                    const iNbPastilles = await ePastille.innerText();
                    return parseInt(iNbPastilles, 10);
                } else {
                    return 0;
                }
            } else {
                throw new Error(`NotFoundError : Élément du menu "${pageName}" inconnu.`);
            }
        }
    }

}