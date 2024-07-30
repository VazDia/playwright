/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 28 - 11 - 2023
 */

const xRefTest      = "MAG_PRI_CAF";
const xDescription  = "Effectuer un cassé frais";
const xIdTest       =  302;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeArticle', 'groupeArticle', 'prix', 'ville'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { PrixGestion }                  from '@pom/MAG/prix-gestion.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pagePrxGestion      : PrixGestion;

const log               = new Log();

const fonction          = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sCommentaire     = 'TA_CasseFrais Motif ' + fonction.getToday() + ' ' + fonction.getBadChars();

const sNomVille        = process.env.VILLE || 'Istres (F715)';
const sCodeArticle     = process.env.CODEARTICLE || 'L'; // On choisit un code arbitraire ici pour être sûr qu'au moins un article sera selectionné après la recherche
const sGroupeArticle   = process.env.GROUPEARTICLE || 'Frais LS';
const sNouveauPrix     = process.env.PRIX || '4.48';

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pagePrxGestion  = new PrixGestion(page);
});

test.afterAll(async () => {
    await fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage();
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })
        })
  
        test('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () =>{
            await menu.selectVille(sNomVille, page);
        })

        test.describe('Page [PRIX]', async () => {     
    
            var sNomPage = 'prix';
            test('Page [PRIX] - Click', async () => {
                await menu.click(sNomPage, page);
            })

    
            test.describe('Onglet [GESTION DES PRIX]', async () => {
       
                test('Label [ERREUR] - Is NOT Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);
                })  

                test('ListBox [GROUPE] = "' + sGroupeArticle + '"', async () => {
                    await fonction.listBoxByLabel(pagePrxGestion.listBoxGrpArticle, sGroupeArticle, page);
                })
    
                test('Button [CASSE FRAIS] - Click', async () => {
                    await fonction.clickAndWait(pagePrxGestion.buttonCasseFrais, page);
                })
    
                var sNomPopin = "Changement de prix de type Offre";
                test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>{

                    test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                        await fonction.popinVisible(page, sNomPopin, true);
                    })

                    test('InputField [ARTICLE] = "' + sCodeArticle + '"', async () => {
                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pagePrxGestion.pPInputArticle,
                            inputValue      : sCodeArticle,
                            choiceSelector  :'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                    })
    
                    test('Button [ + ] - Click', async () => {
                        await fonction.clickAndWait(pagePrxGestion.pPoffreButtonPlus, page);
                    })

                    test('InputField [NOUVEAU PVC]', async () => {
                        await fonction.sendKeys( pagePrxGestion.pPinputArticleCasseFNewPrix, sNouveauPrix);
                    })
    
                    test('TextArea [MOTIF] = "' + sCommentaire + '"', async () => {
                        await fonction.sendKeys(pagePrxGestion.pPoffreTextAreaCommentaire, sCommentaire);
                    })
    
                    test('Button [ENREGISTRER] - Click', async () => {
                        await fonction.clickAndWait(pagePrxGestion.pPoffreButtonEnregistrer, page);
                    })
    
                    test('Optionnel - Message Erreur [6121] - Visible', async () =>{                        
                        // [6121] Impossible de faire une offre '-30%' sur l'article T016 - Filet de Colin d'Alaska* 220g car il est vendu à l'unité. Vous pouvez néanmoins faire un cassé frais.
                        if(await pagePrxGestion.pPoffreMessageErreur.isVisible()){
                            // Si il y a une erreur, il faut que cel soit celle attendue
                            var sLibErreur = await pagePrxGestion.pPoffreMessageErreur.textContent();
                            if(sLibErreur){
                                log.set('### RETOUR ERREUR IHM : ' + sLibErreur.toString().replace(/(\r\n|\n|\r)/gm,"") + ' ###');                            
                                expect(sLibErreur.indexOf('6121') !== -1).toBe(true);
                                await pagePrxGestion.pPoffreButtonFermer.click();  
                            }                  
                        }else
                            log.set('Pas de message d\'erreur affiché');
                            test.skip();
                        })
                    })

                    test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                        await fonction.popinVisible(page, sNomPopin, false);
                    })
                })
            }); // end describe
    })

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})