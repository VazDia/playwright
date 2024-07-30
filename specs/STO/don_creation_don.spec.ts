/**
 * 
 * @desc Créer un don
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 10 - 11 - 2023
 */

const xRefTest      = "STO_DON_CRE";
const xDescription  = "Créer un don";
const xIdTest       =  1889;
const xVersion      = '3.5';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['codeArticle', 'plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------
const { writeFile } = require('fs');
import { test, type Page}               from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { EsbFunctions }                 from "@helpers/esb";
import { Help }                         from '@helpers/helpers';

import { MenuStock }                    from "@pom/STO/menu.page";
import { StockDons }                    from "@pom/STO/stock-dons.page";
import { StockSituationDeStocks }       from '@pom/STO/stock-situations-de-stocks.page';

import { AutoComplete, CartoucheInfo } 	from '@commun/types';

//----------------------------------------------------------------------------------------

let page                :Page;

let menu                : MenuStock;
let pageDon             : StockDons;
let pageSituationStock  : StockSituationDeStocks;
let esb                 : EsbFunctions;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const plateforme  = fonction.getInitParam('plateforme','Cremcentre');
var idArticle     = fonction.getInitParam('codeArticle','C1M8');
const sJddFile    = '../../_data/_tmp/STO/gestion_don.json';
//----------------------------------------------------------------------------------------

var oData = {
    sCodeArticle : null,
    sNumLot: null
};

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage(); 
    esb                 = new EsbFunctions(fonction);
    menu                = new MenuStock(page, fonction);
    pageDon             = new StockDons(page);
    pageSituationStock  = new StockSituationDeStocks(page);
});

test.afterAll(async () => {
    await fonction.close();
})

test.describe.serial ('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        fonction.setTartTime(testInfo); 
        await helper.init();
    });

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [STOCK]', async () => {    

        var currentPage  = 'stock';

        test('Page [STOCK] - Click', async () => {
            await menu.click(currentPage, page); 
        })
              
        test.describe('Onglet [SITUATION DE STOCK]', () => {   

            test('Button [RECHERCHER] - Click', async () => {
                var iTimeout = 300000;
                test.setTimeout(iTimeout);
                await fonction.clickAndWait(pageSituationStock.buttonRechercher, page);
                await pageSituationStock.spinnerOff.waitFor({state:'attached', timeout:iTimeout});
            })

            test('DataGrid Header [COLIS EN STOCK] - Click x 2', async () => {
                await fonction.clickElement(pageDon.dataGridColisEnStock);
                await fonction.clickElement(pageDon.dataGridColisEnStock);
            })

            test('Get numero lot et code article', async ({}, testInfo) => {
                const sNumLot      = await pageSituationStock.dataGridColumnNumeroLot.nth(0).textContent();
                const sCodeArticle = await pageSituationStock.dataGridColumnCodeArticle.nth(0).textContent();
                if(sCodeArticle != null){
                    idArticle = sCodeArticle;
                }
               
                oData.sCodeArticle = sCodeArticle;
                oData.sNumLot = sNumLot;
                log.set('Code article : ' + sCodeArticle);
                log.set('Numéro lot : ' + sNumLot);

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

        test.describe('Onglet [DONS]', async () => {        
            
            test('Onglet [DONS] - Click', async () => {
                await menu.clickOnglet(currentPage, 'dons', page);
            })   

            test('Button [CREER UN DON] - Click', async () => {
                await fonction.clickAndWait(pageDon.buttonCreerDon, page, 40000);
                
            })

            var sNomPopin = 'CREATION D\'UN DON';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {            

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                if(idArticle != null){
                    test('InputField [AUTOCOMPLETE][ARTICLE]', async () => {
                        log.set('Article pour lautocomplete : ' + idArticle);
                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pageDon.pPinputArticleDon,
                            inputValue      : idArticle,
                            choiceSelector  :'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                    })
    
                    test('InputField [LOT]', async ()=>{
                        await fonction.sendKeys(pageDon.pPinputNumLotDon, oData.sNumLot);
                    })
    
                    test('Button [RECHERCHER] - Click', async() => {
                        await fonction.clickAndWait(pageDon.pPbuttonRechercherDon, page, 50000);
                    })
    
                    test('CheckBox[ARTICLE][0] - Click', async () => {
                        await fonction.clickElement(pageDon.pPcheckBoxArticleDonable.nth(0));
                    })
    
                    test('Button [AJOUTER] - Click', async () => {
                        await fonction.clickElement(pageDon.pPbuttonAjouterDon);
                    })
    
                    test('Button [ENREGISTRER] - Click', async () => {
                        await fonction.clickAndWait(pageDon.pPbuttonEnregistrerDon, page);
                    })
                }

                else {
                    log.set('Aucun lot disponible pour pouvoir créer le Don');
                }
            })
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test('** CHECK FLUX **', async () =>  {

        if (idArticle != null) {

            const oFlux = { 
                FLUX : [
                    {
                        NOM_FLUX    : "EnvoyerMouvement_Prepa",
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerMouvement_Prefac",
                    }, 
                    {
                        NOM_FLUX    : "ChangerQuantitesLots",
                    }, 
                ],
                WAIT_BEFORE     : 3000,                // Optionnel
            };

            await esb.checkFlux(oFlux, page);

        } else {

            log.set('Check Flux : ACTION ANNULEE');
            test.skip();

        }

    })
   
})