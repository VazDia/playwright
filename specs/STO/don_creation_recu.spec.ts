/**
 * 
 * @desc Créer un don
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 14 - 11 - 2023
 */

const xRefTest      = "STO_DON_REC";
const xDescription  = "Créer un reçu";
const xIdTest       =  1894;
const xVersion      = '3.2';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['groupeArticle', 'plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { EsbFunctions }                  from "@helpers/esb";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                     from "@pom/STO/menu.page";
import { StockDons }                     from "@pom/STO/stock-dons.page";

//----------------------------------------------------------------------------------------

let page        :Page;

let menu        : MenuStock;
let pageDon     : StockDons;
let esb         : EsbFunctions;

const log       = new Log();
const fonction  = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const plateforme      = process.env.PLATEFORME || 'Cremcentre';
const groupeArticle   = process.env.GROUPEARTICLE || 'Frais LS';

//----------------------------------------------------------------------------------------

var oData = {
    bSelectionnable : true
}

var setDonSelectionnable = function(bStatut) {
    oData.bSelectionnable = bStatut;
}

var isDonPresent = function() {
    return oData.bSelectionnable;
}

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page      = await browser.newPage(); 
    esb       = new EsbFunctions(fonction);
    menu      = new MenuStock(page, fonction);
    pageDon   = new StockDons(page);
});

test.afterAll(async () => {
    await log.get();
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
        await menu.selectPlateforrme(page, plateforme);               
    })

    test.describe('Page [STOCK]', async () => {    

        var currentPage  = 'stock';

        test('Page [STOCK] - Click', async () => {
            await menu.click(currentPage, page); 
        })

        test.describe('Onglet [DONS] >', async () => {        
            
            test('Onglet [DONS] - Click', async () => {
                await menu.clickOnglet(currentPage, 'dons', page);
            })

            test ('ListBox [GROUPE ARTICLE] = "' + groupeArticle + '"', async () => {
                await fonction.listBoxByLabel(pageDon.listBoxGroupeArticle, groupeArticle, page);
            })

            test('CheckBox[LISTE DONS][rnd] - Click', async () => {
                if(await pageDon.checkBoxListeDons.first().isVisible()) {
                    var iNbChoix = await pageDon.checkBoxListeDons.count();
                    var rnd = Math.floor(fonction.random() * iNbChoix);
                    var sChoix = await pageDon.tdListeNumeroLot.nth(rnd).textContent();
                    log.set('Numéro Lot Article Sélectionné : ' + sChoix);   
                    await pageDon.checkBoxListeDons.nth(rnd).click();
                }else {
                    setDonSelectionnable(false);
                    log.set("Aucun don sélectionnable");
                }
            })

            test('Button [CREER UN RECU] - Click', async () => {
                if (isDonPresent()){
                    await fonction.clickAndWait(pageDon.buttonCreerRecu, page, 40000);
                } else {
                    log.set("Création recu annulé");
                }

            })

            var sNomPopin = 'CREATION D\'UN RECU';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', () => {   

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    if(isDonPresent()){
                        await fonction.popinVisible(page, sNomPopin, true);
                    }else {
                        console.log('Ouverture popin' + sNomPopin.toUpperCase() + 'ignoré')
                    }     
                }) 

                test('ListBox [BENEFICIARE][rnd] - Click', async () => {
                    if (isDonPresent()){
                        await pageDon.pPlistBoxBenefRecu.click();
                        await pageDon.pPlisteChoixBenef.first().waitFor();
                        var iNbChoix = await pageDon.pPlisteChoixBenef.count();
                        var rnd = Math.floor(fonction.random() * (iNbChoix - 1) + 1);
                        var sChoix = await pageDon.pPlisteChoixBenef.nth(rnd).textContent()
                        log.set('Bénéficiare : ' + sChoix);
                        pageDon.pPlisteChoixBenef.nth(rnd).click();
                    } else {
                        log.set('Sélection bénéficicière ignorée');
                    }
                })               

                //Test.noHtmlInNewTab('RECU AU TITRE DE DON NUMERO xxx',  PageDon.pPbuttonCreerRecu,  4000);

                test('Button [CREER] - Click', async () => {
                    if (isDonPresent()){
                        await pageDon.pPbuttonCreerRecu.waitFor();
                        await pageDon.pPbuttonCreerRecu.click();
                    } else {
                        log.set('Création ignorée');
                    }
                }) 

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })                      
                
            }) 
        })
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})
