/**
 * @author Vazoumana DIARRASSOUBA
 * @desc Supprimer un triplet sur un article_Article vendu dans le vue calendrier d'approvisionnement
 * @since 2024-07-23
 * 
 */
const xRefTest      = "ACH_FRS_SUP6";
const xDescription  = "Supprimer un triplet sur un article vendu dans le vue calendrier d'approvisionnement";
const xIdTest       =  7174;
const xVersion      = '3.0';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACH',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['dossierAchat','centraleAchat', 'plateforme','rayon','fournisseur'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

const { writeFile } = require('fs');

import { expect, test, type Page}     from '@playwright/test';

import { Help }                        from '@helpers/helpers.js';
import { TestFunctions }               from '@helpers/functions.js';
import { EsbFunctions }                from '@helpers/esb.js';
import { Log }                         from '@helpers/log.js';

import { MenuAchats }                  from '@pom/ACH/menu.page.js'; 
import { PageRefArt }                  from '@pom/ACH/referentiel_articles.page.js';
import { PageAchCalApp }               from '@pom/ACH/achats_calendrier-approvisionnement.page';
import { PageRefFou }                  from '@pom/ACH/referentiel_fournisseurs.page.js';

import { AutoComplete, CartoucheInfo } from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageReferentielArt  : PageRefArt;
let pageAchCalApp       : PageAchCalApp;
let pageReferentielFour : PageRefFou;
let esb                 : EsbFunctions;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

const sJddFile           = '../../_data/_tmp/ACH_Supp_Triplet_Article.json';

var oData               : any;
var sCodeArticle        : any;

const sDossierAchat     = fonction.getInitParam('dossierAchat', 'Bcv - joubard julien');  //Anais chavanerin
const sCentraleAchat    = fonction.getInitParam('centraleAchat', 'BCT 500');
const sPlateforme       = fonction.getInitParam('plateforme', 'Cremlog');
const sRayon            = fonction.getInitParam('rayon', 'BCT');
const sGroupeArticle    = fonction.getInitParam('groupeArticle', '-- Tous --');

var sFournisseur        = fonction.getInitParam('fournisseur', 'Sas Les Ateliers Ⓔ');

const regex  = /[^a-zA-Z\s]+/g;
var sFournisseurAlphaNumerique = sFournisseur.replace(regex,'').trim();


oData = {
    sDossierAchat  : sDossierAchat,
    sCentraleAchat : sCentraleAchat,
    sPlateforme    : sPlateforme,
    sRayon         : sRayon,
    sFournisseur   : sFournisseur,
    sCodeArticle   : '',
}
//------------------------------------------------------------------------------------
test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageReferentielArt  = new PageRefArt(page);
    pageAchCalApp       = new PageAchCalApp(page);
    pageReferentielFour = new PageRefFou(page);
    esb                 = new EsbFunctions(fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async () => {
    await fonction.close();
});

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })
    })

    test.describe('Page [ACHATS]#', async () => {

        var sNomPage:string = 'achats'; 

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })
        
        test('Page [ACHATS] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async() => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxDossierAchat, sDossierAchat, page);
        })

        test('ListBox [CENTRALE D\'ACHAT', async () => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxCentraleAchat, sCentraleAchat, page);
        })

        test('DataGrid [PLATEFORME] = "' + sPlateforme + '"', async() => {            
            await fonction.clickAndWait(pageAchCalApp.tdListPlateformes.locator('span:text-is("' + sPlateforme + '")'), page);
        })

        test('DataGrid [FOURNISSEUR] = "' + sFournisseur + '"', async() => {
            await fonction.clickAndWait(pageAchCalApp.tdListFournisseurs.locator('span:text-is("' + sFournisseur + '")'), page);
        })

        test('TD [ARTICLE][0][CODE ARTICLE] - Fetch', async () => {
            var sLibelleArticle = await pageAchCalApp.tdListArticles.nth(0).textContent();
            var aLibelleArticle = sLibelleArticle.split('-');
            sCodeArticle        = aLibelleArticle[0].trim();
            oData.sCodeArticle  = sCodeArticle;
        })
    })

    test.describe('Page [REFERENTIEL]', async () => {

        var pageName    = 'referentiel';

        test("Menu [REFERENTIEL] - Click ", async () => {
           await menu.click(pageName, page);
        })

        // Vérifier que l'article a un prix catalogue et cela se fera dans l'onglet fournisseur 
        test.describe('Onglet [FOURNISSEUR]', async () => {

            test ('Onglet [FOURNISSEURS] - Click', async () => {
                await menu.clickOnglet(pageName, 'fournisseurs',page);
            })  

            test('InputField [FILTRE FOURNISSEUR] = "' + sFournisseurAlphaNumerique + '"', async () =>  {
                await fonction.sendKeys(pageReferentielFour.inputFiltreArticle, sFournisseurAlphaNumerique);
                await fonction.wait(page, 500);     // On attend que la liste se rafraîchisse
            })

            test ('CheckBox [FOURNISSEUR] - Select', async () => {
                await fonction.clickElement(pageReferentielFour.tdDesignationFournisseur.filter({ hasText: sFournisseurAlphaNumerique}));
            })

            const nomPopin = 'Saisir les prix catalogues, remises et taxes';

            test.describe('Popin [' + nomPopin.toUpperCase() + ']', async () => {

                test('Button [REMISE] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielFour.buttonRemise, page);
                });

                test('Popin [' + nomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, nomPopin, true);
                })

                test('InputField [FILTRE ARTICLE] = "' + sCodeArticle + '"', async () => {
                   await fonction.sendKeys(pageReferentielFour.pInputFiltreArticle, sCodeArticle);
                   await fonction.wait(page, 500);
                })

                test('Td [PRIX CATALOGUE] - Check', async () => {
                    var sPrixCatalogue = await pageReferentielFour.tdPrixCatalogue.first().textContent();
                    sPrixCatalogue     = sPrixCatalogue.trim();
                    log.set('Prix Catalogue : ' + sPrixCatalogue);
                    expect(sPrixCatalogue).not.toBeNull();
                    expect(sPrixCatalogue).not.toBe('');
                })

                test('Button [ANNULER] - Click', async () => {
                    await fonction.clickAndWait(pageReferentielFour.pLinkAnnuler, page);
                })

                test('Popin [' + nomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, nomPopin, false);
                })
            })
        })

        test.describe('Onglet [ARTICLES]', async () => {

            test('Onglet [ARTICLES] - Click', async () =>{
                await menu.clickOnglet(pageName, 'articles',page);
            })
    
            test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                await pageReferentielArt.listBoxGroupeArticle.selectOption({label: sGroupeArticle});
            })

            test('InputField [ARTICLE] - Selected Article', async () => {
                var oData:AutoComplete = {
                    libelle         :'Selected Article',
                    inputLocator    : pageReferentielArt.autoCompleteArts,
                    inputValue      : sCodeArticle,
                    choiceSelector  :'.gfit-autocomplete-results li',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 750,
                    page            : page,
                    clear           : true
                };
                await fonction.autoComplete(oData);
                await fonction.wait(page, 1000);
            })

            test('Pictogramme [SAISIES AUTOMATIQUES] - Click', async () => {
                await pageReferentielArt.tdDgActions.hover({timeout:250});
                await fonction.clickAndWait(pageReferentielArt.tdDgActions.locator('a[title="Saisies automatiques"]'), page);
            })

            var sNomPopin ='Données saisies automatiquement lors d\'un achat pour l\'article XXXX';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                var bTripletExistant = false;

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('ListBox [PLATEFORME DE RECEPTION] = "' + sPlateforme + '"', async () => {
                    // On verifie s'il y a au moins un ligne à supprimer au préalable
                    var isVisible = await pageReferentielArt.pPDatagridTdDesignFournisseur.isVisible();
                    if(isVisible){

                        bTripletExistant = true;
                        await fonction.clickElement(pageReferentielArt.pPlistBoxPlateFormeRecep);
                        await fonction.sendKeys(pageReferentielArt.pPInputFieldPlateformeRecep, sPlateforme); 
                        await fonction.clickElement(pageReferentielArt.pPlistBoxPlateformeReceptem);
                        var isVisibleCloseIcon = await pageReferentielArt.pPInputFieldCloseIcon.isVisible();
                        if(isVisibleCloseIcon){
                            await fonction.clickAndWait(pageReferentielArt.pPInputFieldCloseIcon, page);
                        }
                    }else{
                        
                        log.set('Aucun triplet retrouvé pour l\'article du code : ' + sCodeArticle)
                        test.skip();
                    }
                })

                test('ListBox [PLATEFORME DE DISTRIBUTION] = "' + sPlateforme + '"', async () => {
                    if(bTripletExistant){

                        await fonction.clickElement(pageReferentielArt.pPlistBoxPlateformeDist);
                        await fonction.sendKeys(pageReferentielArt.pPInputFieldPlateformeDist, sPlateforme);
                        await fonction.clickElement(pageReferentielArt.pPlistBoxPlateformeDistItem);
                        var isVisibleCloseIcon = await pageReferentielArt.pPInputFieldCloseIcon.isVisible();
                        if(isVisibleCloseIcon){
                            await fonction.clickAndWait(pageReferentielArt.pPInputFieldCloseIcon, page);
                        }
                    }else{

                        test.skip();
                    }
                })

                test('InputField [DESIGNATION FOURNISSEUR] = "' + sFournisseurAlphaNumerique.toUpperCase() + '"', async () => {
                    if(bTripletExistant){

                        await fonction.sendKeys(pageReferentielArt.pPInputDesignationFournisseur, sFournisseurAlphaNumerique.toUpperCase());
                        await fonction.wait(page, 500);
                    }else{

                        test.skip();
                    }
                })

                test(' Td [Fournisseur] - Click', async () => {
                    if(bTripletExistant){

                        await fonction.clickElement(pageReferentielArt.pPDatagridTdDesignFournisseur);
                    }else{

                        test.skip();
                    }
                })

                test('Button [SUPPRIMER ET FERMER] - Click', async () => {
                    if(bTripletExistant){

                        await fonction.clickAndWait(pageReferentielArt.pPButtonSupprimerEtFermer, page);
                    }else{

                        test.skip();
                    }
                })

                test('Button [FERMER] - Click conditionnel', async ()=> {
                    if(!bTripletExistant){

                        fonction.clickAndWait(pageReferentielArt.pPButtonFermer, page);
                    }else{

                        test.skip();
                    }
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })
        })
    })

    test.describe('Page [ACHATS]##', async () => {

        var sNomPage:string = 'achats'; 

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })
        
        test('Page [ACHATS] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async() => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxDossierAchat, sDossierAchat, page);
        })

        test('ListBox [CENTRALE D\'ACHAT', async () => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxCentraleAchat, sCentraleAchat, page);
        })

        test('DataGrid [PLATEFORME] = "' + sPlateforme + '"', async() => {            
            await fonction.clickAndWait(pageAchCalApp.tdListPlateformes.locator('span:text-is("' + sPlateforme + '")'), page);
        })

        test('DataGrid [FOURNISSEUR] = "' + sFournisseur + '"', async() => {
            await fonction.clickAndWait(pageAchCalApp.tdListFournisseurs.locator('span:text-is("' + sFournisseur + '")'), page);
        })

        test('Input [A ACHETER][0] ="1"', async () => {
            await fonction.sendKeys(pageAchCalApp.inputAchete.nth(0), '1');
        })

        test('Button [ACHETER ET CONFIRMER] - Click', async () => {
            await fonction.clickAndWait(pageAchCalApp.buttonAcheterConfirmer, page);
        })

        var sNomPopin = 'Initialiser les données des nouveaux articles';
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, true);
            })

            test('Button [ANNULER] - Click', async () => {
                await fonction.clickAndWait(pageAchCalApp.pPLinkAnnuler, page)
            })

            test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                await fonction.popinVisible(page, sNomPopin, false);
            })
        })
    })

    test('JDD [EMBALLAGE BON] - Save', async ({},testInfo) => {
        //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
        writeFile(testInfo.config.rootDir + sJddFile, JSON.stringify(oData, null, 2), (error) => {
            if (error) {
            console.log('An error has occurred ', error);
            return;
            }
            log.set('Enregistrement de la donnée dans le fichier : ' + sJddFile);
        });
    })
})