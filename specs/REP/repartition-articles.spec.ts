/**
 * 
 * @author Vazoumana DIARRASSOUBA
 * @since 2024-03-21
 * 
 */
const xRefTest      = "REP_REC_LIV";
const xDescription  = "Répartition d'un article";
const xIdTest       =  5631;
const xVersion      = '3.0';

var info = {
    desc        : xDescription,
    appli       : 'REP',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateformeReception','rayon','numlot'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page }      from '@playwright/test';
import { TestFunctions }                from '@helpers/functions.js';
import { Help }                         from '@helpers/helpers.js';
import { Log }                          from '@helpers/log.js';

import { MenuRepartition }              from '@pom/REP/menu.page.js';
import { ArticlesArticlesPage }         from '@pom/REP/articles-articles.page.js';

//------------------------------------------------------------------------------------
let page                        : Page;
let menu                        : MenuRepartition;
let pageArticlesArticles        : ArticlesArticlesPage;
//------------------------------------------------------------------------------------
const log               = new Log();
const fonction          = new TestFunctions(log);
//------------------------------------------------------------------------------------
var oData:any           = fonction.importJdd(); //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
const sPlateforme       = fonction.getInitParam('plateformeReception','Chaponnay');
const sRayon            = fonction.getInitParam('rayon','Fruits et légumes'); 
var codeArticle         = fonction.getInitParam('codeArticle'); 

if(oData !== undefined) {                                  // On est dans le cadre d'un E2E. Récupération des données temporaires
    var aCodesArticle = Object.keys(oData.aLots);  
    var aLotsE2E      = Object.values(oData.aLots);  
    var sNumAchatE2E  = oData.sNumAchatLong;       
    log.set('E2E - Liste des articles : ' + aCodesArticle);         
}


var repartArticle = async (iCpt:number) => {

    test.setTimeout(120000);
    log.set('Répartition article : ' + aCodesArticle[iCpt]); 

    // saisie et sélection de l'article + bouton pour répartition   
    await fonction.sendKeys(pageArticlesArticles.inputFieldCodeArticle, aCodesArticle[iCpt]);
    await fonction.wait(page, 500);

    await fonction.clickElement(pageArticlesArticles.listResults.first());
  

    await fonction.clickAndWait(pageArticlesArticles.buttonRepartir, page);

    var iNbLots = await pageArticlesArticles.dataGridNumeroLot.count();
    for (let iIndexLot = 0; iIndexLot < iNbLots; iIndexLot ++){

        var sText = await pageArticlesArticles.dataGridNumeroLot.nth(iIndexLot).textContent();
        if(sText === aLotsE2E[iCpt]){

            await fonction.clickElement(pageArticlesArticles.dataGridNumeroLot.nth(iIndexLot));
            break;
        }
    }
    await fonction.clickAndWait(pageArticlesArticles.buttonRepartirUneFois, page);

    // Sauvegarder et valider (avec pop up confirmation)
    await fonction.clickAndWait(pageArticlesArticles.buttonSauvegarder, page);

    await fonction.clickAndWait(pageArticlesArticles.buttonValider, page);

    await fonction.popinVisible(page, 'CONFIRMATION VALIDATION', true);  

    await fonction.clickAndWait(pageArticlesArticles.buttonPopinValider, page);

    await fonction.popinVisible(page, 'CONFIRMATION VALIDATION', false);

    // Terminer la répartion de l'article
    await fonction.clickAndWait(pageArticlesArticles.buttonTerminer, page);
}

 //------------------------------------------------------------------------------------
 test.describe.configure({ mode: 'serial' });
 
test.beforeAll(async ({ browser }) => {
    page                    = await browser.newPage();
    menu                    = new MenuRepartition(page, fonction);
    pageArticlesArticles    = new ArticlesArticlesPage(page);
});

//------------------------------------------------------------------------------------

test.describe('[' + xRefTest + ']' , () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ARTICLES]',async () => { 

        var sNomPage = 'articles';
        test ('Page [ARTICLES] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 

        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme par défaut
            log.set('Plateforme : ' + sPlateforme);
            log.set('Nombre de lot à agréer : ' + aLotsE2E.length);
        });

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {            
            await menu.selectRayon(sRayon, page);               // Sélection du rayon
            log.set('Rayon : ' + sRayon);
        })

        if(sNumAchatE2E != undefined){

            if (oData !== undefined) {    

                aCodesArticle.forEach((sCodeArticle:string, index:number) => {
                    test('Répartition [CODE ARTICLE] = ' + sCodeArticle, async () => {              // cas des E2E
                        await repartArticle(index);
                    })
                })
            }
            else {
        
                if (codeArticle != undefined) {              // On effectue une recherche sur la base d'un code article précis
        
                    test('InputField [CODE ARTICLE] = "' + codeArticle + '"', async () => {
                        await fonction.sendKeys(pageArticlesArticles.inputFieldCodeArticle, codeArticle);
                        await fonction.wait(page, 500);
                    })
                } else {                                                    //On exploite le premier article "répartitionnable"...
        
                    test('Header [QUANTITE A AGREE] - Click 2 X', async () => {
                        await fonction.clickElement(pageArticlesArticles.headerQteAgree);      // Pour cela on fait un filtre sur la colonne "Nb lots à répartir"
                        await fonction.wait(page, 500);
                        await fonction.clickElement(pageArticlesArticles.headerQteAgree);      // Deux fois...
                    })
                }
            
                test('CheckBox [ARTICLES][first] - Click', async  () => {
                    await fonction.clickElement(pageArticlesArticles.listResults.first());           
                })
            
                test('Button [REPARTIR ARTICLE] - Click', async () => {
                    await fonction.clickAndWait(pageArticlesArticles.buttonRepartir, page);            
                })
        
                test.describe ('Page [REPARTITION] - Click', async () => {        
        
                    test('CheckBox [LOTS A REPARTIR] - First', async  () => {                     // Sélection du 1er lot
                        await pageArticlesArticles.dataGridNumeroLot.first().click();
                    })
        
                    test('ListBox [TYPE MAGASIN] = "Afficher tous les magasins"', async () => {  // Afficher meme les magasins sans commande (gestion du cas où on a pas de commande)
                        await fonction.clickElement(pageArticlesArticles.linkTousMagasins);               
                    })
        
                    test('Filtre [ENTONNOIR] = "Afficher les magasins standards"', async () => {  // Sélection des magasins standards pour éviter le cas des hotels prioritaires
                        await pageArticlesArticles.buttonFilterMagasin.click();
                        await pageArticlesArticles.linkMagStandards.click();
                    })
                    
                    test('Input [QTE A REPARTIR] = 1 ', async () => {
                        await fonction.sendKeys(pageArticlesArticles.inputFieldColisMagasin, 1);        
                    })
        
                    test('Button [REPARTIR] - Click', async () => {
                        await fonction.clickElement(pageArticlesArticles.buttonRepartirUneFois);               
                    })
        
                    test('Button [SAUVEGARDER] - Click', async () => {
                        await fonction.clickElement(pageArticlesArticles.buttonSauvegarder);
                    })
        
                    test('Label [REPARTITION  SAUVEGARDEE A] - Is Visible', async () => {
                        expect(await pageArticlesArticles.labelSauvegarde.textContent()).toContain('Répartition sauvegardée à');
                    })
                        
                    test('Button [VALIDER LOT(S)] - Click', async () => {
                        await fonction.clickAndWait(pageArticlesArticles.buttonValider, page);               
                    })
        
                    test.describe('Popin [CONFIRMATION VALIDATION]', async () => {
        
                        test('Popin [CONFIRMATION VALIDATION] - Is Visible', async () => {
                            await fonction.popinVisible(page, 'CONFIRMATION VALIDATION', true);
                        })
                        
                        test('Label [ERREUR] -Is Not Visible', async () => {
                            await fonction.isErrorDisplayed(false, page);                            // Pas d'erreur affichée à priori au chargement de la popin
                        })
        
                        test('Popin Button [VALIDER] - Click', async () => {
                            await fonction.clickAndWait(pageArticlesArticles.buttonPopinValider, page);
                        })
        
                        test('Popin [CONFIRMATION VALIDATION] - Is Not Visible', async () => {
                            await fonction.popinVisible(page, 'CONFIRMATION VALIDATION', false);
                        })
                    })  // End describe Popin
        
                    test('Button [TERMINER] - Click', async () => {
                        await fonction.clickAndWait(pageArticlesArticles.buttonTerminer, page);
                    }) 
                    
                    test.describe('Popin [ALERTES DE REPARTITION]', async () => {
        
                        test('Button [OUI] - Click Conditionnel', async () => {
                            var isVisible = await pageArticlesArticles.pPalerteButtonOui.isVisible();
                            if(isVisible){
        
                                await pageArticlesArticles.pPalerteButtonOui.click();
                            }
                        }) 
                    })
                })
            }
        }
    })
})