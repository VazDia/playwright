/**
 * 
 * @author JOSIAS SIE
 * @since 2023-12-13
 *  
 */
const xRefTest      = "SOC_ORG_ALV";
const xDescription  = "Associer un lieu de vente sur un secteur";
const xIdTest       = 6529;
const xVersion      = '3.1';
    
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOCIETES',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['lieuVente','groupeArticle','directionExploitation'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page }                  from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log.js';
import { EsbFunctions }                     from '@helpers/esb.js';

import { MenuSociete }                      from '@pom/SOC/menu.page.js';
import { PageOrganisation }                 from '@pom/SOC/organisation.page.js';

import { AutoComplete, CartoucheInfo } 		from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageOrganisation    : PageOrganisation;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------ 

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuSociete(page, fonction);    
    pageOrganisation    = new PageOrganisation(page);
    esb                 = new EsbFunctions(fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async({}) => {
	await fonction.close();
})

//------------------------------------------------------------------------------------

var oData:any           = fonction.importJdd();

var sLieuVente          = fonction.getInitParam('lieuVente','TA_LieuDeVente'); 
const sDirectionExp     = fonction.getInitParam('directionExploitation','Grand Frais Crèmerie');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', 'Frais LS,Coupe / Corner,Consommable,Sac');

//------------------------------------------------------------------------------------    

if (oData !== undefined) {                          // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sDesignationE2E = oData.sDesignation;       // L'élément recherché est la désignation du lieu de vente préalablement créé dans le E2E
    sLieuVente          = sDesignationE2E;          // Récupération de la désignation du lieu de vente 
    log.set('E2E - Désignation : ' + sDesignationE2E);
}

var data = {
    sDirectionExp   : '',
    sRegion         : '',
    sSecteur        : '',
    sDesignation    : ''
}

//------------------------------------------------------------------------------------ 

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL :' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	})

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('P-dialog [ALERT][ERREUR][PAGE] - Check', async () => {
        await fonction.isErrorDisplayed(false, page);         // Pas d'erreur affichée à priori au chargement de la page 
    })

    test.describe('Page [ORGANISATION]', async () => {    

        var pageName = 'organisation';

        test("Menu [CLIENTS] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test('P-dialog [ALER ERREUR][PAGE CLIENTS] - Check', async () => {
            await fonction.isErrorDisplayed(false, page);   // Pas d'erreur affichée à priori au chargement de la page 
        })

        test('Input [FILTRE][ACCEDER A] = '+ sDirectionExp, async () => {
            await fonction.sendKeys(pageOrganisation.inputAccederA, sDirectionExp);
        })
 
        test('Span [ICON][PLUS][DIRECTIONEXPLOITATION] - Click', async () => {
            await fonction.wait(page, 350);
            await fonction.clickAndWait(pageOrganisation.boutonPlus, page);
            data.sDirectionExp = sDirectionExp;
        })

        test('Span [ICON][PLUS][REGION] - Click', async () => {
            await fonction.clickAndWait(pageOrganisation.boutonPlus, page);
            const region = pageOrganisation.pTreenodeLabel.nth(1);
            data.sRegion = await region.textContent();
        })

        test('Icon [ V ][Secteur] - Click', async () => {
            await fonction.clickElement(pageOrganisation.secterIconChevronDown.locator('.pi-chevron-down').nth(0));
            const secteur = pageOrganisation.pTreenodeLabel.nth(2);
            data.sSecteur = await secteur.textContent();
        })

        test('Link [AJOUTER LIEU DE VENTE] - Click', async () => {
            await fonction.clickElement(pageOrganisation.iconAjouterLieuDeVente);
        })

        var sNomPopin = "Ajout d'un lieu de vente";
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', () => {           

            test('InputField [AUTOCOMPLETE][LIEU DE VENTE] = "' + sLieuVente + '"', async () => {
                data.sDesignation = sLieuVente;
                var oData:AutoComplete = {
                    libelle         :'LIEU DE VENTE',
                    inputLocator    : pageOrganisation.pPalvAutoCompleteLDV,
                    inputValue      : sLieuVente,
                    choiceSelector  : 'ngb-typeahead-window button',
                    choicePosition  : 0,
                    typingDelay     : 150,
                    waitBefore      : 600,
                    page            : page,
                }
                
                await fonction.autoComplete(oData);
            })

            test.describe('Datagrid [GROUPE ARTICLE CONSOLIDES]', () => {
                var gpe_article = sGroupeArticle.split (',');
                var sPourEntite = " ";

                gpe_article.forEach((gpeArticle) => {

                    var iIndexGpeArticle = gpe_article.indexOf(gpeArticle);

                    test('[DIRECTION D\'EXPLOITATION]['+ iIndexGpeArticle +'] - Check', () => {
                        if(sDirectionExp == "Grand Frais Crèmerie" && (gpeArticle == "Consommable" || gpeArticle == "Sac")){
                            sPourEntite = "CR";
                        }

                        if(sDirectionExp == "Grand Frais FL" && (gpeArticle == "Consommable" || gpeArticle == "Sac")){
                            sPourEntite = "FL";
                        }

                        log.set("Direction d'exploitation : " + sDirectionExp);
                        log.set("Pour l'entite : " + sPourEntite);
                    })

                    test('Input [Td GROUPE ARTICLE]['+ iIndexGpeArticle +'][0] - Select', async () => {
                        await fonction.wait(page, 250);
                        await fonction.sendKeys(pageOrganisation.pTdGroupeArticle, gpeArticle);  
                    })

                    test('Input [Td POUR L\'ENTITE] ['+ iIndexGpeArticle +'] = '+sPourEntite+' - Click', async () => {
                        await fonction.wait(page, 250);
                        if(sPourEntite !=" "){
                            await fonction.sendKeys(pageOrganisation.pTdPourEntite, sPourEntite);
                        }
                    })

                    test('Tr [GROUPES ARTICLES CONSOLIDES] ['+ iIndexGpeArticle +'] - Click', async () => {
                        await fonction.wait(page, 550);
                        await fonction.clickElement(pageOrganisation.pCheckBoxgpeArticleClde);
                    })
                })
            })
        
            test('Button [ENREGISTRER] - Click', async () => {
               await fonction.clickElement(pageOrganisation.pPalvButtonEnregistrer);
            })
        })
        await fonction.writeData(data);
    })  //-- End Describe Page

    test('Déconnexion', async() => {
        // Si on est dans le cadre d'un E2E, sauvegarde des données pour le scénario suivant
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () => {
        if (sDirectionExp) {
            var oFlux = { 
                "FLUX" : [
                    {
                        "NOM_FLUX" : "Diffuser_OrganisationSecteur",
                    },
                    {
                        "NOM_FLUX" : "EnvoyerSecteurProsol_Pricing",
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationSecteur_Budget",
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationSecteur_Mag",
                    },
                    {
                        "NOM_FLUX" : "EnvoyerOrganisationSecteur_Qualite",
                    }
                ],
                "WAIT_BEFORE"      : 5000,
            }
            await esb.checkFlux(oFlux, page);
        } else {
            log.set('Check Flux : ACTION ANNULEE');
            test.skip();
        }
    })
})  //-- End Describe
